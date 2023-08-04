const User = require("../models/userSchema");
const Student = require("../models/studentSchema");
const fastcsv = require("fast-csv");
const fs = require("fs");

module.exports.signIn = (req, res) => {
  return res.render("signin");
};

// render sign up page
module.exports.signUp = (req, res) => {
  return res.render("signup");
};

// create new user
module.exports.createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (password != confirmPassword) {
      req.flash("error", "Passwords do not match");
      console.log("Password dont match");
      return res.redirect("back");
    }

    const user = await User.findOne({ email: email });
    if (user) {
      console.log("User already exist");
      req.flash("success", "User already exist");
      return res.redirect("back");
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });

    if (!newUser) {
      console.log("Error in creating user");
      return res.redirect("back");
    }

    // render signin page
    req.flash("success", "You have signed up, login to continue!");
    return res.redirect("/user/signin");
  } catch (error) {
    console.log("Error in creating user:", error);
    req.flash("error", error);
    return res.redirect("back");
  }
};

// create session
module.exports.createSession = (req, res) => {
  req.flash("success", "Logged in Successfully!");
  return res.redirect("/");
};

// sign out

module.exports.destroySession = (req, res) => {
  req.logout(function (err) {
    if (err) {
      req.flash("error", `${err}`);
      return next(err);
    }
  });
  req.flash("success", "You have logged out!");
  return res.redirect("/user/signin");
};

// download report

module.exports.downloadCSV = async function (req, res) {
  try {
    const students = await Student.find({});
    let data = "";
    let num = 1;
    let csv =
      "S.No, Name, Email, College, Placement, Contact Number, Batch, DSA Score, WebDev Score, React Score,Interview, Date, Result";

    for (let student of students) {
      if (student.interviews.length > 1) {
        for (let interview of student.interviews) {
          data =
            num +
            "," +
            student.name +
            "," +
            student.email +
            "," +
            student.college +
            "," +
            student.placement +
            "," +
            student.contactNumber +
            "," +
            student.batch +
            "," +
            student.dsa +
            "," +
            student.webd +
            "," +
            student.react +
            "," +
            interview.company +
            "," +
            interview.date +
            "," +
            interview.result;

          num++;
          csv += "\n" + data;
        }
      } else if (student.interviews.length === 1) {
        data =
          num +
          "," +
          student.name +
          "," +
          student.email +
          "," +
          student.college +
          "," +
          student.placement +
          "," +
          student.contactNumber +
          "," +
          student.batch +
          "," +
          student.dsa +
          "," +
          student.webd +
          "," +
          student.react +
          "," +
          student.interviews[0].company +
          "," +
          student.interviews[0].date +
          "," +
          student.interviews[0].result;
        num++;
        csv += "\n" + data;
      }
    }

    const dataFile = fs.writeFile("data.csv", csv, function (err, data) {
      if (err) {
        req.flash("error", `${err}`);
        console.log(err);
        return res.redirect("back");
      }
      console.log("Report generated successfully");
      return res.download("data.csv");
    });
  } catch (err) {
    req.flash("error", `Error on downloading file: ${err}`);
    console.log(err);
    return res.redirect("back");
  }
};
