const express = require("express");
const fs = require("fs");
const multer = require("multer");
const async=require('async');
const XLSX = require('xlsx');
const path = require('path');


const app = express();

const db=require('./model/db');
const employeemodel = require('./model/employee');


const upload = multer({ dest: 'uploads/' })
app.use(express.static('uploads'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname + "/script.js");
});


async function checkExists(data) {
    const document = await employeemodel.findOne({ email: data });
    return !!document;
}

async function processExcelRow(item, callback) {
    const keys = [
        "name", "email", "mobile", "dob", "work_exp",
        "resume_Title", "current_Location", "postal_Address",
        "current_Employer", "current_Designation"
    ];
    const data = {};
    let i = 0;
    for (const k in item) {
        data[keys[i]] = item[k];
        i++;
    }

    try {
        const exist = await checkExists(item.email);
        if (exist) {
            console.log("This email already exists");
            callback(); // Move to the next item
        } else {
            await employeemodel.create(data);
            callback();
        }
    } catch (err) {
        console.error(err);
        callback(err);
    }
}

async function processExcelData(filepath) {
    const workbook = XLSX.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    return new Promise((resolve, reject) => {
        async.eachSeries(
            excelData,
            (item, callback) => processExcelRow(item, callback),
            (err) => {
                if (err) {
                    console.error('An error occurred:', err);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

function deleteUploadedFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                reject(err);
            } else {
                console.log("File deleted successfully!");
                resolve();
            }
        });
    });
}

app.post("/upload", upload.single("file"), (req, res) => {
    console.log("post method is called");
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedFileName = req.file.filename;
    const filepath = './uploads/' + uploadedFileName;
    const filePath = path.join(__dirname, filepath);

    processExcelData(filePath)
        .then(() => deleteUploadedFile(filePath))
        .then(() => {
            console.log('All items processed');
            res.status(200).send(true);
        })
        .catch((err) => {
            console.error('An error occurred:', err);
            res.status(500).send("error");
        });
});


db.init().then(function(){
    console.log("db connected");
    app.listen(3000, function () {
        console.log("server is on at port 3000");
    });
}).catch(function(err){
    console.log(err);
    });
