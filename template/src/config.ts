import dotenv from 'dotenv';

dotenv.config();

export const originUrl = process.env.ORIGIN_URL;
export const isProduction = process.env.NODE_ENV === 'production';
export const timeZone = process.env.TZ;
export const port = process.env.PORT;

// JWT token configuration
export const tokenInfo = {
    accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
    refreshTokenValidity: parseInt(
        process.env.REFRESH_TOKEN_VALIDITY_SEC || '0',
    ),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || '',
};

// DB config
export const db = {
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '27017',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PASSWORD || '',
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
};

export const logDirectory = process.env.LOG_DIRECTORY;
