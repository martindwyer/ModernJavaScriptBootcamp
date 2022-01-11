let params = {
  page: null,
  user: null,
  email: null,
  admin: null,
  users: null,
  product: null,
  products: null,
  cart: null,
  order: null,
  orders: null,
};

function setParams(args) {
  for (let key in args) {
    params[key] = args[key];
  }
}

function resetParams() {
  for (let key in params) {
    params[key] = null;
  }
}

module.exports = { params, setParams, resetParams };
