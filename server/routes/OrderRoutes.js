import express from 'express';
import { getOrders, createOrder } from '../controllers/OrderController.js';
import { protectUser } from '../middleware/authMiddleware.js';
const router = express.Router();


router.route('/' ).get(protectUser, getOrders);
router.route('/').post(protectUser, createOrder);


export default router;