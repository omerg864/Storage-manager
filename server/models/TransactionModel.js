import mongoose from 'mongoose';

const transactionScheme = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    type: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    storage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage'
    }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionScheme);