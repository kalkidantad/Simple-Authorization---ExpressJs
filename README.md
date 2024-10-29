# Simple-Authorization---ExpressJs
Middleware: The server uses middleware to parse JSON request bodies and serve static files from a 'public' directory.

User Management: An in-memory array (users) is used to store registered users. The application defines two secret keys for JWT signing, one for access tokens and another for refresh tokens.

Token Verification: A middleware function verifyToken checks for the presence of a valid access token in the request headers, allowing access to protected routes.

User Registration: The /register route allows new users to sign up by providing a username, email, and password. The password is hashed before being stored to ensure security.

User Login: The /login route authenticates users by checking their email and password. If valid, it generates and returns an access token (valid for 10 minutes) and a refresh token (valid for 7 days).

Profile Access: The /profile route is protected by the verifyToken middleware, allowing users to access their profile information if they provide a valid access token.

Token Refresh: The /token route allows users to obtain a new access token using a valid refresh token, extending their session without needing to log in again.
