import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true, // FIXED: '*' crashes when credentials is true. 'true' safely allows your Vercel app!
    credentials: true 
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai' , aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});