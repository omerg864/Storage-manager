import asyncHandler from 'express-async-handler';
import Order from '../models/OrderModel.js';
import Item from '../models/ItemModel.js';

const getOrders = asyncHandler(async (req, res, next) => {
    let {status, page, search} = req.query;
    status = parseInt(status ? status : 1);
    page = parseInt(page ? page : 1);
    const limit = 20;
    const skip = (page - 1) * limit;
    let count, orders;
    count = await Order.countDocuments({status: status, user: req.user._id});
    orders = await Order.find({status: status, user: req.user._id}).populate('item').limit(limit).skip(skip);
    if(search) {
        orders = orders.filter(order => {
            return order.item.name.toLowerCase().includes(search.toLowerCase()) || order.item.serial_number.toLowerCase().includes(search.toLowerCase()) || order.item.order_to.toLowerCase().includes(search.toLowerCase());
        });
        count = orders.length;
    }
    const pages = Math.ceil(count / limit);
    res.status(200).json({
        success: true,
        orders,
        pages
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

const updateOrder = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const order = await Order.findById(id);
    if(!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    const {item, status, reject_description} = req.body;
    const itemFound = await Item.findById(item._id);
    if(!itemFound) {
        res.status(404);
        throw new Error('Item not found');
    }
    if(itemFound.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    itemFound.name = item.name;
    itemFound.quantity = item.quantity;
    itemFound.replacement = item.replacement;
    itemFound.order_to = item.order_to;
    itemFound.serial_number = item.serial_number;
    if(status === 4 && order.status !== 4) {
        itemFound.storage = item.storage;
    }
    await itemFound.save();
    order.status = status;
    order.reject_description = reject_description;
    await order.save();
    const newOrder = await Order.findById(id).populate('item');
    res.status(200).json({
        success: true,
        order: newOrder
    });
});


export {getOrders, createOrder, updateOrder};