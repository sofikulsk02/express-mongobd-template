# create-express-mongo-ts

Create Express + MongoDB applications with TypeScript, authentication, and best practices out of the box.

[![npm version](https://img.shields.io/npm/v/create-express-mongo-ts.svg)](https://www.npmjs.com/package/create-express-mongo-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
npx create-express-mongo-ts my-app
cd my-app
npm install
cp .env.example .env
npm run dev
```

## What's Included

This template provides a production-ready Express.js + MongoDB setup with:

### 🔐 Authentication & Security
- JWT-based authentication (access & refresh tokens)
- API key management
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Helmet.js security headers
- CORS configuration

### 📁 Project Structure
```
my-app/
├── src/
│   ├── app.ts              # Express app setup
│   ├── config.ts           # Environment configuration
│   ├── index.ts            # Application entry point
│   ├── core/               # Core utilities
│   │   ├── ApiError.ts     # Custom error classes
│   │   ├── ApiResponse.ts  # Standardized API responses
│   │   ├── asyncHandler.ts # Async error handling wrapper
│   │   ├── authUtils.ts    # Authentication utilities
│   │   ├── jwtUtils.ts     # JWT token utilities
│   │   ├── logger.ts       # Winston logger setup
│   │   └── utils.ts        # General utilities
│   ├── database/           # Database layer
│   │   ├── index.ts        # MongoDB connection
│   │   ├── models/         # Mongoose models
│   │   └── repositories/   # Data access layer
│   ├── helpers/            # Helper functions
│   ├── middlewares/        # Express middlewares
│   ├── routes/             # API routes
│   └── types/              # TypeScript type definitions
├── keys/                   # RSA keys for JWT (generate your own)
├── Dockerfile              # Docker configuration
├── tsconfig.json           # TypeScript configuration
├── jest.config.ts          # Jest testing configuration
└── eslint.config.mts       # ESLint configuration
```

### 🛠️ Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Validation**: Zod
- **Logging**: Winston with daily rotation
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Build and run production server |
| `npm test` | Run test suite |
| `npm run lint` | Check code for linting errors |
| `npm run lint:fix` | Fix linting errors automatically |
| `npm run prettier:write` | Format code with Prettier |

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=myapp
DB_USER=
DB_PASSWORD=
DB_MIN_POOL_SIZE=2
DB_MAX_POOL_SIZE=5

# JWT Configuration
ACCESS_TOKEN_VALIDITY_SEC=3600
REFRESH_TOKEN_VALIDITY_SEC=86400
TOKEN_ISSUER=your-app
TOKEN_AUDIENCE=your-app

# CORS Configuration
ORIGIN_URL=*

# Logging
LOG_DIRECTORY=logs
```

## JWT Keys Setup

For production, generate RSA key pairs for JWT signing:

```bash
# Navigate to keys directory
cd keys

# Generate private key
openssl genrsa -out private.pem 2048

# Generate public key
openssl rsa -in private.pem -pubout -out public.pem
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `POST /auth/token/refresh` - Refresh access token

## Docker Support

Build and run with Docker:

```bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 --env-file .env my-app
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
