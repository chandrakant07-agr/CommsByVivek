import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from .env file
dotenv.config();

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'test';

const connectDB = () => {
    mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    })
    .then((mongod) => console.log('MongoDB successfully connected!',
        mongod.connection.host, mongod.connection.port, mongod.connection.name))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
};

export default connectDB;

