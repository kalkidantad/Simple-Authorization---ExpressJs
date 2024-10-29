# Simple-Authorization---ExpressJs

Since the files were too large to upload on Github, you can start by creating a project for creating node modules.

npm init -y
npm install express jsonwebtoken bcryptjs



Middleware: The server uses middleware to parse JSON request bodies and serve static files from a 'public' directory.

User Management: JSON is used for user management by facilitating the exchange of user credentials and authentication tokens between the client and server. When a user submits their login information (email and password), it is serialized into a JSON object and sent to the server via a POST request.

Token Verification: A middleware function verifyToken checks for the presence of a valid access token in the request headers, allowing access to protected routes.

User Registration: The /register route allows new users to sign up by providing a username, email, and password. The password is hashed before being stored to ensure security.

User Login: The /login route authenticates users by checking their email and password. If valid, it generates and returns an access token (valid for 10 minutes) and a refresh token (valid for 7 days).

Profile Access: The /profile route is protected by the verifyToken middleware, allowing users to access their profile information if they provide a valid access token.


