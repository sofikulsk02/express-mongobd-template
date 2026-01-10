# Express + MongoDB Template

This is your new Express + MongoDB application. Follow the steps below to get started.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

3. **Start MongoDB**
   Make sure MongoDB is running locally or update the connection string in `.env`.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Visit the health endpoint**
   Open http://localhost:3000/health in your browser.

## JWT Keys Setup (Required for Production)

Generate RSA key pairs for JWT token signing:

```bash
cd keys
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run production server
- `npm test` - Run test suite
- `npm run lint` - Check code for linting errors
- `npm run lint:fix` - Fix linting errors automatically

## Project Structure

```
├── src/
│   ├── app.ts              # Express app setup
│   ├── config.ts           # Environment configuration
│   ├── index.ts            # Application entry point
│   ├── core/               # Core utilities (errors, responses, logging)
│   ├── database/           # Database connection and models
│   ├── helpers/            # Helper functions
│   ├── middlewares/        # Express middlewares
│   ├── routes/             # API routes
│   └── types/              # TypeScript type definitions
├── keys/                   # RSA keys for JWT
└── Dockerfile              # Docker configuration
```

## Learn More

For more information, see the [create-express-mongo documentation](https://github.com/sofikulsk02/express-mongobd-template).
