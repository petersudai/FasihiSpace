FasihiSpace is a blogging platform created by Peter Sudai.

Technologies used include MongoDB, Express, NodeJs and React.

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/fasihi-space.git
cd fasihi-space

2. Install Dependencies
Backend
cd backend
npm install

Frontend
cd frontend
npm install

3. Set Up Environment Variables
Create a .env file in the root of your backend directory and add the following values:
PORT=5000
MONGO_URI=your-mongo-connection-string
JWT_SECRET=your-jwt-secret

4. Start the Backend Server
In the backend directory, run the following command to start the server:

npm start

5. Start the Frontend Application
In the frontend directory, run the following command to start the React application:

npm start

This will start the frontend app at http://localhost:3000.

Visit http://localhost:3000 to interact with the platform’s frontend


API Endpoints

Authentication
POST /api/auth/register: Register new user
POST /api/auth/login: Log in a registered user

Posts
GET /api/posts: Fetch all posts.
GET /api/posts/:id: Fetch a single post by ID
POST /api/posts: Create a new post (requires authentication)
PUT /api/posts/:id: Update a post by ID (requires authentication)
DELETE /api/posts/:id: Delete a post by ID (requires authentication)

Likes
POST /api/likes/:id: Like or unlike a post (requires authentication)

Comments
POST /api/comments/:postId: Add a comment to a post (requires authentication)