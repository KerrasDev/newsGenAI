# News Backend

## Project Structure
- `config/`: Configuration files for database, app, and security
- `controllers/`: Request handlers for different routes
- `middleware/`: Custom middleware for logging, error handling, etc.
- `models/`: Database models for news articles
- `routes/`: API route definitions
- `services/`: Business logic layer
- `utils/`: Utility functions for validation, token management

## Setup
1. Install dependencies
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application
- Development: `npm run dev`
- Production: `npm start`

## Testing
Run tests with: `npm test`

## Dependencies
- Express.js
- Mongoose
- JWT for authentication
- Joi for validation
- Morgan for logging
- Helmet for security
- Express Rate Limit for API protection
