const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const sessionParams = require("../params");
const { isLoggedIn, isAdmin } = require("./middleware");

const Product = require("../../repositories/product");
const User = require("../../repositories/user");

router.get("/admin", isLoggedIn, isAdmin, async (req, res) => {
  const products = await Product.find({});
  const users = await User.find();
  const user = await User.findById(req.session.userId);
  sessionParams.user = user;
  sessionParams.email = user.email;
  sessionParams.admin = user.admin;
  sessionParams.products = products;
  sessionParams.users = users;
  res.render("./admin/index", sessionParams);
});

router.get(
  "/admin/products/:id/edit",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    sessionParams.product = product;
    res.render("./admin/products/editproduct", sessionParams);
  }
);

router.post(
  "/admin/products/:id/edit",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const update = {
      productType: req.body.productType,
      title: req.body.title,
      publicationDate: new Date(req.body.publicationDate),
      author: req.body.author,
      coverType: req.body.coverType,
      upToSeven: req.body.upToSeven === "yes",
      eightToTwelve: req.body.eightToTwelve === "yes",
      teen: req.body.teen === "yes",
      youngAdult: req.body.youngAdult === "yes",
      adult: req.body.adult === "yes",
      senior: req.body.senior === "yes",
      price: parseFloat(req.body.price),
      shippingCost: parseFloat(req.body.shippingCost),
      publisher: req.body.publisher,
      pages: parseInt(req.body.pages),
      bookImageUrl: req.body.bookImageUrl,
    };

    await Product.findByIdAndUpdate(req.params.id, update);

    sessionParams.users = await User.find();
    sessionParams.user = await User.findById(req.session.userId);
    sessionParams.email = sessionParams.user.email;
    sessionParams.admin = sessionParams.user.admin;

    sessionParams.products = await Product.find();

    res.render("./admin", sessionParams);
  }
);

router.get(
  "/admin/products/:id/delete",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    sessionParams.products = await Product.find();
    res.render("./admin", sessionParams);
  }
);

module.exports = router;
