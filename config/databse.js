import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDb = async () => {
    try {
   

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to DB ✅');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};
