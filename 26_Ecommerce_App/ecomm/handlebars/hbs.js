const path = require("path");
const hbs = require("hbs");
const moment = require("moment");

const partialsPath = path.join(__dirname, "../templates/partials");

hbs.registerPartials(partialsPath);
hbs.registerHelper("formatDate", function (dateString) {
  return new hbs.SafeString(
    moment(dateString).format("MM/DD/YYYY").toUpperCase()
  );
});

hbs.registerHelper("dateFormValue", function (dateString) {
  return new hbs.SafeString(
    moment(dateString).format("YYYY-MM-DD").toUpperCase()
  );
});

hbs.registerHelper("toDollars", function (num) {
  if (num) {
    return "$" + num.toFixed(2);
  } else {
    return "$0.00";
  }
});

hbs.registerHelper("productEditUrl", function (id) {
  return "/admin/products/" + id + "/edit";
});

hbs.registerHelper("productDeleteUrl", function (id) {
  return "/admin/products/" + id + "/delete";
});

hbs.registerHelper("addProductToCart", function (id) {
  return "/cart/products/" + id;
});

hbs.registerHelper("userDeleteUrl", function (id) {
  return "/admin/users/" + id + "/delete";
});

hbs.registerHelper("userEditUrl", function (id) {
  return "/admin/users/" + id + "/edit";
});

hbs.registerHelper("userAllowUrl", function (id) {
  return "/admin/users/" + id + "/allow";
});

hbs.registerHelper("userRevokeUrl", function (id) {
  return "/admin/users/" + id + "/revoke";
});

hbs.registerHelper("isChecked", function (val) {
  if (val) {
    return "checked";
  } else {
    return "";
  }
});

hbs.registerHelper("isBook", function (val) {
  if (this.product.productType === "book") {
    return "selected";
  } else {
    return "";
  }
});

hbs.registerHelper("isElectronic", function (val) {
  if (this.product.productType === "electronic") {
    return "selected";
  } else {
    return "";
  }
});

hbs.registerHelper("isEssential", function (val) {
  if (this.product.productType === "essential") {
    return "selected";
  } else {
    return "";
  }
});

hbs.registerHelper("isEbook", function (val) {
  if (this.product.coverType === "ebook") {
    return "selected";
  } else {
    return "";
  }
});

hbs.registerHelper("isPaperback", function (val) {
  if (this.product.coverType === "paperback") {
    return "selected";
  } else {
    return "";
  }
});

hbs.registerHelper("isHardcover", function (val) {
  if (this.product.coverType === "hardcover") {
    return "selected";
  } else {
    return "";
  }
});

hbs.registerHelper("linkToCart", function (id) {
  return "/store/cart/" + id;
});

hbs.registerHelper("removeCartItem", function (id) {
  return "/store/cart/" + id + "/delete";
});

module.export = hbs;
