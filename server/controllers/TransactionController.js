import asyncHandler from 'express-async-handler';
import Transaction from '../models/TransactionModel.js';

const getTransactions = asyncHandler(async (req, res, next) => {
    const Transactions = await Transaction.find();
    res.status(200).json({
        success: true,
        Transactions: Transactions
    });
});


export {getTransactions};