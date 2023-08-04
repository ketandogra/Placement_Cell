const Student = require("../models/studentSchema");
const Company = require("../models/companySchema");

// render company page
module.exports.companyPage = async (req, res) => {
  try {
    const students = await Student.find({});
    const company = await Company.find({});
    return res.render("company", { students, company });
  } catch (error) {
    console.log("Error in rendering page:", error);
    return res.redirect("back");
  }
};

//allocate interview
module.exports.allocateInterview = async (req, res) => {
  try {
    const students = await Student.find({});

    let array = [];

    for (let student of students) {
      array.push(student.batch);
    }

    // filter out duplicate batches
    array = [...new Set(array)];

    return res.render("scheduleInterview", { students, array });
  } catch (error) {
    console.log(`Error in allocating interview: ${error}`);
    return res.redirect("back");
  }
};

// schedule interview
module.exports.scheduleInterview = async function (req, res) {
  const { id, company, date } = req.body;

  try {
    const existingCompany = await Company.findOne({ name: company });
    const obj = {
      student: id,
      date: date,
      result: "Pending",
    };

    // if company doesn't exist
    if (!existingCompany) {
      const newCompany = await Company.create({
        name: company,
      });
      newCompany.students.push(obj);
      console.log("done");
      newCompany.save();
    } else {
      // if company already exists
      for (let student of existingCompany.students) {
        if (student.student.id === id) {
          req.flash(
            "error",
            "interview with this student is already scheduled"
          );

          return res.redirect("back");
        }
      }
      existingCompany.students.push(obj);
      existingCompany.save();
    }

    const student = await Student.findById(id);
    if (student) {
      const interview = {
        company,
        date,
        result: "Pending",
      };
      student.interviews.push(interview);
      student.save();
    }
    req.flash("success", "Interview Scheduled Successfully");

    return res.redirect("/company/home");
  } catch (error) {
    req.flash("error", `Error in scheduling Interview: ${error}`);

    return res.redirect("back");
  }
};

// update status of interview

module.exports.updateStatus = async function (req, res) {
  const { id } = req.params;
  const { companyName, companyResult } = req.body;
  try {
    const student = await Student.findById(id);
    if (student && student.interviews.length > 0) {
      for (let company of student.interviews) {
        if (company.company == companyName) {
          company.result = companyResult;
          student.save();
          break;
        }
      }
    }
    const company = await Company.findOne({ name: companyName });

    if (company) {
      // compare student id and id passed in params
      for (let student of company.students) {
        if (student.student.toString() === id) {
          student.result = companyResult;
          company.save();
        }
      }
    }
    req.flash("success", `Interview result status changed successfully`);

    return res.redirect("back");
  } catch (err) {
    req.flash("error", `Error in updating status:${err}`);

    res.redirect("back");
  }
};
