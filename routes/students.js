const express = require("express");
const passport = require("passport");
const router = express.Router();

const studentController = require("../controllers/studentController");

//GET requests
router.get(
  "/add-student-page",
  passport.checkAuthentication,
  studentController.addStudentPage
);
router.get(
  "/delete/:id",
  passport.checkAuthentication,
  studentController.deleteStudent
);
router.get(
  "/edit-page/:id",
  passport.checkAuthentication,
  studentController.editPage
);

//POST requests
router.post(
  "/edit-student/:id",
  passport.checkAuthentication,
  studentController.editStudent
);
router.post(
  "/addstudent",
  passport.checkAuthentication,
  studentController.addNewStudent
);

module.exports = router;
