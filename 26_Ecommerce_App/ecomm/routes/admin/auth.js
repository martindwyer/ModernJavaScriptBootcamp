const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../repositories/user");
let { params, setParams, resetParams } = require("../session/params");

router.get("/signup", (req, res) => {
  setParams({ page: "Sign Up" });
  res.render("./admin/auth/signup", params);
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password, passwordConfirmation } = req.body;
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    return res.send("Email in use");
  } else if (password !== passwordConfirmation) {
    return res.send("passwords must match");
  } else {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);
    const user = new User({
      fullName: fullName,
      email: email,
      password: passHash,
      admin: false,
    });
    await user.save((err) => {
      if (err) {
        console.log(err);
      }
    });

    setParams({
      user: user,
      email: user.email,
      admin: user.admin,
      page: "Home",
    });
    req.session.userId = user.id; // added in by cookieSession

    res.render("index", params);
  }
});

router.get("/signin", (req, res) => {
  setParams({ page: "Sign In" });

  res.render("./admin/auth/signin", params);
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.render("./admin/auth/signin", { emailError: "Email not found" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.render("./admin/auth/signin", {
      passwordError: "Email and password combination not on file",
    });
  }
  req.session.userId = user.id;

  setParams({
    user: user,
    email: user.email,
    admin: user.admin,
    page: "Home",
  });

  res.render("index", params);
});

router.get("/signout", (req, res) => {
  req.session.userId = null;
  resetParams();
  setParams({ page: "Home" });
  res.render("index", params);
});

module.exports = router;
