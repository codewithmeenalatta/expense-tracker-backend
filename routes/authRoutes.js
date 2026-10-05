import express from "express";
import { register, login, logout , updateBudget } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/budget' , verifyToken ,updateBudget);
export default router;