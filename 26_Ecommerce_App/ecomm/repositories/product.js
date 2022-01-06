const keys = require("../config/keys");
const mongoose = require("mongoose"); // For working with MongoDB
const { Schema } = mongoose;

//Connect to MongoDB database
mongoose.connect(keys.MongoURI);

const productSchema = new Schema({
  productType: String,
  title: String,
  publicationDate: Date,
  author: String,
  coverType: String,
  upToSeven: {
    type: Boolean,
    default: false,
  },
  eightToTwelve: {
    type: Boolean,
    default: false,
  },
  teen: {
    type: Boolean,
    default: false,
  },
  youngAdult: {
    type: Boolean,
    default: false,
  },
  adult: {
    type: Boolean,
    default: false,
  },
  senior: {
    type: Boolean,
    default: false,
  },
  price: Number,
  shippingCost: Number,
  publisher: {
    type: String,
    default: "",
  },
  pages: Number,
  bookImageUrl: {
    type: String,
    default: "",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
