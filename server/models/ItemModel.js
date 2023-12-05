import mongoose from 'mongoose';

const itemScheme = mongoose.Schema({
    serial_number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    replacement: {
        type: Boolean,
        required: true,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    storage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
    },
    order_to: {
        type: String,
    },
    used_for: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Item', itemScheme);