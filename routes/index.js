const express = require("express");
const router = express.Router();
const passport = require("passport");

const homeController = require("../controllers/homeController");
const user = require("./user");
const students = require("./students");
const company = require("./company");

router.get("/", passport.checkAuthentication, homeController.homePage);

router.use("/user", user);
router.use("/students", students);
router.use("/company", company);

module.exports = router;
