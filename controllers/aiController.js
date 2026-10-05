// 1. Using the new, permanent package!
import { GoogleGenAI } from "@google/genai"; 
import Expense from "../models/expenseModel.js"; 

export const getFinancialAdvice = async (req , res) => {
    try {
        const expenses = await Expense.find({ user : req.user.id});
        
        if(expenses.length === 0){
            return res.status(200).json({ advice : "You have no expenses yet! Start tracking your money to get AI insights."});
        }
        
        let categoryTotals = {};
        expenses.forEach(exp => {
            if(categoryTotals[exp.category]){
                categoryTotals[exp.category] += Number(exp.amount);
            }else{
                categoryTotals[exp.category] = Number(exp.amount)
            }
        });

        // 2. Initialize the new SDK
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
            You are a friendly, expert financial advisor. 
            Here is a summary of my spending by category: ${JSON.stringify(categoryTotals)}.
            In 3 short, easy-to-read sentences, tell me where I am spending the most and give me one friendly tip to save money. Do not use bold text or special formatting.
        `;

        // 3. THE MAGIC: It now pulls the model directly from your .env file!
        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt
        });

        res.status(200).json({ advice : result.text });

    } catch (error) {
        console.error("AI Error!", error);
        res.status(500).json({ message : "Failed to generate AI Advice"})
    }
}