import mongoose from 'mongoose';

const orderScheme = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    reject_description: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Order', orderScheme);