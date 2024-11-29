const mongoose = require("mongoose");
const winston = require("winston");
const fs = require("fs");
const process = require("process");
const abap_repository = require("../models/master/master_abap_repository");
const check_csv = require("../services/checkCsvService/check_csv");

let mongooseSchema = new mongoose.Schema({}, { strict: false });
const path = require("path");

// Define the log directory within the writable directory
const logDir = path.join(__dirname, "logs");

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

class TimestampFirst {
  constructor(enabled = true) {
    this.enabled = enabled;
  }
  transform(obj) {
    if (this.enabled) {
      return Object.assign(
        {
          timestamp: obj.timestamp,
        },
        obj
      );
    }
    return obj;
  }
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      format: winston.format.json(),
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    new TimestampFirst(true),
    winston.format.printf((info) => {
      const msgstr = JSON.stringify(info, null, "\t");
      return `${info.level} ${info.timestamp} ${msgstr}`;
    })
  ),
});

const reqRunMasterALgorithm = async (req, res) => {
  try {
    const backendPath = path.join(__dirname, "..");
    if (req.body.module == "CUSTOM_DEV_ABAP") {
      let result = await abap_repository.compareFiles(req.body);
      process.chdir(backendPath);
      let response_obj = { message: result };
      res.status(201).json(response_obj);
    } else
      res.status(404).json({
        message:
          "Please check the module for which you want to upload the files",
      });
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ message: err.message });
  }
};
const getMasterAlgoFileCount = async (req, res) => {
  try {
    const model = mongoose.models[req.query.collection_name]
      ? mongoose.model(req.query.collection_name)
      : mongoose.model(req.query.collection_name, mongooseSchema);
    let total_count = [];
    let success_count = [];
    let collections_created = [];
    let collections_deleted = [];
    for (let module of req.query.moduleNames) {
      let query_for_total = {
        is_active: true,
        module: module,
      };

      let query_for_success = {
        is_active: true,
        module: module,
        OverallStatus: 200,
      };

      const total_count_var = await model.find(query_for_total).count();
      total_count.push(total_count_var);

      const success_count_var = await model.find(query_for_success).count();
      success_count.push(success_count_var);

      let result1 = await model.aggregate([
        {
          $facet: {
            CollectionCreate: [
              {
                $match: {
                  $and: [
                    { module: { $eq: module } },
                    { is_active: { $eq: true } },
                  ],
                },
              },
              {
                $group: {
                  _id: 1,
                  col_created_count: { $sum: "$collection_created" },
                },
              },
            ],
            CollectionDrop: [
              {
                $match: {
                  $and: [
                    { module: { $eq: module } },
                    { is_active: { $eq: true } },
                  ],
                },
              },
              {
                $group: {
                  _id: 1,
                  col_dropped_count: { $sum: "$collection_dropped" },
                },
              },
            ],
          },
        },
      ]);

      if (total_count_var != 0) {
        collections_created.push(
          result1[0].CollectionCreate[0].col_created_count
        );
        collections_deleted.push(
          result1[0].CollectionDrop[0].col_dropped_count
        );
      } else {
        collections_created.push(0);
        collections_deleted.push(0);
      }
    }
    logger.info("info", {
      req: req.query,
      status: 200,
      message: "success",
      API_Endpoint: "/master_algo",
      query: "find",
    });
    res.status(200).json({
      data: {
        Total_files_executed: total_count,
        Files_Executed_Successfully: success_count,
        Collections_created: collections_created,
        Collections_dropped: collections_deleted,
      },
      message: "success",
    });
  } catch (err) {
    console.log("error :", err);
    logger.error("error", {
      req: req.query,
      status: 500,
      message: "error",
      API_Endpoint: "/master_algo",
      query: "find",
    });
    res.status(500).json({ message: err.message });
  }
};
const checkCsv = async (req, res) => {
  try {
    let result = await check_csv.createCollectionForAllCSV(
      req.query.module_name
    );
    console.log("result", result);
    logger.info("info", {
      req: req.query,
      status: 200,
      message: "success",
      API_Endpoint: "/check_csv",
      query: "check csvs",
    });
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    console.log("error :", err);
    logger.error("error", {
      req: req.query,
      status: 500,
      message: "error",
      API_Endpoint: "/check_csv",
      query: "check csvs",
    });
    res.status(500).json({ message: err.message });
  }
};

const checkCsvTemp = async (req, res) => {
  try {
    console.log(req.query);
    let modules = ["cus dev ABAP"];
    let result = [];

    let pathOfDir = path.join(__dirname, "..");

    for (let eachMod of modules) {
      var csvs_received = fs
        //.readdirSync(`./temp/${eachMod}`)
        .readdirSync(`${pathOfDir}/temp/${eachMod}`)
        .filter((f) => f.endsWith(".csv") || f.endsWith(".CSV"));
      var csvs_repository = fs
        .readdirSync(`${pathOfDir}/repository/${eachMod}`)
        .filter((f) => f.endsWith(".csv") || f.endsWith(".CSV"));

      if (!fs.existsSync(`${pathOfDir}/excel_files/${eachMod}`)) {
        fs.mkdirSync(`${pathOfDir}/excel_files/${eachMod}`);
      }
      var csvs_in_excel_files = fs
        .readdirSync(`${pathOfDir}/excel_files/${eachMod}`)
        .filter((f) => f.endsWith(".csv") || f.endsWith(".CSV"));

      result.push({
        moduleName: eachMod,
        repository_count: csvs_repository.length,
        received_count: csvs_received.length,
        excel_file_csv_count: csvs_in_excel_files.length,
        excel_files_csvs: csvs_in_excel_files,
      });
    }
    logger.info("info", {
      req: req.query,
      status: 200,
      message: "success",
      API_Endpoint: "/master_algo",
      query: "find",
    });
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    console.log("error :", err);
    logger.error("error", {
      req: req.query,
      status: 500,
      message: "error",
      API_Endpoint: "/master_algo",
      query: "find",
    });
    res.status(500).json({ message: err.message });
  }
};

const csvCountForJsFiles = async (req, res) => {
  try {
    const activityModelName = "all_csv_datas";
    const ModelName = mongoose.models[activityModelName]
      ? mongoose.model(activityModelName)
      : mongoose.model(activityModelName, mongooseSchema);

    let responseObject = [];

    let csvDetailsJSFileWise = await ModelName.aggregate([
      {
        $match: {
          $and: [
            { Module: { $ne: "" } },
            { "Proposed CSV Names": { $ne: "" } },
          ],
        },
      },
      {
        $group: {
          _id: { module: "$Module", js_file_name: "$JS File Name" },
          csvNames: { $push: "$Proposed CSV Names" },
          csvCount: { $sum: 1 },
          provided: { $push: "$Provided" },
          correctness: { $push: "$Correct\\Incorrect" },
        },
      },
      {
        $group: {
          _id: "$_id.module",
          jsDetails: {
            $push: {
              js_file_name: "$_id.js_file_name",
              csvNames: "$csvNames",
              csvCount: "$csvCount",
              provided: "$provided",
              correctness: "$correctness",
            },
          },
        },
      },
    ]);

    for (let csvNameJSWise of csvDetailsJSFileWise) {
      let JSWiseDetailsArr = [];
      for (let jsWiseCsv of csvNameJSWise.jsDetails) {
        jsWiseCsv["Module"] = csvNameJSWise._id;
        if (jsWiseCsv.correctness.includes("Correct")) {
          jsWiseCsv["Visible"] = "Yes";
        } else {
          jsWiseCsv["Visible"] = "No";
        }

        JSWiseDetailsArr.push({
          jsFile: jsWiseCsv["js_file_name"],
          Visible: jsWiseCsv["Visible"],
          totalcsvCount: jsWiseCsv["csvCount"],
          correctCsvsProvided: jsWiseCsv.correctness.filter(
            (x) => x == "Correct"
          ).length,
        });
      }

      responseObject.push({
        Module: csvNameJSWise._id,
        JSWiseDetails: JSWiseDetailsArr,
      });
    }

    logger.info("info", {
      req: req.query,
      status: 200,
      message: "success",
      API_Endpoint: "/csv_count_for_js_files",
      query: "find",
    });
    res.status(200).json({ data: responseObject, message: "success" });
  } catch (err) {
    console.log("error :", err);
    logger.error("error", {
      req: req.query,
      status: 500,
      message: "error",
      API_Endpoint: "/csv_count_for_js_files",
      query: "find",
    });
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    let userID = req.query.userID.toLowerCase();
    let pwd = req.query.pwd.toLowerCase();

    let dbToConnect = req.query.db_name;
    let document_id = req.query.document_id;

    const model = mongoose.models[req.query.collection_name]
      ? mongoose.model(req.query.collection_name)
      : mongoose.model(req.query.collection_name, mongooseSchema);
    let result = await model.aggregate([
      {
        $match: {
          $and: [{ active: true }, { user_id: userID }, { password: pwd }],
        },
      },
    ]);

    if (result && result.length) {
      logger.info("info", {
        req: req.query,
        status: 200,
        message: "success",
        API_Endpoint: "/login",
        query: "find",
      });
      res.status(200).json({ data: "Login Successful", message: "success" });
    } else {
      logger.info("info", {
        req: req.query,
        status: 401,
        message: "Login Failed",
        API_Endpoint: "/login",
        query: "find",
      });
      res
        .status(401)
        .json({ data: "Username/Password incorrect", message: "Login Failed" });
    }
  } catch (err) {
    console.log("error :", err);
    logger.error("error", {
      req: req.query,
      status: 404,
      message: "error",
      API_Endpoint: "/login",
      query: "find",
    });
    res.status(404).json({ message: err.message });
  }
};

const getMasterAlgorithm = async (req, res) => {
  try {
    const model = mongoose.models[req.query.collection_name]
      ? mongoose.model(req.query.collection_name)
      : mongoose.model(req.query.collection_name, mongooseSchema);
    let query = {};

    let result = await model.aggregate([
      {
        $facet: {
          MasterDocument: [
            {
              $match: {
                is_active: { $eq: true },
              },
            },
            {
              $unwind: "$FuncStatus",
            },
            {
              $sort: {
                "FuncStatus.time_duration": -1,
              },
            },
            {
              $group: {
                _id: "$_id",
                module: { $first: "$module" },
                filename: { $first: "$filename" },
                OverallStatus: { $first: "$OverallStatus" },
                tab: { $first: "$tab" },
                screen_name: { $first: "$screen_name" },
                FuncStatus: {
                  $push: "$FuncStatus",
                },
              },
            },
          ],
        },
      },
    ]);
    logger.info("info", {
      req: req.query,
      status: 200,
      message: "success",
      API_Endpoint: "/master_algo",
      query: "find",
    });
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    console.log("error :", err);
    logger.error("error", {
      req: req.query,
      status: 500,
      message: "error",
      API_Endpoint: "/master_algo",
      query: "find",
    });
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  reqRunMasterALgorithm,
  getMasterAlgoFileCount,
  checkCsv,
  checkCsvTemp,
  csvCountForJsFiles,
  login,
  getMasterAlgorithm,
};
