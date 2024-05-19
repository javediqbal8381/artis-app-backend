const Product = require('../models/productsModel');
const Shop = require('../models/shopsModel');

// Create a new product
exports.createProduct = async (req, res) => {
    const { formData } = req.body;
    try {
        const newProduct = new Product(formData);
        await newProduct.save();
        const shop = await Shop.findOne({ _id: formData.shopId });
        if (shop) {
            shop.products.push(newProduct._id);
            await shop.save();
        } else {
            throw new Error('Shop not found');
        }

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId, shopId } = req.body;

        // Step 1: Find the shop by its ID
        const shopOfDeletingProduct = await Shop.findById(shopId);

        // Step 2: Remove the deleted product's ID from the products array
        shopOfDeletingProduct.products = shopOfDeletingProduct.products.filter(id => id.toString() !== productId);

        // Step 3: Save the updated shop
        await shopOfDeletingProduct.save();

        // Delete the product
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get product detail by id
exports.getProductDetail = async (req, res) => {
    const productId = req.params.id
    try {
        const products = await Product.findById(productId);
        res.json(products);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getProductsByIds = async (req, res) => {
    const productIds = req.body;
    try {
        const products = await Product.find({ _id: { $in: productIds } });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by IDs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get products by shop
exports.getProductsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const products = await Product.find({ shopId });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by shop:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get products by top ratings
exports.getProductsByTopRatings = async (req, res) => {
    try {
        const products = await Product.find().sort({ rating: -1 }).limit(10);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by top ratings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get products by price range
exports.getProductsByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by price range:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// rate products
exports.rateProduct = async (req, res) => {
    const {productId, starIndex} = req.body
    try {
      // Find the product by ID
      const product = await Product.findById(productId);
      if (!product) {
        return { success: false, message: 'Product not found' };
      }
      // Calculate new average rating based on existing ratings and the new rating
      const { rating, ratingAmount } = product;
      const totalRatings = rating * ratingAmount;
      const updatedRating = (totalRatings + starIndex) / (ratingAmount + 1);
  
      // Update product with new rating
      product.rating = updatedRating;
      product.ratingAmount += 1;
  
      // Save the updated product
      await product.save();
      res.status(200).json({ message: 'Product rating updated successfully' }); 

    } catch (error) {
        res.status(500).json({ message: error._message });    }
  };

// bulk actions -----------------------------------------------

// Create multiple products in bulk
exports.bulkCreateProducts = async (req, res) => {
    try {
        const products = req.body; // Assuming req.body is an array of product objects

        // Validate data (optional)
        // Insert products into the database
        const insertedProducts = await Product.insertMany(products);

        res.status(201).json({ message: 'Products created successfully', products: insertedProducts });
    } catch (error) {
        console.error('Error creating products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

