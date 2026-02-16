import express, { Request, Response, NextFunction } from 'express';

// Initialize the Express application
const app = express();

// Define the port, prioritizing the environment variable
const PORT = process.env.PORT || 3000;

// --- Middleware Setup ---

// 1. JSON Body Parser
// Enable parsing of `application/json` request bodies.
app.use(express.json());

// --- Route Definitions ---

// 1. Health Check Endpoint
// A simple `GET /` route to confirm the service is running.
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// --- Error Handling Middleware ---

// 1. 404 Not Found Handler (Catch-All)
// This middleware is triggered for any request that doesn't match a defined route.
// It must be placed after all route definitions.
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// 2. Global Error Handler
// This is the final middleware, designed to catch any errors that occur.
// The four-argument signature `(err, req, res, next)` is specific to error-handling middleware in Express.
// It prevents sensitive information like stack traces from being sent to the client.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error internally for debugging, but don't expose it to the client.
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// --- Server Activation ---

// Start the server and listen for incoming connections on the configured port.
app.listen(PORT, () => {
  console.log(`[Guru] Server is running and listening on port ${PORT}`);
});
