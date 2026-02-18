import asyncio
import json
import redis.asyncio as redis
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Dict, Optional, Literal, Union
from jose import JWTError, jwt
from pydantic import BaseModel, ValidationError
import time # For token expiry
from contextlib import asynccontextmanager

# Guru's recommendation:
# PROTOCOL: WebSockets for its simplicity and client-server architecture.
# FRAMEWORK: FastAPI for its native async support and high performance.

# This is a minimal, correct starting point for Tark.
# It establishes the basic connection management required for a chat application.

# --- Redis Configuration ---
REDIS_URL = "redis://localhost:6379" # Use environment variable in production
CHANNEL_BROADCAST = "chat:broadcast"
CHANNEL_PRIVATE_PREFIX = "chat:user:"

# --- Authentication Configuration (for JWT) ---
SECRET_KEY = "your-super-secret-key" # In a real app, use environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 3600 # 1 hour

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # For HTTP endpoints, not directly used by WS but good for context

# Dummy user database
DUMMY_USERS_DB = {
    "tark": {"username": "tark", "password": "password123"},
    "rakshak": {"username": "rakshak", "password": "password123"},
    "guru": {"username": "guru", "password": "password123"},
}

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str # For a real app, hash this

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        # For this dummy example, password is not hashed
        return UserInDB(**user_dict, hashed_password=user_dict["password"])
    return None

def create_access_token(data: dict, expires_delta: Optional[float] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = time.time() + expires_delta
    else:
        expire = time.time() + ACCESS_TOKEN_EXPIRE_SECONDS
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Authentication Endpoint ---
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(DUMMY_USERS_DB, form_data.username)
    # WARNING: In a real app, verify hashed password (e.g., bcrypt.checkpw)
    if not user or user.hashed_password != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- WebSocket Authentication Dependency ---
async def get_current_user_ws(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Token missing")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token payload")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = get_user(DUMMY_USERS_DB, username)
        if user is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="User not found")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Could not validate credentials")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

# --- WebSocket Message Models ---
class BaseWebSocketMessage(BaseModel):
    """Base model for all WebSocket messages."""
    type: str # e.g., "chat", "system", "private_chat", "action"

class ClientChatMessage(BaseWebSocketMessage):
    """Message sent from client to server to send a chat message."""
    type: Literal["chat_message"]
    content: str
    recipient: Optional[str] = None # For private messages

class ClientWebSocketMessage(BaseModel):
    """Union of all possible message types sent from client to server."""
    payload: ClientChatMessage # Currently only chat messages are supported

class ServerChatMessage(BaseWebSocketMessage):
    """Message sent from server to client for general chat."""
    type: Literal["chat_message"]
    sender: str
    content: str
    timestamp: float = time.time()

class ServerSystemMessage(BaseWebSocketMessage):
    """Message sent from server to client for system notifications."""
    type: Literal["system_message"]
    content: str
    timestamp: float = time.time()

class ServerPrivateMessage(BaseWebSocketMessage):
    """Message sent from server to client for private chat."""
    type: Literal["private_chat_message"]
    sender: str
    content: str
    timestamp: float = time.time()

class ServerWebSocketMessage(BaseModel):
    """Union of all possible message types sent from server to client."""
    payload: Union[ServerChatMessage, ServerSystemMessage, ServerPrivateMessage]

class ConnectionManager:
    """
    Manages active WebSocket connections and Redis Pub/Sub.
    Decouples message sending from local connections for horizontal scalability.
    """
    def __init__(self, redis_client: redis.Redis):
        self.active_connections: Dict[str, WebSocket] = {}
        self.redis = redis_client
        self.pubsub = self.redis.pubsub()
        self.listener_task: Optional[asyncio.Task] = None

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        if client_id in self.active_connections:
            try:
                # Notify the old connection before closing it
                old_connection_message = ServerWebSocketMessage(
                    payload=ServerSystemMessage(content=f"You have been disconnected because a new connection was made from client ID: {client_id}")
                ).json()
                await self.active_connections[client_id].send_text(old_connection_message)
            except RuntimeError:
                pass # Old connection might already be closed
            await self.active_connections[client_id].close(code=status.WS_1011_INTERNAL_ERROR, reason="New connection established")
            print(f"Client {client_id} (old connection) forcibly disconnected due to new connection.")

        self.active_connections[client_id] = websocket
        print(f"Client {client_id} connected locally.")

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            print(f"Client {client_id} disconnected locally.")

    async def _redis_message_handler(self, message):
        """Handle incoming messages from Redis Pub/Sub."""
        if message['type'] == 'message' or message['type'] == 'pmessage':
            try:
                # Parse Redis message data into a ServerWebSocketMessage Pydantic model
                redis_data = json.loads(message['data'].decode('utf-8'))
                server_message = ServerWebSocketMessage.parse_obj({"payload": redis_data}) # Wrap payload in ServerWebSocketMessage structure

                if isinstance(server_message.payload, ServerChatMessage):
                    # Broadcast message
                    for client_id, connection in list(self.active_connections.items()):
                        try:
                            await connection.send_json(server_message.payload.dict())
                        except RuntimeError as e:
                            print(f"Error sending broadcast to {client_id}: {e}. Disconnecting.")
                            self.disconnect(client_id)
                elif isinstance(server_message.payload, ServerSystemMessage):
                    # System message (broadcast to all)
                    for client_id, connection in list(self.active_connections.items()):
                        try:
                            await connection.send_json(server_message.payload.dict())
                        except RuntimeError as e:
                            print(f"Error sending system message to {client_id}: {e}. Disconnecting.")
                            self.disconnect(client_id)
                elif isinstance(server_message.payload, ServerPrivateMessage):
                    # Private message, check if recipient is local
                    # For private messages from Redis, the channel itself would contain recipient info
                    # For now, let's assume `ServerPrivateMessage` contains `recipient` if we add it in future.
                    # As current ServerPrivateMessage doesn't have recipient, this logic needs adjustment.
                    # For the current setup, _redis_message_handler will not receive private messages
                    # directly targetting a client unless we subscribe to client-specific channels.
                    # Let's adjust for private messages published to `CHANNEL_PRIVATE_PREFIX + client_id`
                    target_client_id_from_channel = message['channel'].decode('utf-8').replace(CHANNEL_PRIVATE_PREFIX, '')
                    if target_client_id_from_channel in self.active_connections:
                        try:
                            await self.active_connections[target_client_id_from_channel].send_json(server_message.payload.dict())
                        except RuntimeError as e:
                            print(f"Error sending private message to {target_client_id_from_channel}: {e}. Disconnecting.")
                            self.disconnect(target_client_id_from_channel)

            except json.JSONDecodeError:
                print(f"Received non-JSON message from Redis: {message['data']}")
            except ValidationError as e:
                print(f"Received invalid structured message from Redis: {e} - Data: {message['data']}")
            except Exception as e:
                print(f"Error processing Redis message: {e} - Message: {message}")

    async def run_listener(self):
        """Starts the Redis Pub/Sub listener in a background task."""
        await self.pubsub.subscribe(CHANNEL_BROADCAST)
        # Subscribe to pattern for private messages (all private channels)
        await self.pubsub.psubscribe(CHANNEL_PRIVATE_PREFIX + '*')
        print(f"Subscribed to Redis channels: {CHANNEL_BROADCAST} and pattern {CHANNEL_PRIVATE_PREFIX}*")
        try:
            while True:
                message = await self.pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                if message:
                    await self._redis_message_handler(message)
                await asyncio.sleep(0.01) # Small sleep to prevent busy-waiting
        except asyncio.CancelledError:
            print("Redis listener task cancelled.")
        except Exception as e:
            print(f"Error in Redis listener task: {e}")
        finally:
            await self.pubsub.punsubscribe() # Use punsubscribe for pattern subscription
            await self.pubsub.unsubscribe()
            print("Unsubscribed from Redis channels.")


    async def start_redis_listener(self):
        """Call this during app startup to start the listener."""
        self.listener_task = asyncio.create_task(self.run_listener())

    async def stop_redis_listener(self):
        """Call this during app shutdown to stop the listener."""
        if self.listener_task:
            self.listener_task.cancel()
            await self.listener_task # Await until task is actually cancelled

    async def publish_message_to_redis(self, channel: str, message_payload: BaseModel):
        """Helper to publish structured messages to Redis."""
        try:
            await self.redis.publish(channel, message_payload.json())
        except Exception as e:
            print(f"Error publishing message to Redis channel {channel}: {e}")


# FastAPI lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.redis = redis.Redis.from_url(REDIS_URL)
    await app.state.redis.ping()
    print("Connected to Redis.")
    app.state.manager = ConnectionManager(app.state.redis)
    await app.state.manager.start_redis_listener()
    yield
    # Shutdown
    await app.state.manager.stop_redis_listener()
    await app.state.redis.close()
    print("Disconnected from Redis.")

app = FastAPI(
    title="Chat Backend",
    description="Minimal FastAPI WebSocket Chat Server with Redis Pub/Sub and JSON Messages",
    version="0.1.1",
    lifespan=lifespan
)


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    current_user: User = Depends(get_current_user_ws)
):
    """
    The main WebSocket endpoint for chat clients.
    - Requires a valid JWT token in the query parameter `token`.
    - `client_id` is derived from the authenticated user's username.
    - Expects and sends structured JSON messages.
    """
    client_id = current_user.username
    await app.state.manager.connect(websocket, client_id)

    # Publish join message via Redis
    system_join_message = ServerSystemMessage(content=f"Client #{client_id} has joined the chat.")
    await app.state.manager.publish_message_to_redis(
        CHANNEL_BROADCAST,
        system_join_message
    )

    try:
        while True:
            try:
                # Expect JSON message from the client
                json_data = await websocket.receive_json()
                client_message = ClientWebSocketMessage.parse_obj({"payload": json_data})

                if isinstance(client_message.payload, ClientChatMessage):
                    if client_message.payload.recipient:
                        # Handle private message
                        private_message = ServerPrivateMessage(
                            sender=client_id,
                            content=client_message.payload.content
                        )
                        # Publish to recipient's private channel
                        await app.state.manager.publish_message_to_redis(
                            CHANNEL_PRIVATE_PREFIX + client_message.payload.recipient,
                            private_message
                        )
                        # Optionally, send a confirmation to the sender
                        await websocket.send_json(
                            ServerSystemMessage(content=f"Private message sent to {client_message.payload.recipient}").dict()
                        )
                    else:
                        # Handle broadcast chat message
                        chat_message = ServerChatMessage(
                            sender=client_id,
                            content=client_message.payload.content
                        )
                        await app.state.manager.publish_message_to_redis(
                            CHANNEL_BROADCAST,
                            chat_message
                        )
                else:
                    # Handle unknown client message types gracefully
                    await websocket.send_json(
                        ServerSystemMessage(content=f"Unknown message type received: {client_message.payload.type}").dict()
                    )

            except ValidationError as e:
                print(f"Invalid message format from client {client_id}: {e}")
                await websocket.send_json(
                    ServerSystemMessage(content=f"Invalid message format. Error: {e.errors()}").dict()
                )
            except json.JSONDecodeError:
                print(f"Received non-JSON message from client {client_id}.")
                await websocket.send_json(
                    ServerSystemMessage(content="Expected JSON message, but received invalid format.").dict()
                )


    except WebSocketDisconnect:
        app.state.manager.disconnect(client_id)
        # Publish leave message via Redis
        system_leave_message = ServerSystemMessage(content=f"Client #{client_id} has left the chat.")
        await app.state.manager.publish_message_to_redis(
            CHANNEL_BROADCAST,
            system_leave_message
        )
    except Exception as e:
        # Catch other potential errors in the WebSocket loop
        print(f"Unhandled error in WebSocket connection for {client_id}: {e}")
        app.state.manager.disconnect(client_id)
        # Publish error message via Redis
        system_error_message = ServerSystemMessage(content=f"Client #{client_id} disconnected due to an error.")
        await app.state.manager.publish_message_to_redis(
            CHANNEL_BROADCAST,
            system_error_message
        )
        # Also try to inform the client directly if possible
        try:
            await websocket.send_json(system_error_message.dict())
        except RuntimeError:
            pass # Client already disconnected

# To run this server:
# 1. Install dependencies: pip install "fastapi[all]" python-jose[cryptography] "redis[hiredis]" uvicorn
# 2. Make sure a Redis server is running (e.g., via Docker: docker run --name some-redis -p 6379:6379 -d redis)
# 3. Run with uvicorn: uvicorn main:app --reload
# 4. Obtain a token first:
#    POST http://127.0.0.1:8000/token with form data: username=tark, password=password123
# 5. Connect a WebSocket client to: ws://127.0.0.1:8000/ws?token=<YOUR_JWT_TOKEN_HERE>
# 6. Example Client-to-Server JSON messages:
#    - Public Chat: {"payload": {"type": "chat_message", "content": "Hello everyone!"}}
#    - Private Chat: {"payload": {"type": "chat_message", "content": "Hello Rakshak!", "recipient": "rakshak"}}
# 7. To test scalability, run multiple instances on different ports:
#    uvicorn main:app --port 8001 --reload
#    uvicorn main:app --port 8002 --reload
#    Then connect clients to different ports. Messages should propagate across all instances.
