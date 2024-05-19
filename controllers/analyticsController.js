const express = require('express');
const router = express.Router();
const Order = require('../models/ordersModel');
const Product = require('../models/productsModel');

// Line Chart API
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}, { createdAt: 1, totalPrice: 1 }); // Fetching createdAt and totalPrice fields
    const data = {};

    // Aggregate orders by date and calculate total price for each date
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]; // Extracting date part
      if (data[date]) {
        data[date] += order.totalPrice;
      } else {
        data[date] = order.totalPrice;
      }
    });

    // Format data for response
    const chartData = Object.keys(data).map(date => ({
      date,
      totalPrice: data[date]
    }));

    res.json({ success: true, data: chartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Pie Chart API
router.get('/products', async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } } // Grouping products by category and counting
    ]);

    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
