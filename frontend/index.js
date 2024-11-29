/******************************************************************************************************** */
/****************************JAVASCRIPT INDEX FILE TO START THE FRONTEND********************************* */
/******************************************************************************************************** */

require("dotenv").config();

var express = require("express");
var app = express();
var path = require("path");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
// const cors = require("cors");
// app.use(
//   cors({
//     origin: "https://profiler-2-router-demo-lti.cfapps.eu10.hana.ondemand.com",
//   })
// );

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/* The dashboard.html file opens at the port mentioned */
app.use(express.static(__dirname + "/", { index: "setup.html" }));

/* Starts Frontend at the port 3011 or the port mentioned in .env*/
const port = process.env.PORT || 3011;
app.listen(port, function () {
  console.log(
    "Profiler 2 - Multi Tenant frontend server listening on port " + port
  );
});
