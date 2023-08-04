const express = require("express");
const passport = require("passport");
const router = express.Router();

const usersController = require("../controllers/usersController");

//GET requests
router.get("/signin", usersController.signIn);
router.get("/signup", usersController.signUp);
router.get(
  "/signout",
  passport.checkAuthentication,
  usersController.destroySession
);
router.get(
  "/download-csv",
  passport.checkAuthentication,
  usersController.downloadCSV
);


//Post requests
router.post("/create", usersController.createUser);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/user/signin" }),
  usersController.createSession
);

module.exports = router;
