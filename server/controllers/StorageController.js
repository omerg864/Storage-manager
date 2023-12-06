import asyncHandler from 'express-async-handler';
import Storage from '../models/StorageModel.js';
import Item from '../models/ItemModel.js';

const createStorage = asyncHandler(async (req, res, next) => {
    const {name, used} = req.body;
    const storage = await Storage.create({
        name,
        used,
        user: req.user._id
    });
    res.status(201).json({
        success: true,
        storage
    });
});

const getStorage = asyncHandler(async (req, res, next) => {
    const storage = await Storage.findById(req.params.id);
    if (!storage) {
        res.status(404);
        throw new Error('Storage not found');
    }
    if(storage.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const page = req.query.page || 1;
    const search = req.query.search || '';
    const limit = 20;
    let items;
    let count;
    if(search) {
        count = await Item.countDocuments({storage: storage._id, $or : [{name: {$regex: search, $options: 'i'}}, {serial_number: {$regex: search, $options: 'i'}}]});
        items = await Item.find({storage: storage._id, $or : [{name: {$regex: search, $options: 'i'}}, {serial_number: {$regex: search, $options: 'i'}}]}).skip((page - 1) * limit).limit(limit);
    } else {
        count = await Item.countDocuments({storage: storage._id, $or : [{name: {$regex: search, $options: 'i'}}, {serial_number: {$regex: search, $options: 'i'}}]});
        items = await Item.find({storage: storage._id}).skip((page - 1) * limit).limit(limit);
    }
    count = Math.ceil(count / limit);
    res.status(200).json({
        success: true,
        storage: {
            ...storage._doc,
            items,
            pages: count
        }
    });
});

const getStorages = asyncHandler(async (req, res, next) => {
    const storages = await Storage.find({user: req.user._id});
    res.status(200).json({
        success: true,
        storages
    });
});


export {createStorage, getStorage, getStorages};