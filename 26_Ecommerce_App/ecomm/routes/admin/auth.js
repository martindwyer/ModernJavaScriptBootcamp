const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../../repositories/user");

const siteTitle = "CloudForest";

router.get("/signup", (req, res) => {
  res.render("./auth/signup", {
    req,
    title: siteTitle,
    page: "Sign Up",
  });
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

    req.session.userId = user.id; // added in by cookieSession
    res.render("index", {
      title: siteTitle,
      page: "Home",
      email: user.email,
    });
  }
});

router.get("/signin", (req, res) => {
  res.render("./auth/signin", {
    title: siteTitle,
    page: "Sign In",
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.render("./auth/signin", { emailError: "Email not found" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  console.log(password, user.password);

  if (!validPassword) {
    return res.render("./auth/signin", {
      passwordError: "Email and password combination not on file",
    });
  }

  req.session.userId = user.id;

  res.render("index", {
    title: siteTitle,
    page: "Home",
    email: user.email,
  });
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.render("index", {
    title: siteTitle,
    page: "Home",
  });
});

module.exports = router;
