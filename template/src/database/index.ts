import mongoose, { Query, Schema } from 'mongoose';
import logger from '../core/logger';
import { db } from '../config';

export async function connectDB() {
    const dbURI = `mongodb+srv://${db.user}:${encodeURIComponent(db.password)}@${
        db.host
    }/${db.name}`;

    const options = {
        autoIndex: true,
        minPoolSize: db.minPoolSize,
        maxPoolSize: db.maxPoolSize,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 45000,
    };
    mongoose.set('strictQuery', true);

    function setRunValidators(this: Query<unknown, unknown>) {
        this.setOptions({ runValidators: true });
    }

    mongoose.plugin((schema: Schema) => {
        schema.pre('findOneAndUpdate', setRunValidators);
        schema.pre('updateMany', setRunValidators);
        schema.pre('updateOne', setRunValidators);
        schema.pre(/^update/, setRunValidators);
    });
    try {
        await mongoose.connect(dbURI, options);
        logger.info('Mongoose connection established');
    } catch (err) {
        logger.error('Mongoose connection error');
        logger.error(err);
        process.exit(1);
    }

    mongoose.connection.on('connected', () => {
        logger.debug(`Mongoose connected to ${dbURI}`);
    });

    mongoose.connection.on('error', (err) => {
        logger.error('Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', () => {
        logger.info('Mongoose disconnected');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close().finally(() => {
            logger.info('Mongoose disconnected due to app termination');
            process.exit(0);
        });
    });
}
