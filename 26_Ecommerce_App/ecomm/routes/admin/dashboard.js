const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { isLoggedIn, isAdmin } = require("./middleware");
let { params, setParams } = require("../session/params");

const Product = require("../../repositories/product");
const User = require("../../repositories/user");

router.get("/admin", isLoggedIn, isAdmin, async (req, res) => {
  const products = await Product.find({});
  const users = await User.find();
  const user = await User.findById(req.session.userId);
  setParams({
    user: user,
    users: users,
    email: user.email,
    admin: user.admin,
    products: products,
  });
  res.render("./admin/index", params);
});

router.get(
  "/admin/products/:id/edit",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    setParams({ product: product });
    res.render("./admin/products/editproduct", params);
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

    const users = await User.find();
    const products = await Product.find();
    const user = await User.findById(req.session.userId);

    setParams({
      user: user,
      email: user.email,
      admin: user.admin,
      users: users,
      products: products,
    });

    res.render("./admin", params);
  }
);

router.get(
  "/admin/products/:id/delete",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    const products = await Product.find();

    setParams({ products: products });

    res.render("./admin", params);
  }
);

router.get("/admin/users/add", isLoggedIn, isAdmin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  setParams({
    user: user,
    email: user.email,
    admin: user.admin,
  });
  res.render("./admin/user/adduser", params);
});

router.post("/admin/users/add", isLoggedIn, isAdmin, async (req, res) => {
  const email = req.body.email;
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    return res.send("Email in use");
  } else if (req.body.password !== req.body.passwordConfirmation) {
    return res.send("passwords must match");
  } else {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: passHash,
      admin: false,
      streetAddress: req.body.streetAddress,
      unitNumber: req.body.unitNumber,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      billingIsShipping: req.body.billingIsShipping === "yes",
      shipToStreetAddress: req.body.shipToStreetAddress,
      shipToUnitNumber: req.body.shipToUnitNumber,
      shipToCity: req.body.shipToCity,
      shipToState: req.body.shipToState,
      shipToZip: req.body.shipToZip,
    });
    await newUser.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    const user = await User.findById(req.session.userId);
    const users = await User.find();
    const products = await Product.find();

    setParams({
      page: "Dashboard",
      user: user,
      email: user.email,
      admin: user.admin,
      users: users,
      products: products,
    });

    res.render("./admin/index", params);
  }
});

router.get("/admin/users/:id/edit", isLoggedIn, isAdmin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  const editUser = await User.findById(req.params.id);
  setParams({
    page: "Dashboard",
    user: user,
    editUser: editUser,
    email: user.email,
    admin: user.admin,
  });
  res.render("./admin/user/edituser", params);
});

router.post("/admin/users/:id/edit", isLoggedIn, isAdmin, async (req, res) => {
  const update = {
    fullName: req.body.fullName,
    email: req.body.email,
    streetAddress: req.body.streetAddress,
    unitNumber: req.body.unitNumber,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    billingIsShipping: req.body.billingIsShipping === "yes",
    shipToStreetAddress: req.body.shipToStreetAddress,
    shipToUnitNumber: req.body.shipToUnitNumber,
    shipToCity: req.body.shipToCity,
    shipToState: req.body.shipToState,
    shipToZip: req.body.shipToZip,
  };

  await User.findByIdAndUpdate(req.params.id, update);

  const users = await User.find();
  const user = await User.findById(req.session.userId);
  const products = await Product.find();

  setParams({
    user: user,
    email: user.email,
    admin: user.admin,
    users: users,
    products: products,
  });

  res.render("./admin", params);
});

router.get("/admin/users/:id/delete", isLoggedIn, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  const users = await User.find();
  setParams({ users: users });
  res.render("./admin", params);
});

router.get("/admin/users/:id/allow", isLoggedIn, isAdmin, async (req, res) => {
  const update = {
    admin: true,
  };
  await User.findByIdAndUpdate(req.params.id, update);
  const users = await User.find();
  setParams({ users: users });
  res.render("./admin", params);
});

router.get("/admin/users/:id/revoke", isLoggedIn, isAdmin, async (req, res) => {
  const update = {
    admin: false,
  };
  await User.findByIdAndUpdate(req.params.id, update);
  const users = await User.find();
  setParams({ users: users });
  res.render("./admin", params);
});

module.exports = router;
