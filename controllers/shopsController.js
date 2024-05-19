const Shop = require('../models/shopsModel');
const Product = require('../models/productsModel');

// Get all shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (error) {
    console.error('Error fetching all shops:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single shop by ID
exports.getShopById = async (req, res) => {
  const { id } = req.params;
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    console.error('Error fetching shop by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    await newShop.save();
    res.status(201).json({ message: 'Shop created successfully', shop: newShop });
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an existing shop
exports.updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, website, hours, rating, description, image, products, artisId } = req.body;

        // Check if the shop exists
        const existingShop = await Shop.findById(id);
        if (!existingShop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Update the shop fields
        existingShop.name = name || existingShop.name;
        existingShop.location = location || existingShop.location;
        existingShop.website = website || existingShop.website;
        existingShop.hours = hours || existingShop.hours;
        existingShop.rating = rating || existingShop.rating;
        existingShop.description = description || existingShop.description;
        existingShop.image = image || existingShop.image;
        existingShop.products = products || existingShop.products;
        existingShop.artisId = artisId || existingShop.artisId;
        existingShop.ratingAmount = existingShop.ratingAmount;

        // Save the updated shop
        const updatedShop = await existingShop.save();

        res.json({ message: 'Shop updated successfully', shop: updatedShop });
    } catch (error) {
        console.error('Error updating shop:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Delete a shop
exports.deleteShop = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.deleteMany({ shopId: id });
    const deletedShop = await Shop.findByIdAndDelete(id);
    if (!deletedShop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    await Product.deleteMany({ id });
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add products to a shop
exports.addProductsToShop = async (req, res) => {
  const { shopId } = req.params;
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const addedProduct = await Product.create(req.body);
    shop.products.push(addedProduct._id);
    await shop.save();
    res.json({ message: 'Products added to shop successfully', shop });
  } catch (error) {
    console.error('Error adding products to shop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove products from a shop
exports.removeProductsFromShop = async (req, res) => {
  const { shopId } = req.params;
  const { productIds } = req.body;
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    shop.products = shop.products.filter(productId => !productIds.includes(productId));
    await shop.save();
    res.json({ message: 'Products removed from shop successfully', shop });
  } catch (error) {
    console.error('Error removing products from shop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllProductsOfShop = async (req, res) => {
  const { shopId } = req.params;
  try {
      const shop = await Shop.findById(shopId).populate('products');
      if (!shop) {
          return res.status(404).json({ message: "Shop not found" });
      }

      res.status(200).json(shop);
  } catch (error) {
      console.error("Error fetching products of shop:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


exports.getShopsByArtisId = async (req, res) => {
  const { artisId } = req.params;
  try {
    // Find all shops where the owner's ID matches the provided Artis ID
    const shops = await Shop.find({ artisId });

    // If shops are found, return them in the response
    res.status(200).json(shops);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Error fetching shops by Artis ID:', error);
    res.status(500).json({ message: 'Failed to fetch shops by Artis ID' });
  }
};

// rate shop
exports.rateShop = async (req, res) => {
  const {shopId, starIndex} = req.body
  try {
    // Find the product by ID
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return { success: false, message: 'Shop not found' };
    }
    // Calculate new average rating based on existing ratings and the new rating
    const { rating, ratingAmount } = shop;
    const totalRatings = rating * ratingAmount;
    const updatedRating = (totalRatings + starIndex) / (ratingAmount + 1);
    // Update shop with new rating
    shop.rating = updatedRating;
    shop.ratingAmount += 1;
    // Save the updated shop
    await shop.save();
    res.status(200).json({ message: 'Shop rating updated successfully' }); 

  } catch (error) {
      res.status(500).json({ message: error._message });    }
};
