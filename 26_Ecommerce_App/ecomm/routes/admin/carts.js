const express = require("express");
const router = express.Router();

const Product = require("../../repositories/product");
const User = require("../../repositories/user");
const Cart = require("../../repositories/cart");

let { params, setParams } = require("../session/params");

// Receive post request to add item to cart
router.get("/cart/products/:id", async (req, res) => {
  console.log(req);
  console.log(req.session);

  // figure out the cart id?
  let cart;

  if (!req.session.cartId) {
    // create a cart
    const product = await Product.findById(req.params.id);

    cart = new Cart({
      items: [
        {
          id: product.id,
          quantity: 1,
        },
      ],
    });

    await cart.save();

    req.session.cartId = cart.id;

    console.log(req.session.cartId);

    //...
  } else {
    // we have a cart - get it
    // either increment quantity for existing product or add new to items array
    cart = await Cart.findById(req.session.cartId);
    let duplicate = false;
    cart.items.map((item) => {
      if (item.id === req.params.id) {
        item.quantity += 1;
        duplicate = true;
        return item;
      }
      return item;
    });
    if (!duplicate) {
      let product = await Product.findById(req.params.id);
      cart.items.push({ id: product.id, quantity: 1 });
    }
    cart.save();
  }
  const user = await User.findById(req.session.userId);

  setParams({
    user: user,
    email: user.email,
    admin: user.admin,
    cartId: cart.id,
    cartItems: cart.items.length,
  });
  res.render("./store/index", params);
});

// Receive get request to show all items in cart
router.get("/store/cart/:id", async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  let cartProducts = [];
  let product;
  let productTotal = 0;
  let totalDue = 0;

  for (let item of cart.items) {
    product = await Product.findById(item.id);

    productTotal = product.price * item.quantity + product.shippingCost;

    totalDue += productTotal;

    cartProducts.push({
      cartId: req.params.id,
      product,
      quantity: item.quantity,
      productTotal: productTotal,
    });
  }

  const user = await User.findById(req.session.userId);

  setParams({
    cartProducts: cartProducts,
    cartItems: cartProducts.length,
    totalDue: totalDue,
    user: user,
    email: user.email,
    admin: user.admin,
  });

  res.render("./store/cart", params);
});

// Receive a post to delete items from cart
router.get("/store/cart/:id/delete", async (req, res) => {
  const cart = await Cart.findById(req.session.cartId);
  let items = cart.items;
  let newItems = [];
  for (item of items) {
    if (item.id !== req.params.id) {
      newItems.push(item);
    }
  }
  cart.items = newItems;
  console.log(cart.items.length);
  cart.save();
  let cartProducts = [];
  let product;
  let productTotal = 0;
  let totalDue = 0;

  for (let item of cart.items) {
    product = await Product.findById(item.id);

    productTotal = product.price * item.quantity + product.shippingCost;

    totalDue += productTotal;

    cartProducts.push({
      product,
      quantity: item.quantity,
      productTotal: productTotal,
    });
  }

  setParams({
    cartId: req.params.id,
    cartProducts: cartProducts,
    cartItems: cartProducts.length,
    totalDue: totalDue,
  });

  res.render("./store/cart", params);
});

module.exports = router;
