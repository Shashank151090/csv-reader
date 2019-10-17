// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const fs = require('fs');
var path = require('path');
var os= require('os')
const hostName = '/Downloads/Export.csv';
const fileLocation = path.join(os.homedir(),hostName);
  
//CREATE EXPRESS APP
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });   
 
//ROUTES WILL GO HERE
app.get('/', function(req, res) {
    res.json({ message: 'WELCOME' });   
    var test = path.join(os.homedir(),fileLocation)
});

app.get('/getFile', function(req, res) {
    const file = path.join(fileLocation);
     res.download(file);
})

app.get('/downloadFile', function(req,res) {
    let downloadPath =path.join(fileLocation);
    console.log(downloadPath);

    // window.open('https://escavoxwebapi.azurewebsites.net/IoT/1.0/GetRaw/67510A100E/20190901-0000/20191010-0000')
})

app.delete('/delete', function(req, res) {
    // Assuming that 'path/file.txt' is a regular file.
fs.unlink(path.join(fileLocation), (err) => {
    if (err) {
        throw err;
    };
    console.log('file was deleted');
  });
})
 
app.listen(4000, () => console.log('Server started on port 4000'));