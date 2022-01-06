const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("./middleware");

const Product = require("../../repositories/product");
const User = require("../../repositories/user");

const siteTitle = "E-Commerce Store";

router.get("/admin/products", isLoggedIn, isAdmin, async (req, res) => {
  const products = await Product.find({});
  const user = await User.findById(req.session.userId);
  res.render("./products/products", {
    products,
    title: siteTitle,
    email: user.email,
  });
});

router.get("/admin/products/new", isLoggedIn, isAdmin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("./products/newproduct", { title: siteTitle, email: user.email });
});

router.post("/admin/products/new", isLoggedIn, isAdmin, async (req, res) => {
  const product = new Product({
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
  });
  await product.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  const user = await User.findById(req.session.userId);
  res.render("index", { title: siteTitle, email: user.email });
});

module.exports = router;
