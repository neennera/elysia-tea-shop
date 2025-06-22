# Elysia Tea Shop API

This project is a RESTful API for a tea shop management system built with modern technologies. It provides endpoints for tea menu management and user authentication.

## Technologies Used

- **Bun**: A fast JavaScript runtime with built-in package manager and test runner
- **Elysia.js**: A high-performance TypeScript framework for building web APIs
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **MySQL**: Relational database for data storage
- **JWT**: JSON Web Tokens for secure authentication
- **Docker**: Containerization for consistent development and deployment

## Features

- **Tea Menu Management**:

  - List all tea menu items
  - Get a specific tea menu item by ID
  - Add new tea menu items
  - Update existing tea menu items
  - Delete tea menu items

- **User Authentication**:
  - User registration
  - User login with JWT token
  - Protected routes with JWT verification
  - Elysia guard & beforeHandle derive function
  - User profile management

## Project Structure

```
src/
├── index.ts                # Main application entry point
├── modules/                # Feature modules
│   ├── auth/               # Authentication module
│   │   ├── index.ts        # Route definitions
│   │   ├── model.ts        # Type definitions
│   │   └── service.ts      # Business logic
│   └── teaManu/            # Tea menu module
│       ├── index.ts        # Route definitions
│       ├── model.ts        # Type definitions
│       └── service.ts      # Business logic
```

## Getting Started

### Prerequisites

- Bun runtime
- Docker and Docker Compose

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/elysia-tea-shop.git
   cd elysia-tea-shop
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the database:

   ```bash
   docker-compose up -d
   ```

4. Set up environment variables:

   ```bash
   # Create a .env file with the following
   DATABASE_URL="mysql://db_user:db_password@localhost:3306/db_dev"
   JWT_SECRET="your_secure_jwt_secret"
   ```

5. Run database migrations:

   ```bash
   bunx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   bun run dev
   ```

7. Access the API at http://localhost:3000

## API Documentation

Once the server is running, you can access the Swagger documentation at:
http://localhost:3000/swagger
