import mongoose from 'mongoose';

const storageScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Storage', storageScheme);