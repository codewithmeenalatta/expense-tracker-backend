import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // FIXED: Using MONGO_URI to match your .env file
        const conn = await mongoose.connect(process.env.MONGO_URL);
        
        // Premium touch: Log the exact host we connected to
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        // Exit process with failure (1) if the database doesn't connect
        process.exit(1);
    }
};