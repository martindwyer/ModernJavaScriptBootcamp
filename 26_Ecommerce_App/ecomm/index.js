const keys = require("./config/keys");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Connect to MongoDB database
mongoose.connect(keys.MongoURI);

// Initializing our express server
const app = express();

// To use bodyParser middleware on all requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <input name="passwordconfirmation" placeholder="password confirmation" />
      <button>Sign Up</button>
    </form>
  </div>`);
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Account Created");
});

app.listen(3000, () => {
  console.log("express listening");
});
