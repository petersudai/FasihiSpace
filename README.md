# FasihiSpace

FasihiSpace is a full-stack blog platform where users can create, read, update, and delete blog posts. The platform allows for user authentication, image uploads, post commenting, and more. It is built with a modern web technology stack, combining React on the frontend and Node.js with Express and MongoDB on the backend.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Project Architecture](#project-architecture)
5. [Setup and Installation](#setup-and-installation)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [Usage](#usage)
9. [License](#license)

---

## Project Overview

FasihiSpace is designed to be a user-friendly blogging platform with a focus on simplicity and scalability. Users can register and log in, create blog posts with images, comment on posts, and view other users’ content. Posts are stored in a MongoDB database, and the application uses JSON Web Tokens (JWT) for secure authentication.

### Key Features:
- User Authentication (Register/Login)
- Create, Edit, Delete Blog Posts
- Upload Blog Post Images
- Comment on Posts
- Like Blog Posts
- Pagination and Search Functionality
- Protected routes for authenticated users

---

## Technologies Used

### Frontend:
- **React**: For building the user interface.
- **React Router**: For handling route navigation.
- **Axios**: For making HTTP requests to the backend.
- **React Quill**: For rich text editing in posts.

### Backend:
- **Node.js**: For building the server-side logic.
- **Express.js**: For routing and middleware support.
- **MongoDB**: NoSQL database to store users, posts, and comments.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **JWT**: For authentication via token-based sessions.
- **Bcrypt**: For hashing passwords.

---

## Project Architecture

The project follows a **client-server architecture**. The **frontend** (client) sends requests to the **backend** (server), which processes them and communicates with a **MongoDB database** to perform CRUD operations.


1. **Frontend**: React handles UI rendering, routing, and sending requests to the backend.
2. **Backend**: Node.js/Express manages routing, authentication, validation, and handles requests.
3. **Database**: MongoDB stores all the application data, such as users, posts, and comments.

---

## Setup and Installation

### Prerequisites:
Make sure you have the following tools installed on your system:
- **Node.js** (v14 or higher)
- **NPM** (comes with Node.js)
- **MongoDB** (running locally or hosted)


---

## Backend Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/fasihispace.git
    ```

2. **Navigate to the backend folder**
    ```bash
    cd fasihispace/backend
    ```

3. **Install backend dependencies**
    ```bash
    npm install
    ```

4. **Set up environment variables**
   Create a `.env` file in the `backend` folder and add the following:

    ```bash
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. **Start the backend server**
    ```bash
    npm run dev
    ```

---

## Frontend Setup

1. **Navigate to the frontend folder**
    ```bash
    cd fasihispace/frontend
    ```

2. **Install frontend dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
   Create a `.env` file in the `frontend` folder and add the following:

    ```bash
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4. **Start the frontend development server**
    ```bash
    npm start
    ```

This will start the frontend on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## Usage

### Creating an Account:
1. Navigate to the registration page (`/register`) and create a new account.
2. After registering, log in with your credentials.
3. Create new blog posts, upload images, and interact with posts by commenting and liking them.

### Accessing Posts:
1. Posts are accessible to all users on the homepage.
2. Only the authors of a post can edit or delete their own posts.
3. The platform supports pagination, filtering, and search features.

---

## License

This project is licensed under the MIT License.