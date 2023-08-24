const mongoos = require("mongoose");

const employee = new mongoos.Schema({
    name: String,
    email: String,
    mobile: Number,
    dob: String,
    work_exp: String,
    resume_Title: String,
    current_Location: String,
    postal_Address: String,
    current_Employer: String,
    current_Designation: String,
});

const emp = mongoos.model("employeeTable", employee);
module.exports = emp;