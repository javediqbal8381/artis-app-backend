const Order = require('../models/ordersModel');

const { Safepay } = require('@sfpy/node-sdk')

const safepay = new Safepay({
    environment: 'sandbox',
    apiKey: process.env.SAFEPAY_APIKEY,
    v1Secret: process.env.SAFEPAY_SECRET,
    webhookSecret: 'foo'
})

exports.payment = async (req, res) => {
    try {
        const { token } = await safepay.payments.create({
            amount: Number(req.query.price),
            currency: 'PKR'
        })
        const url = safepay.checkout.create({
            token,
            orderId: 'T800',
            cancelUrl: `${process.env.FRONT_END_BASE_URL}/payment`,
            redirectUrl: `${process.env.FRONT_END_BASE_URL}/order-completed`,
            source: 'custom',
            webhooks: true
        })
        // redirect user to `url`
        res.status(200).json(url)
    } catch (error) {
        res.status(500).json(error)
    }
}

// Create a new order
exports.createOrder = async (req, res) => {
    console.log(req.body)
    try {
        // Get the count of existing orders
        const orderCount = await Order.countDocuments();
        // Generate the new order ID as the count of existing orders plus one
        const newOrderId = orderCount + 1;

        // Create the new order with the generated order ID
        const newOrder = new Order({ ...req.body, orderId: newOrderId });
        await newOrder.save();

        // Respond with success message and the new order
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders by user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get orders by shop
exports.getOrdersByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const orders = await Order.find({ shopId });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders by shop:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an existing order
exports.editOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, totalPrice, address, zip, phone } = req.body;
console.log(req.body)
        // Check if the order exists
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order fields
        existingOrder.status = status || existingOrder.status;
        existingOrder.totalPrice = totalPrice || existingOrder.totalPrice;
        existingOrder.address = address || existingOrder.address;
        existingOrder.zip = zip || existingOrder.zip;
        existingOrder.phone = phone || existingOrder.phone;

        existingOrder.updatedAt = Date.now();

        // Save the updated order
        const updatedOrder = await existingOrder.save();

        res.json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: error.message });
    }
};

