# FasihiSpace - Backend

This is the backend of FasihiSpace, a full-stack blog platform where users can create, edit, view, and interact with blog posts. The backend is built using Node.js, Express.js, MongoDB, and other related technologies. It handles user authentication, CRUD operations for blog posts, and various other features related to the platform's functionality.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [API Endpoints](#api-endpoints)
4. [Setup and Installation](#setup-and-installation)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Middleware](#middleware)
8. [Authentication](#authentication)
9. [Error Handling](#error-handling)
10. [License](#license)

---

## Features

- **User Registration & Login**: Users can register an account and log in with email and password. Passwords are securely hashed using Bcrypt.
- **JWT Authentication**: JSON Web Tokens (JWT) are used for securing API endpoints and user authentication.
- **CRUD for Posts**: Users can create, read, update, and delete posts. Only the author of a post can edit or delete it.
- **File Uploads**: Users can upload images for posts using Multer.
- **Pagination and Sorting**: Posts can be paginated and sorted based on date or likes.
- **Likes and Comments**: Users can like posts and add comments to interact with content.
- **Search and Filtering**: Posts can be searched and filtered based on title, content, author, tags, etc.

---

## Technologies Used

- **Node.js**: Server-side JavaScript runtime for building the backend.
- **Express.js**: Web framework for handling routes, middleware, and API endpoints.
- **MongoDB**: NoSQL database used for storing user data, blog posts, and comments.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB, allowing interaction with the database using JavaScript objects.
- **JWT (JSON Web Tokens)**: For secure user authentication and authorization.
- **Bcrypt**: For hashing passwords securely before storing them in the database.
- **Multer**: Middleware for handling file uploads, especially images for blog posts.
- **Cors**: For managing cross-origin resource sharing between frontend and backend.

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in an existing user.

### Posts

- `GET /api/posts` - Get all posts (supports pagination, search, and sorting).
- `GET /api/posts/:id` - Get a specific post by ID.
- `POST /api/posts` - Create a new post (authenticated users only).
- `PUT /api/posts/:id` - Update a post (only post owners).
- `DELETE /api/posts/:id` - Delete a post (only post owners).

### Comments

- `POST /api/comments/:postId` - Add a comment to a post.
- `GET /api/comments/:postId` - Get all comments for a post.

### Likes

- `POST /api/likes/:postId` - Like a post.
- `DELETE /api/likes/:postId` - Unlike a post.

---

## Setup and Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/fasihispace-backend.git
    ```

2. **Navigate to the project directory**
    ```bash
    cd fasihispace-backend
    ```

3. **Install dependencies**
    ```bash
    npm install
    ```

4. **Set up environment variables**
    Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

5. **Run the server in development mode**
    ```bash
    npm run dev
    ```

6. **Run the server in production mode**
    ```bash
    npm start
    ```

7. **Test the server using Postman or any API testing tool.**

---

## Environment Variables

Ensure the following variables are defined in your `.env` file:

- `MONGO_URI`: The connection string to your MongoDB database.
- `JWT_SECRET`: A secret key used to sign JWT tokens for authentication.
- `PORT` (optional): The port the server will run on (default is `5000`).

---

## Middleware

### Authentication Middleware

Located in `/middleware/authMiddleware.js`, this middleware verifies JWT tokens on protected routes. If a valid token is provided, it decodes the user and attaches it to the `req.user` object.

### CORS Middleware

To enable cross-origin requests from the frontend to the backend, the app uses the **Cors** package, which allows requests from the frontend (running on a different port) to be accepted.

---

## Authentication

- **JWT**: Tokens are signed and returned during login or registration. For protected routes (like creating or editing posts), the JWT is sent in the headers (`x-auth-token`) and verified using the `authMiddleware.js`.

---

## Error Handling

Centralized error handling is implemented using `try...catch` blocks, and proper HTTP status codes are returned depending on the type of error:

- `400`: Bad request (e.g., missing or invalid input).
- `401`: Unauthorized access (e.g., invalid or missing JWT token).
- `404`: Resource not found (e.g., post or user does not exist).
- `500`: Server error (e.g., database connection failure or unexpected error).

---

## License

This project is licensed under the MIT License.



