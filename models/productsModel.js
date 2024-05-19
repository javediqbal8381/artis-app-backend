const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    artisan: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        // required: true
    },
    rating: {
        type: Number,
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    deliveryFee: {
        type: String,
        required: true
    },
    ratingAmount: {
        type: Number,
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
