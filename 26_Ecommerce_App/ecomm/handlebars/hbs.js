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
  return "$" + num.toFixed(2);
});

hbs.registerHelper("productEditUrl", function (id) {
  return "/admin/products/" + id + "/edit";
});

hbs.registerHelper("productDeleteUrl", function (id) {
  return "/admin/products/" + id + "/delete";
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

module.export = hbs;
