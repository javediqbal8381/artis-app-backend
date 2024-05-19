const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  website: {
    type: String,
  },
  hours: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  artisId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  ratingAmount: {
    type: Number,
}
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
