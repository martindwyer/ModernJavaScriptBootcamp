const express = require("express"); // Server for application
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const siteRouter = require("./routes/site-router");
const path = require("path");
const hbs = require("./handlebars/hbs");

// Initializing our express server
const app = express();

// Setting up views, view paths and static directorys
const viewsPath = path.join(__dirname, "./templates/views");

app.set("view engine", "hbs");
app.set("views", viewsPath);
app.use(express.static("public"));

// To use bodyParser middleware on all requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up cookie handling with keys for encryption
app.use(
  cookieSession({
    name: "session",
    keys: ["random!_+84j4)*(_!string"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours,
    secure: false,
  })
);

app.use(siteRouter);

app.listen(3000, () => {
  console.log("express listening");
});
