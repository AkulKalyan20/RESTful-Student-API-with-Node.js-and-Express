# Student Management System API

A RESTful API for managing student records built with Node.js, Express, and MongoDB. This API provides endpoints for performing CRUD operations on student data with authentication.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- VS Code or any text editor
- Postman (for API testing)

## 🚀 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd student-management-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example` and update with your configuration:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/studentDB
     JWT_SECRET=your_jwt_secret_key
     NODE_ENV=development
     ```

4. **Start the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
```
Request Body:
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

### Students

#### Get All Students
```
GET /api/students
```
Headers:
```
Authorization: Bearer <token>
```

#### Get Single Student
```
GET /api/students/:id
```

#### Create Student
```
POST /api/students
```
Request Body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "grade": "A",
  "courses": ["Math", "Science"]
}
```

#### Update Student
```
PUT /api/students/:id
```
Request Body:
```json
{
  "name": "Updated Name",
  "grade": "B"
}
```

#### Delete Student
```
DELETE /api/students/:id
```

## 🧪 Testing

### Using Postman
1. Import the Postman collection from `/postman` directory
2. Set up the environment variables in Postman
3. Run the requests in sequence (login first to get the auth token)

### Using Web Interface
1. Open `http://localhost:3000` in your browser
2. Use the interactive web interface to test all endpoints

## 🛠️ Project Structure

```
student-management-api/
├── config/               # Configuration files
├── controllers/          # Request handlers
├── middleware/           # Custom middleware
├── models/               # Database models
├── routes/               # Route definitions
├── public/               # Static files
│   └── index.html        # Web interface
├── .env.example          # Environment variables example
├── app.js               # Main application file
└── package.json         # Project dependencies
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Node.js and Express
- MongoDB for data storage
- JWT for authentication

## Features

- Create, read, update, and delete student records
- Search and filter students
- Pagination support
- Input validation
- Error handling
- CORS enabled
- Request logging

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (running locally or connection string)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd student-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` by default.

## API Endpoints

### Create a Student
- **POST** `/api/students`
  - Request body should be a JSON object with student details
  
  Example:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 20,
    "grade": "A",
    "courses": ["Math", "Science"]
  }
  ```

### Get All Students
- **GET** `/api/students`
  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Number of items per page (default: 10)
    - `grade` - Filter by grade (A, B, C, D, F)
    - `search` - Search by name or email

### Get Single Student
- **GET** `/api/students/:id`
  - Returns a single student by ID

### Update Student
- **PUT** `/api/students/:id`
  - Updates a student by ID
  - Request body should contain the fields to update

### Delete Student
- **DELETE** `/api/students/:id`
  - Deletes a student by ID

## Testing with Postman

1. Import the following collection into Postman:
   ```
   {
       "info": {
           "_postman_id": "student-api-collection",
           "name": "Student API",
           "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
       },
       "item": [
           {
               "name": "Create Student",
               "request": {
                   "method": "POST",
                   "header": [
                       {
                           "key": "Content-Type",
                           "value": "application/json"
                       }
                   ],
                   "body": {
                       "mode": "raw",
                       "raw": "{\n    \"name\": \"John Doe\",\n    \"email\": \"john.doe@example.com\",\n    \"age\": 20,\n    \"grade\": \"A\",\n    \"courses\": [\"Math\", \"Science\"]\n}"
                   },
                   "url": {
                       "raw": "http://localhost:3000/api/students",
                       "protocol": "http",
                       "host": ["localhost"],
                       "port": "3000",
                       "path": ["api", "students"]
                   }
               }
           },
           {
               "name": "Get All Students",
               "request": {
                   "method": "GET",
                   "header": [],
                   "url": {
                       "raw": "http://localhost:3000/api/students",
                       "protocol": "http",
                       "host": ["localhost"],
                       "port": "3000",
                       "path": ["api", "students"]
                   }
               }
           },
           {
               "name": "Get Single Student",
               "request": {
                   "method": "GET",
                   "header": [],
                   "url": {
                       "raw": "http://localhost:3000/api/students/:id",
                       "protocol": "http",
                       "host": ["localhost"],
                       "port": "3000",
                       "path": ["api", "students", ":id"]
                   }
               }
           },
           {
               "name": "Update Student",
               "request": {
                   "method": "PUT",
                   "header": [
                       {
                           "key": "Content-Type",
                           "value": "application/json"
                       }
                   ],
                   "body": {
                       "mode": "raw",
                       "raw": "{\n    \"name\": \"John Updated\"\n}"
                   },
                   "url": {
                       "raw": "http://localhost:3000/api/students/:id",
                       "protocol": "http",
                       "host": ["localhost"],
                       "port": "3000",
                       "path": ["api", "students", ":id"]
                   }
               }
           },
           {
               "name": "Delete Student",
               "request": {
                   "method": "DELETE",
                   "header": [],
                   "url": {
                       "raw": "http://localhost:3000/api/students/:id",
                       "protocol": "http",
                       "host": ["localhost"],
                       "port": "3000",
                       "path": ["api", "students", ":id"]
                   }
               }
           }
       ]
   }
   ```

2. Replace `:id` in the URLs with actual student IDs when testing.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/studentDB
```

## Error Handling

The API returns appropriate HTTP status codes and JSON responses with error details when something goes wrong.

## License

This project is open source and available under the [MIT License](LICENSE).
