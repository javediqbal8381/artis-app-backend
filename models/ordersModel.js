const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
        unique: true
    },
    products: [
        
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
            
    ],
    shopId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    totalPrice: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    address: String,
    status: {
        type:String,
        enum:["pending", "onWay", "delivered"],
        default: "pending"
    },
    zip: String,
    phone: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
