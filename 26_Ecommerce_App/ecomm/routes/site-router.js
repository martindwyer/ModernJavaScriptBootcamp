const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../repositories/user");

const siteRouter = express.Router();
const authRouter = require("./admin/auth");
const productRouter = require("./admin/products");
const cartRouter = require("./admin/carts");
const adminRouter = require("./admin/dashboard");

siteRouter.use(authRouter);
siteRouter.use(productRouter);
siteRouter.use(adminRouter);
siteRouter.use(cartRouter);

siteRouter.get("/", async (req, res) => {
  req.session.title = "E-Commerce Store";
  req.session.page = "Home";

  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    req.session.email = user.email;
    req.session.admin = user.admin;
  }
  res.render("index", req.session);
});

module.exports = siteRouter;
