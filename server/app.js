const createError = require("http-errors");
const path = require("path");
const mongoose = require("mongoose");
require("./models/initModels");
const cookieParser = require("cookie-parser");
const express = require("express"); // Håndtering af server
const logger = require("morgan"); // module for logging
const router = require("./routes/router"); // Routing
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const init = require("./init/init");

var app = express();

dotenv.config({
  path: "./.env",
});

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "aaahhhhh",
    resave: true,
    saveUninitialized: true,
    secure: false,
  })
);

app.use("/", router);

//connect to database
mongoose
  .connect("mongodb://localhost:27017/kuko", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => {
    init();
    console.log("connected to database");
  })
  .catch((err) => console.log(err));

module.exports = app;
