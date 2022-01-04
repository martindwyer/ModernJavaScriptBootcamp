const keys = require("./config/keys");
const express = require("express"); // Server for application
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose"); // For working with MongoDB
const authRouter = require("./routes/admin/auth");

const path = require("path");

const hbs = require("hbs");

//Connect to MongoDB database
mongoose.connect(keys.MongoURI);

// Initializing our express server
const app = express();

// Setting up views and view paths
const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// To use bodyParser middleware on all requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up cookie handling with keys for encryption
app.use(
  cookieSession({
    keys: ["random!_+84j4)*(_!string"],
  })
);

app.get("/", (req, res) => {
  res.render("index", {
    req,
    title: "Ecommerce Store Application",
    page: "Home",
  });
});

app.use(authRouter);

app.listen(3000, () => {
  console.log("express listening");
});
