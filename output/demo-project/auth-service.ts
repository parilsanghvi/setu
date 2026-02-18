import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService, User } from './user-service'; // Assuming User is now exported from user-service.ts

/**
 * AuthService handles user registration, login, and JWT management.
 * It interacts with UserService for user data persistence.
 */
export class AuthService {
    private userService: UserService;
    private jwtSecret: string;
    private passwordMinLength: number = 8; // Minimum password length requirement

    /**
     * @param userService An instance of UserService to manage user data.
     * @param jwtSecret The secret key for signing and verifying JWTs.
     */
    constructor(userService: UserService, jwtSecret: string) {
        if (!jwtSecret || jwtSecret.trim() === '') {
            throw new Error('JWT secret must be provided to AuthService.');
        }
        this.userService = userService;
        this.jwtSecret = jwtSecret;
    }

    /**
     * Registers a new user by hashing their password and storing them via UserService.
     * @param name The user's name.
     * @param email The user's email.
     * @param password The user's plain-text password.
     * @returns A promise that resolves to the newly created user (excluding password hash).
     * @throws Error if password strength is not met or if user already exists (from UserService).
     */
    public async register(name: string, email: string, password: string): Promise<Omit<User, 'hashedPassword'>> {
        if (!password || password.length < this.passwordMinLength) {
            throw new Error(`Password must be at least ${this.passwordMinLength} characters long.`);
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // UserService.createUser will need to accept the hashedPassword
        const newUser = this.userService.createUser(name, email, hashedPassword);

        // Return a public representation of the user, omitting the hashed password
        return newUser.toPublicUser();
    }

    /**
     * Authenticates a user by verifying their email and password.
     * If successful, generates and returns a JSON Web Token (JWT).
     * @param email The user's email.
     * @param password The user's plain-text password.
     * @returns A promise that resolves to the generated JWT string.
     * @throws Error if user is not found or credentials are invalid.
     */
    public async login(email: string, password: string): Promise<string> {
        const user = this.userService.getUser(email);

        if (!user) {
            throw new Error('User not found.');
        }

        // Ensure the user actually has a password set (i.e., registered through AuthService)
        if (!user.hashedPassword) {
            throw new Error('User account not configured for password authentication. Please register.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials.');
        }

        const tokenPayload = {
            id: user.id, // User ID is crucial for identifying the user in subsequent requests
            email: user.email,
        };

        // Sign the token with the secret and set an expiration time
        const token = jwt.sign(tokenPayload, this.jwtSecret, { expiresIn: '1h' }); // Token valid for 1 hour
        return token;
    }

    /**
     * Verifies a given JSON Web Token (JWT).
     * @param token The JWT string to verify.
     * @returns A promise that resolves to the decoded token payload.
     * @throws Error if the token is invalid or expired.
     */
    public async verifyToken(token: string): Promise<string | jwt.JwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.jwtSecret, (err, decoded) => {
                if (err) {
                    if (err instanceof jwt.TokenExpiredError) {
                        return reject(new Error('Token expired.'));
                    }
                    if (err instanceof jwt.JsonWebTokenError) {
                        return reject(new Error('Invalid token.'));
                    }
                    // Catch any other unexpected JWT errors
                    return reject(err);
                }
                resolve(decoded as jwt.JwtPayload); // Decoded can be string or object
            });
        });
    }
}
