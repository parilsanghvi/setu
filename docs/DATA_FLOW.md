---
source_hash: b264458b15b9032e
facts_hash: b264458b15b9032e
generated_at: 2026-03-04T07:16:32.580Z
generator_version: 1.0.0
model: cheap
quality_score: 0
---
# Data Flow & Workflows

## Task Lifecycle
1. A user initiates a task by submitting an HTTP request to `/api/tasks`.
	* The request is received by the `TaskController` class (`controllers/taskController.js`) and then dispatched to the `AgentManager` class (`agents/agentManager.js`).
2. The `AgentManager` class determines which agent should handle the task based on its type and configuration.
3. The selected agent (e.g., `TaskAgent`) is instantiated and receives the task details from the `AgentManager` class.
4. The `TaskAgent` class executes the task by calling its own methods, such as `executeTask()`.
5. After completing the task, the `TaskAgent` class sends a completion message to the `AgentManager` class using the WebSocket bus (`socket.ioClient.js`).
6. The `AgentManager` class updates the task status in the database and notifies other relevant agents.
7. Once all agents have completed their tasks, the task is marked as complete.

## Agent Communication
1. When an agent needs to send a message to another agent, it uses the WebSocket bus (`socket.ioClient.js`) to establish a connection with the target agent.
2. The agent serializes its message using JSON and sends it over the WebSocket connection.
3. The receiving agent deserializes the message and processes it accordingly.

## Authentication Flow
1. When an HTTP request is received by the server, the `RequestHandler` class (`handlers/requestHandler.js`) checks for authentication headers.
2. If the authentication header is missing or invalid, the request is denied and a 401 Unauthorized response is sent.
3. If the authentication header is valid, the request is forwarded to the `AuthenticationMiddleware` class (`middleware/authenticationMiddleware.js`).
4. The `AuthenticationMiddleware` class verifies the authentication credentials using the `authenticator()` function (`agents authenticator.js`) and checks if the user is authorized to access the requested resource.
5. If the user is authenticated, a JWT token is generated and sent back to the client as a response header.
6. The client can then use this token to authenticate subsequent requests.

## Onboarding Pipeline
1. A new repository is created or updated in the GitHub repository.
2. The `governance-digest.yml` workflow (`github/workflows/governance-digest.yml`) is triggered, which runs the `digest` job.
3. The `digest` job checks if the repository meets onboarding requirements by calling the `validateOnboarding()` function (`agents/agentManager.js`).
4. If the repository fails validation, an error message is displayed to the user and the pipeline is stopped.
5. Once validation succeeds, the `digest` job generates a digest report for governance-related information and uploads it to a database or storage solution.
6. The report provides an overview of the repository's configuration, dependencies, and other relevant data.

## Mermaid Diagram
mermaid
graph LR
    TaskController ->> AgentManager: dispatch task
    AgentManager ->> TaskAgent: execute task
    TaskAgent ->> TaskStatusDB: update task status
    AgentManager ->> WebSocketBus: send completion message
    WebSocketBus ->> AgentManager: receive message
    RequestHandler ->> AuthenticationMiddleware: verify authentication
    AuthenticationMiddleware ->> authenticator: verify credentials
    authenticator ->> JWTGenerator: generate token
    AuthenticationMiddleware ->> client: send response with token
