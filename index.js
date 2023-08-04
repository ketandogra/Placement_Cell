const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/mongoose");
//use for the session cookie
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const passportLocal = require("./config/passport_local");
const MongoStore = require("connect-mongo");
const port = process.env.PORT || "3000";
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const app = express();

// set ejs as view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "placement",
    secret: "foofoo",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: process.env.MONGODB_URI,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongodb setup ok");
      }
    ),
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("Error in connecting to server", err);
    return;
  } else {
    console.log("Server runnning on port:", port);
  }
});
