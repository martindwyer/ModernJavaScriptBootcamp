const keys = require("../config/keys");
const mongoose = require("mongoose"); // For working with MongoDB
const { Schema } = mongoose;

//Connect to MongoDB database
mongoose.connect(keys.MongoURI);

const userSchema = new Schema({
  email: String,
  password: String,
  admin: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
