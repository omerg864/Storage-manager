import express from 'express';
import { getOrders, createOrder, updateOrder } from '../controllers/OrderController.js';
import { protectUser } from '../middleware/authMiddleware.js';
const router = express.Router();


router.route('/' ).get(protectUser, getOrders);
router.route('/').post(protectUser, createOrder);
router.route('/:id').put(protectUser, updateOrder);


export default router;