import mongoose from 'mongoose';

// Import all models to ensure they are registered with Mongoose
import './models';

export const connectDatabase = async (url: string) => {
    return mongoose.connect(url);
};