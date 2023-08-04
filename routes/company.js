const express = require("express");
const passport = require("passport");
const router = express.Router();

const companyController = require("../controllers/companyController");


//GET requests
router.get(
  "/home",
  passport.checkAuthentication,
  companyController.companyPage
);
router.get(
  "/allocate",
  passport.checkAuthentication,
  companyController.allocateInterview
);


//POST requests
router.post(
  "/schedule-interview",
  passport.checkAuthentication,
  companyController.scheduleInterview
);

router.post(
  "/update-status/:id",
  passport.checkAuthentication,
  companyController.updateStatus
);

module.exports = router;
