const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const sessionParams = require("../params");
const User = require("../../repositories/user");

router.get("/signup", (req, res) => {
  sessionParams.page = "Sign Up";
  res.render("./admin/auth/signup", sessionParams);
});

router.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    return res.send("Email in use");
  } else if (password !== passwordConfirmation) {
    return res.send("passwords must match");
  } else {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);
    const user = new User({ email: email, password: passHash, admin: false });
    await user.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    sessionParams.user = user;
    sessionParams.email = user.email;
    sessionParams.admin = user.admin;
    sessionParams.page = "Home";
    req.session.userId = user.id; // added in by cookieSession
    res.render("index", sessionParams);
  }
});

router.get("/signin", (req, res) => {
  sessionParams.page = "Sign In";
  res.render("./admin/auth/signin", sessionParams);
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.render("./auth/signin", { emailError: "Email not found" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.render("./admin/auth/signin", {
      passwordError: "Email and password combination not on file",
    });
  }

  req.session.userId = user.id;
  req.session.admin = user.admin;

  sessionParams.user = user;
  sessionParams.email = user.email;
  sessionParams.admin = user.admin;
  sessionParams.page = "Home";

  res.render("index", sessionParams);
});

router.get("/signout", (req, res) => {
  req.session = null;
  sessionParams.user = null;
  sessionParams.email = null;
  sessionParams.admin = null;
  sessionParams.product = null;
  sessionParams.products = null;
  sessionParams.page = "Home";
  res.render("index", sessionParams);
});

module.exports = router;
