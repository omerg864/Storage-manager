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

const updateItem = asyncHandler(async (req, res, next) => {
    const {name, quantity, replacement, order_to, serial_number} = req.body;
    const {id} = req.params;
    const item = await Item.findById(id);
    if(!item) {
        res.status(404);
        throw new Error('Item not found');
    }
    if(item.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    item.name = name;
    item.quantity = quantity;
    item.replacement = replacement;
    item.order_to = order_to;
    item.serial_number = serial_number;
    await item.save();
    res.status(200).json({
        success: true,
        item
    });
});

const useItem = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const item = await Item.findById(id);
    if(!item) {
        res.status(404);
        throw new Error('Item not found');
    }
    if(item.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const {quantity, used_for, storage} = req.body;
    let removed = false;
    if(quantity > item.quantity) {
        res.status(400);
        throw new Error('Not enough items');
    }
    if(quantity === item.quantity) {
        removed = true;
        if(used_for) {
            item.used_for = used_for;
        }
        if(item.replacement) {
            item.storage = storage;
        } else {
            item.storage = null;
        }
    } else {
        item.quantity -= quantity;
        if(item.replacement) {
            const newItem = await Item.create({
                name: item.name,
                quantity,
                replacement: item.replacement,
                order_to: item.order_to,
                serial_number: item.serial_number,
                user: req.user._id,
                used_for: used_for,
                storage: storage
            });
            if(!newItem) {
                res.status(400);
                throw new Error('Invalid item data');
            }
        }
    }
    await item.save();
    res.status(200).json({
        success: true,
        removed,
        item
    });
});


export {createItem, updateItem, useItem};