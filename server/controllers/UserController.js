import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Storage from '../models/StorageModel.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const register = asyncHandler(async (req, res, next) => {
    const {name, email, password} = req.body;
    const userExists = await User.findOne({ "email" : { $regex : new RegExp(email, "i") } });
    if (userExists) {
        res.status(400);
        throw new Error('User with that email already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email: email,
        password: hashedPassword,
    });
    res.status(201).json({
        success: true
    });
});


const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    var user = await User.findOne({ "email" : { $regex : new RegExp(`^${email}$`, 'i') } });
    if (!user) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const token = generateToken(user._id);
    delete user._doc["password"]
    delete user._doc["createdAt"]
    delete user._doc["updatedAt"]
    delete user._doc["__v"];
    const storages = await Storage.find({user: user._id}).select(['_id','name']);
    res.status(200).json({
        success: true,
        user: {
            ...user._doc,
            token: token,
        },
        storages
    });
});


export { login, register};