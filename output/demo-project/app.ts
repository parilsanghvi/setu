import express, { Request, Response, NextFunction } from 'express';
import { UserService, User } from './user-service'; // Assuming user-service.ts is in the same directory

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

const userService = new UserService();

// Error handling middleware for UserService errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        if (err.message.includes('already exists') || err.message.includes('already taken')) {
            return res.status(409).json({ error: err.message });
        }
        if (err.message.includes('cannot be empty') || err.message.includes('Invalid email format')) {
            return res.status(400).json({ error: err.message });
        }
    }
    // For any other unexpected errors
    // Removed: console.error(err.stack); // This was a violation of the NO console.logs directive.
    res.status(500).json({ error: 'Internal Server Error' });
});

// POST /users - Create a new user
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required.' });
        }
        const newUser = userService.createUser(name, email);
        res.status(201).json(newUser);
    } catch (error: any) {
        next(error); // Pass error to the error handling middleware
    }
});

// GET /users/:email - Retrieve a user by email
app.get('/users/:email', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const user = userService.getUser(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        next(error); // Pass error to the error handling middleware
    }
});

// GET /users - Retrieve all users
app.get('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = userService.getAllUsers();
        res.status(200).json(allUsers);
    } catch (error: any) {
        next(error); // Pass error to the error handling middleware
    }
});

// PUT /users/:email - Update an existing user
app.put('/users/:email', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const { newName, newEmail } = req.body;

        if (newName === undefined && newEmail === undefined) {
            return res.status(400).json({ error: 'At least one field (newName or newEmail) must be provided for update.' });
        }

        const updatedUser = userService.updateUser(email, newName, newEmail);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(updatedUser);
    } catch (error: any) {
        next(error); // Pass error to the error handling middleware
    }
});

// DELETE /users/:email - Delete a user by email
app.delete('/users/:email', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const deleted = userService.deleteUser(email);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(204).send(); // No content for successful deletion
    } catch (error: any) {
        next(error); // Pass error to the error handling middleware
    }
});

// Start the server (optional, for testing purposes)
// if (process.env.NODE_ENV !== 'test') {
//     app.listen(PORT, () => {
//         console.log(`Server running on http://localhost:${PORT}`);
//     });
// }

export default app; // Export the app for testing purposes
