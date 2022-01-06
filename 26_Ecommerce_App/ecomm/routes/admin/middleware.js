const User = require("../../repositories/user");

module.exports = {
  isLoggedIn(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }
    next();
  },
  async isAdmin(req, res, next) {
    let user = await User.findById(req.session.userId);
    console.log(user);
    if (!user.admin) {
      return res.render("unauthorized", {
        message:
          "You have attempted to access a page which only administrators can access.",
      });
    }

    next();
  },
};
