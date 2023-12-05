import mongoose from 'mongoose';

const userScheme = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.model('user', userScheme);