import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [50, 'Title cannot exceed 50 characters'] // Prevents massive UI-breaking text
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, 'Expense amount must be greater than zero'] // FIXED: Prevents negative numbers
    },
    category: {
        type: String,
        required: true,
        // FIXED: Enforces exact matches with our frontend <select> dropdown
        enum: {
            values: ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'],
            message: '{VALUE} is not a valid category'
        }
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        trim: true,
        maxLength: [200, 'Description cannot exceed 200 characters']
    }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);