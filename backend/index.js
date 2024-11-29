var path = require("path");
require("dotenv").config();
var express = require("express");
var app = express();

const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const cors = require("cors");
const genericRouter = require("./routes/generic_route");
const masterRouter = require("./routes/master_algo_route");

app.use(cors());
app.options("*", cors());
// app.use(cors({
//   origin: 'https://port3011-workspaces-ws-t5n9q.eu10.applicationstudio.cloud.sap'
// }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error("Database Connection Error : ", error));
db.once("open", () => console.log("connected to database"));

app.use("/profilerservice/generic-route", genericRouter);
app.use("/profilerservice/master_algo-route", masterRouter);

const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(
    "Profiler 2 - " +
      process.env.Client +
      " backend server listening on port " +
      port
  );
});
