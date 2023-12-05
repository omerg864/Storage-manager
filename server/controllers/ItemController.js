import asyncHandler from 'express-async-handler';
import Item from '../models/ItemModel.js';

const createItem = asyncHandler(async (req, res, next) => {
    const {name, quantity, replacement, order_to, storage, serial_number} = req.body;
    const item = await Item.create({
        name,
        quantity,
        replacement,
        order_to,
        storage,
        serial_number,
        user: req.user._id
    });
    res.status(201).json({
        success: true,
        item
    });
});

// TODO: update item


export {createItem};