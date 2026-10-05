import express from "express";
// FIXED: Removed createExpense, now we only import the correct addExpense
import { addExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expenseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all expense routes
router.use(verifyToken);

// Group routes for the base URL '/'
router.route('/')
    .get(getExpenses)
    .post(addExpense); // FIXED: Only one .post() command now!

// Group routes for specific ID URLs '/:id'
router.route('/:id')
    .put(updateExpense)
    .delete(deleteExpense);

export default router;