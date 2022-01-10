const keys = require("../config/keys");
const mongoose = require("mongoose"); // For working with MongoDB
const { Schema } = mongoose;

//Connect to MongoDB database
mongoose.connect(keys.MongoURI);

const cartSchema = new Schema({
  items: [
    {
      id: String,
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
