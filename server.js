const express = require("express");
const multer = require("multer");
const async=require('async');
const XLSX = require('xlsx');
const path = require('path');

const app = express();

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
    
    return res.status(200).json({message: "File uploaded succesfully"});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});