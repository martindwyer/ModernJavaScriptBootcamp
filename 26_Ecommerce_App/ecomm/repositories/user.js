const keys = require("../config/keys");
const mongoose = require("mongoose"); // For working with MongoDB
const { Schema } = mongoose;

//Connect to MongoDB database
mongoose.connect(keys.MongoURI);

const userSchema = new Schema({
  email: String,
  password: String,
  admin: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String,
    default: "",
  },
  streetAddress: {
    type: String,
    default: "",
  },
  unitNumber: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  billingIsShipping: {
    type: Boolean,
    default: false,
  },
  shipToStreetAddress: {
    type: String,
    default: "",
  },
  shipToUnitNumber: {
    type: String,
    default: "",
  },
  shipToCity: {
    type: String,
    default: "",
  },
  shipToState: {
    type: String,
    default: "",
  },
  shipToZip: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
