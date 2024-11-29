"use strict";
require("dotenv").config({ path: `.env.${process.env.Client}` });
const CSVToJSON = require("csvtojson");
const converter = require("json-2-csv");
const queryDao = require("../../dao/mongodao");
const Mongoose = require("mongoose");
const mongooseSchema = new Mongoose.Schema({}, { strict: false });
const performance = require("perf_hooks").performance;

const fs = require("fs");
const path = require("path");
var repository_file;
var csvs_received;
var length_received_csvs;
// backend directory path
const dirPath = path.join(__dirname, "..", "..");

let res = [];
const csv = require("csv-parser");
let nameArr = [];
let nameArr1 = [];
const results = [];
let count = 0;
module.exports = { createCollectionForAllCSV };

function createCollectionForAllCSV(moduleName) {
  return new Promise(async (resolve, reject) => {
    try {
      var begin = performance.now();
      console.log(
        "createCollectionForAllCSV Function is started.................................. \n"
      );

      const activityModelName = "all_csv_datas";
      const csvName = "MasterCsvDetailsProfiler2.csv";
      repository_file = fs.readdirSync(`${dirPath}/repository/${moduleName}`);
      length_received_csvs = fs.readdirSync(
        `${dirPath}/temp/${moduleName}`
      ).length;

      const ModelName = Mongoose.models[activityModelName]
        ? Mongoose.model(activityModelName)
        : Mongoose.model(activityModelName, mongooseSchema);
      await CSVToJSON()
        .fromFile(`${dirPath}/excel_files/MasterCsvDetailsProfiler2.csv`)
        .then(async (JsonArray) => {
          for (let val of JsonArray) {
            val["Provided"] = "";
            val["Correct\\Incorrect"] = "";
            val["Remarks"] = "";
            val["StatusCode"] = "";
          }

          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            // let result1 = await queryDao.dropCollection(activityModelName)       //the col has been created already in company code
            let result = await queryDao.insertMany(
              activityModelName,
              JsonArray
            );

            if (result.statusCode === 200) {
              res = [];
              let resultOfCheckCSV = await check(moduleName);
              if (resultOfCheckCSV && resultOfCheckCSV.statusCode === 200) {
                const end = performance.now();
                const timeTaken_ms = end - begin;
                return resolve({
                  statusCode: 200,
                  totalCSVsRequired: repository_file.length,
                  totalCSVsRecieved: length_received_csvs,
                  result: resultOfCheckCSV.result,
                  message: "Collection Created and Csvs checked",
                  csvName: "",
                  time_duration: timeTaken_ms,
                });
              } else {
                const end = performance.now();
                const timeTaken_ms = end - begin;
                return resolve({
                  statusCode: 400,
                  result: {},
                  message: "Collection Created & Error while checking CSVs",
                  csvName: "",
                  time_duration: timeTaken_ms,
                });
              }
            } else {
              const end = performance.now();
              const timeTaken_ms = end - begin;
              console.log("Collection Not Created : ", result);
              return resolve({
                statusCode: 400,
                result: {},
                message: "Collection Not Created",
                csvName: csvName,
                time_duration: timeTaken_ms,
              });
            }
          } else {
            console.log("MongoDB not connected");
          }
        })
        .catch((err) => {
          const end = performance.now();
          const timeTaken_ms = end - begin;
          // log error if any
          console.log("error", err);
          return resolve({
            statusCode: 400,
            result: err.stack,
            message: "Collection Not Created",
            csvName: csvName,
            time_duration: timeTaken_ms,
          });
        });
    } catch (e) {
      const end = performance.now();
      const timeTaken_ms = end - begin;
      return resolve({
        statusCode: 400,
        result: e.stack,
        message: "Collection Not Created",
        csvName: "",
        time_duration: timeTaken_ms,
      });
    }
  });
}

function check(moduleName) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log(
        "check Function Started.................................. \n"
      );
      let sample_csv_keys = [];
      let recieved_csv_keys = [];
      let checkColumnResult;
      let csvsNotMatched = [];
      csvs_received = fs.readdirSync(`${dirPath}/temp/${moduleName}`);
      console.log("Recieved Csvs", csvs_received, repository_file);

      for (let recievedCsvName of csvs_received) {
        // taking each csv file in we recieved from ABAP team

        recievedCsvName = recievedCsvName.split(/\.(?=[^\.]+$)/); // Removing .csv extension
        let flag = false;
        for (let repositoryCsvName of repository_file) {
          // taking each sample csv file from Repository
          repositoryCsvName = repositoryCsvName.split(/\.(?=[^\.]+$)/); // Removing .csv extension

          if (recievedCsvName[0].localeCompare(repositoryCsvName[0]) == 0) {
            // checking whether the recieved filename matches with sample csvs from repository

            flag = true;
            let received_csv =
              `${dirPath}/temp/${moduleName}/` + recievedCsvName[0] + ".csv"; //pushing the received files
            let repository_csv =
              `${dirPath}/repository/${moduleName}/` +
              repositoryCsvName[0] +
              ".csv"; //pushing the repository files

            let repository_csv_header = await getColumns(repository_csv); //get the column headers of repository csv

            let received_csv_header = await getColumns(received_csv); //get the column headers of temp csv

            if (
              repository_csv_header.statusCode == 200 &&
              received_csv_header.statusCode == 200
            ) {
              checkColumnResult = await checkCol(
                repository_csv_header.result,
                received_csv_header.result,
                recievedCsvName,
                moduleName
              ); // calling the function to check the columns
            }
          }
        }
        if (flag == false) {
          res.push({
            statusCode: 404,
            result: {},
            file: recievedCsvName[0],
            message: `CSV does not belong to ${moduleName.toUpperCase()} module.`,
          });
        }
      }

      return resolve({
        statusCode: 200,
        result: res,
        message: "Csvs checked successfully.",
        csvName: "",
      });
    } catch (e) {
      console.log("Error", e);
      return resolve({
        statusCode: 400,
        result: {},
        message: "All csvs were not checked successfully.",
        csvName: "",
      });
    }
  });
}

function getColumns(csv_file) {
  return new Promise(async function (resolve, reject) {
    try {
      var nameArr = [];
      var csv_keys = [];
      fs.createReadStream(csv_file)
        .pipe(csv())
        .on("headers", (headers) => {
          nameArr.push(`${headers}`);
          csv_keys = nameArr[0].split(","); //fetching the veolia csv column headers
          return resolve({
            statusCode: 200,
            result: csv_keys,
            message: "Headers Fetched",
            csvName: "",
          });
        });
    } catch (e) {
      console.log("Error", e);
      return resolve({
        statusCode: 400,
        result: [],
        message: "Error while fetching headers",
        csvName: "",
      });
    }
  });
}

function checkCol(
  sample_csv_keys,
  recieved_csv_keys,
  recievedCsvName,
  moduleName
) {
  return new Promise(async function (resolve, reject) {
    try {
      let csv_flag = true;
      let key_name = [];
      let file_name = "";
      let index = 0;
      let queryToFindDocument = {};
      let fieldsToSelect = {};
      let conditionToUpdate = {};
      let payloadToUpdate = {};

      for (let check of sample_csv_keys) {
        if (check.localeCompare(recieved_csv_keys[index]) == 0) {
          //comparing the headers
        } else {
          key_name.push(check);
        }
        index++;
      }
      if (key_name.length) {
        csv_flag = false;
      }

      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        const activityModelName = "all_csv_datas";
        const ModelName = Mongoose.models[activityModelName]
          ? Mongoose.model(activityModelName)
          : Mongoose.model(activityModelName, mongooseSchema);
        queryToFindDocument = {
          "Proposed CSV Names": recievedCsvName[0] + ".csv",
        };
        fieldsToSelect = {
          _id: 1,
          "Proposed CSV Names": 1,
          Remarks: 1,
          Provided: 1,
          "Correct\\Incorrect": 1,
          StatusCode: 1,
        };
        let findDocumentResult = await queryDao.findAll(
          activityModelName,
          queryToFindDocument,
          fieldsToSelect
        );
        if (csv_flag == false) {
          count++;
          payloadToUpdate = {
            Remarks: "Csv column are not matched " + key_name,
            Provided: "Yes",
            "Correct\\Incorrect": "Incorrect",
            StatusCode: 400,
          };

          res.push({
            statusCode: 400,
            result: {},
            // csv: key_name,
            file: recievedCsvName[0],
            message: "CSV columns mismatched. Expecting columns : " + key_name,
          });
        } else {
          count++;
          payloadToUpdate = {
            Remarks: "csv is good to integrate",
            Provided: "Yes",
            "Correct\\Incorrect": "Correct",
            StatusCode: 200,
          };

          res.push({
            statusCode: 200,
            result: {},
            file: recievedCsvName[0],
            message: "CSV is in correct format.",
          });

          let sourceDir = `${dirPath}/temp/${moduleName}`;
          let destDir = `${dirPath}/excel_files/${moduleName}`;
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir);
          }
          const pathToFile = path.join(
            sourceDir,
            recievedCsvName[0] + "." + recievedCsvName[1]
          );
          const pathToNewDestination = path.join(
            destDir,
            recievedCsvName[0] + "." + recievedCsvName[1]
          );
          try {
            fs.copyFileSync(pathToFile, pathToNewDestination);
            console.log("Successfully copied and moved the file!");
            fs.unlink(pathToFile, (err) => {
              if (err) {
                console.log("failed to delete:" + err);
              } else {
              }
            });
          } catch (err) {
            throw err;
          }
        }

        if (findDocumentResult.result && findDocumentResult.result.length) {
          conditionToUpdate["Proposed CSV Names"] = recievedCsvName[0] + ".csv";
          let updateResult = await queryDao.UpdateManyDocument(
            activityModelName,
            conditionToUpdate,
            payloadToUpdate,
            false,
            true
          );
        }
      }
      if (count == length_received_csvs) {
        let finalResult = await createDocumentForCSVs();
        console.log("Result", res);
      }
      return resolve({
        statusCode: 200,
        result: res,
        message: "Csv Checked",
        csvName: "",
      });
    } catch (e) {
      console.log("Error", e);
      return resolve({
        statusCode: 400,
        result: e.stack,
        message: "Function Not Executed Successfully",
        csvName: "",
      });
    }
  });
}

function createDocumentForCSVs() {
  return new Promise(async (resolve, reject) => {
    try {
      var begin = performance.now();
      console.log(
        "createDocumentForCSVs Function Started.................................. \n"
      );
      const activityModelName = "all_csv_datas";
      const activityModelName1 = "master_csv_documents";
      let payloadToUpdate = {};
      let conditionToUpdate = {};
      let overallCsvDetail = [];
      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        const ModelName = Mongoose.models[activityModelName]
          ? Mongoose.model(activityModelName)
          : Mongoose.model(activityModelName, mongooseSchema);
        const ModelName1 = Mongoose.models[activityModelName1]
          ? Mongoose.model(activityModelName1)
          : Mongoose.model(activityModelName1, mongooseSchema);

        let distinctCsvNameModuleWise = await ModelName.aggregate([
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
              _id: { module: "$Module", csv_name: "$Proposed CSV Names" },
              Remarks: { $first: "$Remarks" },
              Provided: { $first: "$Provided" },
              "Correct\\Incorrect": { $first: "$Correct\\Incorrect" },
              StatusCode: { $first: "$StatusCode" },
              "Manual Csvs": { $first: "$Manual Files" },
              "Tab Name": { $first: "$Tab Name" },
            },
          },
          {
            $group: {
              _id: "$_id.module",
              csvDetails: {
                $push: {
                  csv_name: "$_id.csv_name",
                  Remarks: "$Remarks",
                  Provided: "$Provided",
                  "Correct\\Incorrect": "$Correct\\Incorrect",
                  StatusCode: "$StatusCode",
                  "Manual Csvs": "$Manual Csvs",
                  "Tab Name": "$Tab Name",
                },
              },
            },
          },
        ]);

        for (let csvNameModuleWise of distinctCsvNameModuleWise) {
          let csvsProvided = 0;
          let correctCsvsProvided = 0;
          let totalCsvsRequired = 0;
          let totalManualCsvs = 0;
          let manualCsvsProvided = 0;
          let correctManualCsvsProvided = 0;
          let overallCsvDetailObj = {
            Modules: 0,
            "Total CSV required": 0,
            "Manual CSV required from Functionals": 0,
            "CSV Received from ABAP": 0,
            "CSV Received from Functionals": 0,
            "Issues in CSV": 0,
            "Issues in Manual CSV": 0,
            "Total Csvs Yet To Receive": 0,
            "Manual Csvs Yet To Receive": 0,
          };

          console.log("Module Name : " + csvNameModuleWise._id);
          console.table(csvNameModuleWise.csvDetails);
          for (let csvAnalysis of csvNameModuleWise.csvDetails) {
            totalCsvsRequired++;
            if (
              csvAnalysis["Provided"] == "Yes" &&
              csvAnalysis["Manual Csvs"] != "X"
            ) {
              csvsProvided++;
              if (csvAnalysis["Correct\\Incorrect"] == "Correct") {
                correctCsvsProvided++;
              }
            }

            if (csvAnalysis["Manual Csvs"] == "X") {
              totalManualCsvs++;
              if (csvAnalysis["Provided"] == "Yes") {
                manualCsvsProvided++;
                if (csvAnalysis["Correct\\Incorrect"] == "Correct") {
                  correctManualCsvsProvided++;
                }
              }
            }
          }

          converter.json2csv(csvNameModuleWise.csvDetails, (err, csv) => {
            if (err) {
              throw err;
            }

            // print CSV string
            fs.writeFileSync(
              `${dirPath}/excel_files/ModuleWiseDetail${csvNameModuleWise._id}.csv`,
              csv,
              "UTF-8",
              { flags: "a+" }
            );
          });
          console.log("Total Csvs Provided : " + csvsProvided);
          console.log("Total Correct Csvs Provided : " + correctCsvsProvided);
          overallCsvDetailObj["Modules"] = csvNameModuleWise._id;
          overallCsvDetailObj["Total CSV required"] = totalCsvsRequired;
          overallCsvDetailObj["Manual CSV required from Functionals"] =
            totalManualCsvs;
          overallCsvDetailObj["CSV Received from ABAP"] = csvsProvided;
          overallCsvDetailObj["CSV Received from Functionals"] =
            manualCsvsProvided;
          overallCsvDetailObj["Issues in CSV"] =
            csvsProvided - correctCsvsProvided;
          overallCsvDetailObj["Issues in Manual CSV"] =
            manualCsvsProvided - correctManualCsvsProvided;
          overallCsvDetailObj["Total Csvs Yet To Receive"] =
            totalCsvsRequired - csvsProvided - manualCsvsProvided;
          overallCsvDetailObj["Manual Csvs Yet To Receive"] =
            totalManualCsvs - manualCsvsProvided;
          overallCsvDetail.push({
            Modules: overallCsvDetailObj["Modules"],
            "Total CSV required": overallCsvDetailObj["Total CSV required"],
            "Manual CSV required from Functionals":
              overallCsvDetailObj["Manual CSV required from Functionals"],
            "CSV Received from ABAP":
              overallCsvDetailObj["CSV Received from ABAP"],
            "CSV Received from Functionals":
              overallCsvDetailObj["CSV Received from Functionals"],
            "Issues in CSV": overallCsvDetailObj["Issues in CSV"],
            "Issues in Manual CSV": overallCsvDetailObj["Issues in Manual CSV"],
            "Total Csvs Yet To Receive":
              overallCsvDetailObj["Total Csvs Yet To Receive"],
            "Manual Csvs Yet To Receive":
              overallCsvDetailObj["Manual Csvs Yet To Receive"],
          });
        }

        let distinctCsvNameScreenWise = await ModelName.aggregate([
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
              _id: {
                module: "$Module",
                tab_name: "$Tab Name",
                detail_screen_name: "$Sub Process Name",
              },
              csvNames: { $push: "$Proposed CSV Names" },
              provided: { $push: "$Provided" },
              correctness: { $push: "$Correct\\Incorrect" },
            },
          },
          {
            $group: {
              _id: "$_id.module",
              screenDetails: {
                $push: {
                  tab_name: "$_id.tab_name",
                  detail_screen_name: "$_id.detail_screen_name",
                  csvNames: "$csvNames",
                  provided: "$provided",
                  correctness: "$correctness",
                },
              },
            },
          },
        ]);

        for (let csvNameScreenWise of distinctCsvNameScreenWise) {
          console.log("Module Name : " + csvNameScreenWise._id);
          for (let screenWiseCsv of csvNameScreenWise.screenDetails) {
            screenWiseCsv["Module"] = csvNameScreenWise._id;
            if (
              screenWiseCsv.correctness.includes("Incorrect") ||
              screenWiseCsv.correctness.includes("")
            ) {
              screenWiseCsv["Visible"] = "No";
            } else {
              screenWiseCsv["Visible"] = "Yes";
            }
          }

          converter.json2csv(csvNameScreenWise.screenDetails, (err, csv) => {
            if (err) {
              throw err;
            }

            // print CSV string
            fs.writeFileSync(
              `${dirPath}/excel_files/screenWiseDetail${csvNameScreenWise._id}.csv`,
              csv,
              "UTF-8",
              { flags: "a+" }
            );
          });
        }

        console.table(overallCsvDetail);
        converter.json2csv(overallCsvDetail, (err, csv) => {
          if (err) {
            throw err;
          }
          // print CSV string
          fs.writeFileSync(
            `${dirPath}/excel_files/OverallCSVStatus.csv`,
            csv,
            "UTF-8",
            {
              flags: "a+",
            }
          );
        });

        conditionToUpdate.document_id = "overall_csv_status";
        payloadToUpdate = {
          document_id: "overall_csv_status",
          module_wise_summary: overallCsvDetail,
        };
        let updateResult = await queryDao.UpdateDocument(
          activityModelName1,
          conditionToUpdate,
          payloadToUpdate,
          false,
          true
        );
        const end = performance.now();
        const timeTaken_ms = end - begin;

        return resolve({
          statusCode: 200,
          result: {},
          message: "Collection Created",
          csvName: "",
          time_duration: timeTaken_ms,
        });
      } else {
        console.log("MongoDB not connected");
      }
    } catch (e) {
      const end = performance.now();
      const timeTaken_ms = end - begin;
      console.log("error", e);
      return resolve({
        statusCode: 400,
        result: e.stack,
        message: "Function Not Executed Successfully",
        csvName: "",
        time_duration: timeTaken_ms,
      });
    }
  });
}
