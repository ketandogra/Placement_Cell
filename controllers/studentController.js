const Company = require("../models/companySchema");
const Student = require("../models/studentSchema");

//Render add new student page
module.exports.addStudentPage = async (req, res) => {
  return res.render("add_student");
};

//
module.exports.addNewStudent = async (req, res) => {
  console.log(req.body);
  const {
    name,
    email,
    batch,
    college,
    placement,
    contactNumber,
    dsa,
    webd,
    react,
  } = req.body;
  console.log(req.body);

  try {
    const student = await Student.findOne({ email });

    if (student) {
      req.flash("success", "Email already exists!");

      return res.redirect("back");
    }
    const newStudent = await Student.create({
      name,
      email,
      college,
      batch,
      placement,
      contactNumber,
      dsa,
      webd,
      react,
    });

    req.flash("success", "Student added successfully!");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", `Error in creating new student ${error}`);
    return res.redirect("/");
  }
};

//render student edit page action

module.exports.editPage = async function (req, res) {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (student) {
      return res.render("editStudent", { student });
    } else {
      req.flash("error", "Student is not present in database");
      return res.render("back");
    }
  } catch (err) {
    req.flash("error", `Error while render edit page: ${err}`);
    return res.redirect("back");
  }
};

// edit student action
module.exports.editStudent = async function (req, res) {
  console.log("edit student");
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(id, req.body);

    req.flash("success", "Student details updated successfully!");

    return res.redirect("/");
  } catch (err) {
    req.flash("error", `Error while updating student details: ${err}`);
    return res.redirect("back");
  }
};

// delete student action
module.exports.deleteStudent = async function (req, res) {
  const { id } = req.params;

  try {
    // fincd student suing id in params

    const student = await Student.findById(id);

    // find the companies for which interview is scheduled
    // and delete student from company interview list

    if (student && student.interviews.length > 0) {
      for (let item of student.interviews) {
        const company = await Company.findOne({ name: item.company });
        if (company) {
          for (let i = 0; i < company.students.length; i++) {
            if (company.students[i].student.toString() === id) {
              company.students.splice(i, 1);
              company.save();
              break;
            }
          }
        }
      }
    }
    await Student.findByIdAndDelete(id);
    return res.redirect("back");
  } catch (err) {
    console.log(`Error in deleteing student ${err}`);
    return res.redirect("back");
  }
};
