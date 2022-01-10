const express = require("express");
const bcrypt = require("bcrypt");
const sessionParams = require("./params");
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
  sessionParams.title = "E-Commerce Store";
  sessionParams.page = "Home";

  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    sessionParams.email = user.email;
    sessionParams.admin = user.admin;
  }
  res.render("index", sessionParams);
});

module.exports = siteRouter;
