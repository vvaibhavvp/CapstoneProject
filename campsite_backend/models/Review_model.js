const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campsite_id: {
        type: Schema.Types.ObjectId,
        ref: 'Campsite',
        required: true
    },
    rating: {
        type: Schema.Types.Decimal128,
        required: true
    },
    comment: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;