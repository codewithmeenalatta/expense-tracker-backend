import express from "express";
import { getFinancialAdvice } from "../controllers/aiController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/advice" , verifyToken , getFinancialAdvice);
export default router;