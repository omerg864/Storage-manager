import express from 'express';
import { createItem } from '../controllers/ItemController.js';
import { protectUser } from '../middleware/authMiddleware.js';
const router = express.Router();


router.route('/' ).post(protectUser, createItem);


export default router;