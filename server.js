const express = require("express");
const multer = require("multer");
const async=require('async');
const XLSX = require('xlsx');
const path = require('path');

const app = express();

const db=require('./model/db');
const employeemodel = require('./model/employee');

db.init().then(function(){
    console.log("db connected");
    app.listen(3000, function () {
        console.log("server is on at port 3000");
    });
}).catch(function(err){
    console.log(err);
});

const upload = multer({ dest: 'uploads/' })
app.use(express.static('uploads'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname + "/script.js");
});


app.post("/upload", upload.single("file"), async(req, res) => {
    if(!req.file) {
        return res.status(400).json({error: "No file uploaded"});
    }

    const uploadedFileName = req.file.filename;
    // console.log(uploadedFileName);

    const filePath = './uploads/' + uploadedFileName;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);


    try {
        await async.eachSeries(excelData, async (item) => {
            const newEmployee = new employeemodel({
                name: item.name,
                email: item.email,
                mobile: item.mobile,
                dob: item.dob,
                work_exp: item.work_exp,
                resume_Title: item.resume_Title,
                current_Location: item.current_Location,
                postal_Address: item.postal_Address,
                current_Employer: item.current_Employer,
                current_Designation: item.current_Designation,
            });

            await newEmployee.save();
            console.log("Data saved:", item);
        });

        return res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

    
    // return res.status(200).json({message: "File uploaded succesfully"});
});
