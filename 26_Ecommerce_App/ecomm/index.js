const express = require("express"); // Server for application
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const path = require("path");
const hbs = require("hbs");

// Initializing our express server
const app = express();

// Setting up views, view paths and static directorys
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static("public"));

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
    title: "CloudForest",
    page: "Home",
  });
});

app.use(authRouter);

app.listen(3000, () => {
  console.log("express listening");
});
