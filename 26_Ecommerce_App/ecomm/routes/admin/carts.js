const express = require("express");
const router = express.Router();

const Product = require("../../repositories/product");
const User = require("../../repositories/user");
const Cart = require("../../repositories/cart");

const sessionParams = require("../params");

// Receive post request to add item to cart
router.get("/cart/products/:id", async (req, res) => {
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

  sessionParams.cartId = cart.id;
  sessionParams.cartItems = cart.items.length;

  res.render("./store/index", sessionParams);
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
      product,
      quantity: item.quantity,
      productTotal: productTotal,
    });
  }
  console.log(cartProducts);
  sessionParams.cartProducts = cartProducts;
  sessionParams.cartItems = cartProducts.length;
  sessionParams.totalDue = totalDue;

  res.render("./store/cart", sessionParams);
});

// Receive a post to delete items from cart
router.get("/store/cart/:id/delete", async (req, res) => {
  console.log(req.params.id);

  const cart = await Cart.findById(req.session.cartId);

  console.log(cart.items);
  console.log(cart.items.length);
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
  console.log(cartProducts);
  sessionParams.cartProducts = cartProducts;
  sessionParams.cartItems = cartProducts.length;
  sessionParams.totalDue = totalDue;

  res.render("./store/cart", sessionParams);
});

module.exports = router;
