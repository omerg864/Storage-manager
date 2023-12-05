import express from 'express';
import { getTransactions } from '../controllers/TransactionController.js';
const router = express.Router();


router.route('/', getTransactions );


export default router;