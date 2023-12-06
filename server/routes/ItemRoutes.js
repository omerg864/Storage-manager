import express from 'express';
import { createItem, updateItem, useItem, restitutiveItem } from '../controllers/ItemController.js';
import { protectUser } from '../middleware/authMiddleware.js';
const router = express.Router();


router.route('/' ).post(protectUser, createItem);
router.route('/:id/use').patch(protectUser, useItem);
router.route('/:id/restitution').patch(protectUser, restitutiveItem);
router.route('/:id').put(protectUser, updateItem);



export default router;