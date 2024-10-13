# 📊 Data Management API

This API allows users to manage data, including creating, reading, updating, and deleting (CRUD) operations. It is built using **TypeScript**, **Express.js**, and **MongoDB**, utilizing **JWT** for authentication. The API supports pagination, sorting, and filtering features for improved data handling.

## 📋 Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Technologies Used](#technologies-used)
- [License](#license)

## 🚀 Features

- User authentication using **JWT**
- Role-based access control (admin and regular users)
- Create, read, update, and delete data
- Pagination, sorting, and filtering capabilities
- Error handling and validation
- Built with **TypeScript** and object-oriented programming principles

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (version X.X.X)
- **MongoDB** (version X.X.X)
- Postman or any API client for testing

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
2. Install dependencies:
   ```bash
     npm install
   ```
3.  Create a .env file in the root directory and add your environment variables:
   ```env
    PORT=5000
    JWT_SECRET_KEY=your_jwt_secret
    JWT_EXPIRES_IN=1h
    MONGO_URI=mongodb://localhost:27017/your-db-name
  ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Start the server:
   ```bash
   npm start
   ```
## 📡 API Endpoints

### 1. Create Data
- **Endpoint:** `POST /api/data`

**Headers:**
**Request Body:**
```json
{
  "title": "Data Title",
  "description": "Data Description"
}
```
<h2> Response: </h2>

<li> 201 Created: Data created successfully </li>
<li> 403 Forbidden: Access denied </li>
 <li> 500 Internal Server Error: Server error</li>

 ### 2. Get Data
- **Endpoint:** `GET /api/data/:id`

<h2> Response: </h2>

<li> 201 ok: Returns the requested data </li>
<li>404 Not Found: Data not found </li>
 <li> 403 Forbidden: Access denied </li>

 ### 3. Get Update Data
- **Endpoint:** `PUT /api/data/:id`

<h2> Response: </h2>

<li> 200 OK: Data updated successfully </li>
<li> 404 Not Found: Data not found </li>
<li> 403 Forbidden: Access denied </li>

 ### 4. Delete Data
- **Endpoint:** `DELETE /api/data/id`

<h2> Response: </h2>

<li> 204 No Content: Data deleted successfully </li>
<li> 404 Not Found: Data not found </li>
<li> 403 Forbidden: Access denied </li>
<li> 400 Bad Request: No data ID provided </li>

 ### 5. Get All Data (With Pagination, Sorting, and Filtering)
- **Endpoint:** `GET /api/data`
  <h3> Query Parameters: </h3>
```
page: Page number for pagination
limit: Number of items per page
sort: Sorting criteria (e.g., title, createdAt)
filter: Filtering criteria (e.g., title=example)
```
<h2> Response: </h2>
<li> 200 OK: Returns paginated, sorted, and filtered data </li>

## 🔑 Authentication
This API uses JWT for authentication. To obtain a token, users must log in with valid credentials. The token should be included in the `x-auth-token` header for all protected routes.

## ⏳ Token Expiration
Tokens expire after a specified period (default: 1 hour). If a token has expired, the user will need to log in again to obtain a new token.

## ⚠️ Error Handling
The API provides error messages in JSON format for various scenarios, including:
- Missing authentication token
- Access denied
- Data not found
- Internal server errors

## ⚙️ Technologies Used
- Node.js
- Express.js
- MongoDB
- TypeScript
- JSON Web Tokens (JWT)
- dotenv (for environment variable management)

##  📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
