const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Create a new product
router.post('/', productsController.createProduct);

// Update an existing product
router.put('/:id', productsController.updateProduct);

// Delete a product
router.delete('/delete', productsController.deleteProduct);

// Get all products
router.get('/', productsController.getAllProducts);

// Get product detail
router.get('/product-details/:id', productsController.getProductDetail);

// Get products by category
router.get('/category/:category', productsController.getProductsByCategory);

// Get products list by ids
router.post('/detail-list/byIds', productsController.getProductsByIds);

// Get products by shop
router.get('/shop/:shopId', productsController.getProductsByShop);

// Get products by top ratings
router.get('/top-ratings', productsController.getProductsByTopRatings);

// Get products by price range
router.get('/price-range', productsController.getProductsByPriceRange);

// Rate product
router.post('/product-rate', productsController.rateProduct)

// bulk ---------------------

// Route for bulk product creation
router.post('/bulk/upload', productsController.bulkCreateProducts);


module.exports = router;
