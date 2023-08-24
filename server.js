const express = require("express");
const multer = require("multer");
const async=require('async');
const XLSX = require('xlsx');
const path = require('path');

const app = express();

const db=require('./model/db');
const excelModel=require('./model/employee');

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


app.post("/upload", upload.single("file"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({error: "No file uploaded"});
    }

    const uploadedFileName = req.file.filename;
    console.log(uploadedFileName);

    const filePath = './uploads/' + uploadedFileName;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    async.eachSeries(excelData, (item, callback) => {

        console.log("data read & forwarded");

    })

    
    return res.status(200).json({message: "File uploaded succesfully"});
});
