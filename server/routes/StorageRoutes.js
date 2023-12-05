import express from 'express';
import { createStorage, getStorage, getStorages } from '../controllers/StorageController.js';
import { protectUser } from '../middleware/authMiddleware.js';
const router = express.Router();


router.route('/').post(protectUser, createStorage);
router.route('/:id').get(protectUser, getStorage);
router.route('/').get(protectUser, getStorages);


export default router;