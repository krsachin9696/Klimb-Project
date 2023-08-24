const express = require("express");
const fs = require("fs");
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


app.post("/upload", upload.single("file"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({error: "No file uploaded"});
    }

    const uploadedFileName = req.file.filename;
    // console.log(uploadedFileName);

    const filepath = './uploads/' + uploadedFileName;
    const filePath = path.join(__dirname, filepath);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);


    async.eachSeries(excelData, (item, callback) => {

        const keys=['name','email','mobile','dob','work_exp','resume_Title','current_Location','postal_Address','current_Employer','current_Designation'];
        const data={};
        let i=0;
        for(k in item){
            data[keys[i]]=item[k];
            i++;
        }

        checkExists(item.Email).then(function(exist){
            if(exist) {
                console.log("hello")
                callback();
            } else {
                employeemodel.create(data).then(function(data){
                    callback();
                }).catch(function(err){
                    res.status(500).send("error");
                });
            }
        }).catch(function(err){
            res.status(500).send("error");
        });

        }, (err) => {
            if (err) {
                console.error('An error occurred:', err);
                res.status(500).send("error");
                return;
            } else {
                const path=filepath;
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully!');
                        res.status(200).send(true);
                    }
                });
                console.log('All items processed');
            }
        });

    });

    async function checkExists(data) {
        const document = await employeemodel.findOne({email: data});
        console.log(document);
        return !!document; 
      }