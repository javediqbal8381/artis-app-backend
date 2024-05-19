const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopsController');

// GET all shops
router.get('/', shopController.getAllShops);

// GET a single shop by ID
router.get('/:id', shopController.getShopById);

// POST create a new shop
router.post('/', shopController.createShop);

// PUT update an existing shop
router.put('/:id', shopController.updateShop);

// DELETE a shop
router.delete('/:id', shopController.deleteShop);

// POST add products to a shop
router.post('/:shopId/products', shopController.addProductsToShop);

// DELETE remove products from a shop
router.delete('/:shopId/products', shopController.removeProductsFromShop);

// GET all products of a shop
router.get('/:shopId/products', shopController.getAllProductsOfShop);

// GET all shops of an artis
router.get('/artis-shops/:artisId', shopController.getShopsByArtisId);

// Rate shop
// Route for bulk product creation
router.post('/shop-rate', shopController.rateShop);

module.exports = router;
