## Backend Application (Express.js & MySQL)

**This project utilizes Express.js for building the server-side application and leverages MySQL for database management.**

**Please run the project with the command: `npm run server`**

### User Model

The User model within the application represents a registered user and stores their information:

- **Basic Fields:**
  - `fullName`: User's full name
  - `username`: Unique username (likely email address)
  - `password`: Hashed password for secure storage
  - `mobileNumber` (optional): Optional field for user's mobile number (validation can be added here)
  - `language`: User's preferred language preference
- **Account Status:**
  - `activeFlag`: Boolean indicating whether the account is active or disabled by an admin
  - `verified`: Boolean indicating whether the user has verified their email address
- **Admin Status:**
  - `isAdmin`: Boolean flag denoting if the user is an administrator

### Server Startup

Upon starting the Express server, the application performs the following checks:

1. **Database Creation:**
   - It attempts to locate the database name specified in the `config.js` file.
   - If the database doesn't exist, it creates it for efficient storage of user data.
2. **Admin User Creation:**
   - After verifying the database presence, the application checks for an admin user.
   - If no admin user exists, it creates a default admin user with the credentials `username: admin@gmail.com` and `password: admin123`.

### API Module

The API module provides various functionalities accessible through endpoints:

#### 1. Register

- This API endpoint allows users to register for a new account.
- Upon successful registration, a verification email is sent to the provided email address to confirm the user's identity.

#### 2. Login

- This API endpoint authenticates user credentials (username and password).
- If the credentials are valid, the endpoint responds with a JSON Web Token (JWT) that can be used for subsequent authenticated API calls.

#### 3. Verify

- This API endpoint verifies a user's account, enabling them to log in after email confirmation.

#### 4. Get Details

- This is a protected API endpoint, meaning it requires a valid JWT for authorization.
- If the authenticated user is not an admin, the endpoint responds with their user details.
- For admin users, this endpoint retrieves and returns details of all registered users (excluding other admins) for management purposes.

#### 5. Toggle Activation

- Only accessible to admin users, this API endpoint allows toggling the active status of another user's account. This enables admins to manage user access.

**This documentation provides a high-level overview of the backend functionalities. More detailed information regarding specific aspects (e.g., data validation, error handling) may be included in separate sections for a comprehensive understanding.**
