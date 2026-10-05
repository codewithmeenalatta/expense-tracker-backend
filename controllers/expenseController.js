import Expense from "../models/expenseModel.js";

// 1. Create a new expense
export const addExpense = async (req , res) => {
    try {
        const { title , amount , category , date , description} = req.body;
        const newExpense = await Expense.create({
            user : req.user.id,
            title, 
            amount,
            category,
            date,
            description
        });
        res.status(201).json(newExpense);
    } catch (error) {
        console.error("Failed to add Expense", error);
        res.status(500).json({ message :"Failed to create expense" , error : error.message});
    }
};

// 2. Get all expenses
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expenses!", error: error.message });
    }
};

// 3. Update an expense
export const updateExpense = async (req, res) => {
    try {
        const { title , amount , category , date} = req.body;
        let expense = await Expense.findById(req.params.id);
        if(!expense){
            return res.status(404).json({ message : "Expense Not Found"});
        }

        // FIXED TYPO: Changed req.use.id to req.user.id
        if(expense.user.toString() !== req.user.id){
            return res.status(401).json({ message : "Not Authorized to edit this"});
        }

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { title, amount , category , date},
            { new : true}
        );
        res.status(200).json(expense);
    } catch (error) {
        console.error("Edit error" , error);
        res.status(500).json({ message : "Failed to Update expense"});
    }
};

// 4. Delete an expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: "Expense Not Found" });

        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this expense" });
        }    
        
        await expense.deleteOne();
        res.status(200).json({ message: "Expense Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense!", error: error.message });
    }
};