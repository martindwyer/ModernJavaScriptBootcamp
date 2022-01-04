const express = require("express");
const userRepo = require("../../repositories/user");
const router = express.Router();

const signup = require("../../views/admin/auth/signup");
const signin = require("../../views/admin/auth/signin");

router.get("/signup", (req, res) => {
  res.render("./auth/signup", {
    req,
    title: "Ecommerce Application",
    page: "Sign Up",
  });
});

router.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  console.log(email, password, passwordConfirmation);
  const existingUser = await userRepo.getOneByEmail(email);
  console.log(existingUser);
  if (existingUser) {
    return res.send("Email in use");
  } else if (password !== passwordConfirmation) {
    return res.send("passwords must match");
  } else {
    const user = await userRepo.create({ email, password });
    req.session.userId = user.id; // added in by cookieSession
    res.render("index", {
      title: "Ecommerce Application",
      page: "Home",
      email: user.email,
    });
  }
});

router.get("/signin", (req, res) => {
  res.render("./auth/signin", { page: "Sign In" });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepo.getOneByEmail(email);

  if (!user) {
    return res.send("Email not found");
  }

  const validPassword = await userRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send("invalid password");
  }

  req.session.userId = user.id;

  res.render("index", {
    title: "Ecommerce Application",
    page: "Home",
    email: user.email,
  });
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.render("index", {
    title: "Ecommerce Application",
    page: "Home",
  });
});

module.exports = router;
