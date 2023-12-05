import asyncHandler from 'express-async-handler';
import Order from '../models/OrderModel.js';
import Item from '../models/ItemModel.js';

const getOrders = asyncHandler(async (req, res, next) => {
    let {status, page} = req.query;
    status = parseInt(status ? status : 1);
    page = parseInt(page ? page : 1);
    const limit = 10;
    const skip = (page - 1) * limit;
    const orders = await Order.find({status: status, user: req.user._id}).populate('item').limit(limit).skip(skip);
    res.status(200).json({
        success: true,
        orders
    });
});

const createOrder = asyncHandler(async (req, res, next) => {
    const {item, order} = req.body;
    const {name, quantity, replacement, order_to, storage, serial_number} = item;
    const newItem = await Item.create({
        name,
        quantity,
        replacement,
        order_to,
        serial_number,
        user: req.user._id
    });
    if(!newItem){
        res.status(400);
        throw new Error('Invalid item data');
    }
    const newOrder = await Order.create({
        item: newItem._id,
        user: req.user._id,
        ...order
    });
    res.status(200).json({
        success: true,
        order: newOrder
    });
});


export {getOrders, createOrder};