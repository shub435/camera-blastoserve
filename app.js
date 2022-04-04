var express = require("express");
var bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/camera");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});

var app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
    contentType: false,
    processData: false,
    cache: false,

    dataType: "json",
  })
);

app.post("/sign_up", function (req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var image = req.body.image;
  var phone = req.body.phone;

  var data = {
    "first name": fname,
    "last name": lname,
    'image': image,
    "contact number": phone,
  };
  db.collection("user-details").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  return res.redirect("./index.html");
});

app
  .get("/", function (req, res) {
    res.set({
      "Access-control-Allow-Origin": "*",
    });
    return res.redirect("./index.html");
  })
  .listen(3000);

console.log("server listening at port 3000");
