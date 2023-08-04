const Student = require("../models/studentSchema");

//render home Page
module.exports.homePage = async (req, res) => {
  const students = await Student.find({});

  return res.render("home", { students });
};
