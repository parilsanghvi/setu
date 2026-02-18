export class User {
    public id: string; // Unique identifier for the user
    public name: string;
    public email: string;
    public hashedPassword?: string; // Optional: Stores the hashed password

    constructor(id: string, name: string, email: string, hashedPassword?: string) {
        if (!id || id.trim() === '') {
            throw new Error('User ID cannot be empty.');
        }
        if (!name || name.trim() === '') {
            throw new Error('User name cannot be empty.');
        }
        if (!email || email.trim() === '') {
            throw new Error('User email cannot be empty.');
        }
        // Basic email format validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            throw new Error('Invalid email format.');
        }

        this.id = id;
        this.name = name.trim();
        this.email = email.trim().toLowerCase(); // Store email in lowercase for consistency
        this.hashedPassword = hashedPassword;
    }

    /**
     * Returns a new object with sensitive information (like hashedPassword) omitted.
     */
    public toPublicUser(): Omit<User, 'hashedPassword'> {
        const { hashedPassword, ...publicUser } = this;
        return publicUser;
    }
}

export class UserService {
    private _users: Map<string, User>; // email -> User

    constructor() {
        this._users = new Map<string, User>();
    }

    /**
     * Creates a new user.
     * @param name The name of the user.
     * @param email The email of the user.
     * @param hashedPassword Optional hashed password, if registering with credentials.
     * @returns The newly created User object.
     * @throws Error if user with email already exists.
     */
    public createUser(name: string, email: string, hashedPassword?: string): User {
        const trimmedEmail = email.trim().toLowerCase();

        if (this._users.has(trimmedEmail)) {
            throw new Error(`User with email '${email}' already exists.`);
        }

        // Generate a simple unique ID for the new user
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const newUser = new User(id, name, email, hashedPassword); // User constructor handles validation for name/email
        this._users.set(newUser.email, newUser);
        return newUser;
    }

    /**
     * Retrieves a user by their email.
     * @param email The email of the user to retrieve.
     * @returns The User object or undefined if not found.
     */
    public getUser(email: string): User | undefined {
        return this._users.get(email.trim().toLowerCase());
    }

    /**
     * Retrieves all users, returning their public representations (without hashed passwords).
     * @returns An array of public User objects.
     */
    public getAllUsers(): Array<Omit<User, 'hashedPassword'>> {
        return Array.from(this._users.values()).map(user => user.toPublicUser());
    }

    /**
     * Updates an existing user's name or email.
     * @param email The current email of the user to update.
     * @param newName Optional new name for the user.
     * @param newEmail Optional new email for the user.
     * @returns The updated User object or undefined if user not found.
     * @throws Error for empty names/emails, invalid email format, or email already taken.
     */
    public updateUser(email: string, newName?: string, newEmail?: string): User | undefined {
        const currentEmail = email.trim().toLowerCase();
        const user = this._users.get(currentEmail);

        if (!user) {
            return undefined; // User not found
        }

        let updatedName = user.name;
        let updatedEmail = user.email;

        if (newName !== undefined) {
            if (newName.trim() === '') {
                throw new Error('New name cannot be empty.');
            }
            updatedName = newName.trim();
        }

        if (newEmail !== undefined) {
            const trimmedNewEmail = newEmail.trim().toLowerCase();
            if (trimmedNewEmail === '') {
                throw new Error('New email cannot be empty.');
            }
            if (!/\S+@\S+\.\S+/.test(trimmedNewEmail)) {
                throw new Error('Invalid new email format.');
            }

            if (trimmedNewEmail !== currentEmail && this._users.has(trimmedNewEmail)) {
                throw new Error(`New email '${newEmail}' is already taken by another user.`);
            }
            updatedEmail = trimmedNewEmail;
        }

        // If email changed, remove old entry and add new one
        if (updatedEmail !== currentEmail) {
            this._users.delete(currentEmail);
            // Create a new User object to ensure constructor validation and immutability for the email field
            // Preserve the original ID and hashedPassword
            const updatedUser = new User(user.id, updatedName, updatedEmail, user.hashedPassword);
            this._users.set(updatedUser.email, updatedUser);
            return updatedUser;
        } else {
            // Update existing user object if only name changed or no email change
            user.name = updatedName;
            return user;
        }
    }

    /**
     * Deletes a user by their email.
     * @param email The email of the user to delete.
     * @returns True if the user was deleted, false otherwise.
     */
    public deleteUser(email: string): boolean {
        return this._users.delete(email.trim().toLowerCase());
    }
}
