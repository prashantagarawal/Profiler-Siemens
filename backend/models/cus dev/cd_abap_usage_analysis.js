"use strict";
const CSVToJSON = require("csvtojson");
const queryDao = require("../../dao/mongodao");
const Mongoose = require("mongoose");
const _ = require("underscore");
const mongooseSchema = new Mongoose.Schema({}, { strict: false });
const performance = require("perf_hooks").performance;

/**
 * @function [chooseActivity] To execute one function at a time
 * @param {string} activity Name of function that we need to execute
 */
// const chooseActivity = (activity) => ({
//     "Create_Usage_Analysis_Collection": CreateUsageAnalysisCollection,
//     "Create_Usage_Analysis": CreateUsageAnalysis,

//  })[activity];
//  (chooseActivity("Create_Usage_Analysis"))();

/**
 * @function [createMaster] Function calls other functions of the file
 * @returns {Object} Response to the calling function from master_abap.js file in Master Folder
 */
exports.createMaster = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Status = [];

      let const1 = await CreateUsageAnalysisCollection();
      pushStatusData(const1, "CreateUsageAnalysisCollection");

      let const2 = await CreateUsageAnalysis();
      pushStatusData(const2, "CreateUsageAnalysis");

      if (Status[0].statusCode == 400 || Status[1].statusCode == 400) {
        return resolve({
          filename: "cd_abap_usage_analysis.js",
          statusCode: 400,
          csvName: ["Usage Anlysis - Veolia"],
          result: {},
          message: "File Not Executed Successfully",
          funcName: Status,
        });
      } else {
        return resolve({
          filename: "cd_abap_usage_analysis.js",
          statusCode: 200,
          csvName: ["Usage Anlysis - Veolia"],
          result: {},
          message: "File Executed Successfully",
          funcName: Status,
        });
      }

      //Function to push the status code and messages
      function pushStatusData(data, funcName) {
        try {
          if (data) {
            Status.push({
              statusCode: data.statusCode,
              result: data.result,
              message: data.message,
              csvName: data.csvName,
              time_duration: data.time_duration,
              funcName: funcName,
            });
          } else {
            Status.push({
              statusCode: 400,
              result: {},
              message: "Data Not Present",
              csvName: data.csvName,
              time_duration: data.time_duration,
              funcName: funcName,
            });
          }
        } catch (e) {
          console.log("e", e);
        }
      }
    } catch (e) {
      console.log("Errorr", e);
      return resolve({
        filename: "cd_abap_usage_analysis.js",
        statusCode: 400,
        csvName: ["Usage Anlysis - Veolia"],
        result: { e },
        message: "File Not Executed Successfully",
        funcName: "createMaster",
      });
    }
  });
};

/************************************** Define Each Activity below ***********************************************/

/**
 * @function [CreateUsageAnalysisCollection] takes the csv name and creates the collection in Database .
 *
 * @returns Returns status of the execution.
 */
// Usage Analysis Collection
function CreateUsageAnalysisCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-04-01.csv";
      var begin = performance.now();

      const activityModelName = "custom_dev_abap_usage_analysises";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-04-01.csv")
        .then(async (JsonArray) => {
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_usage_analysises' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_usage_analysises';)
            //by inserting documents.
            let result = await queryDao.insertMany(
              activityModelName,
              JsonArray
            );

            if (result.statusCode === 200) {
              const end = performance.now();
              const timeTaken_ms = end - begin;
              return resolve({
                statusCode: 200,
                result: {},
                message: "File Executed Successfully",
                csvName: csvName,
                screen: "Usage Analysis Collection",
                time_duration: timeTaken_ms,
              });
            } else {
              const end = performance.now();
              const timeTaken_ms = end - begin;
              return resolve({
                statusCode: 400,
                result: result,
                message: "File Not Executed Successfully",
                csvName: csvName,
                screen: "Usage Analysis Collection",
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
            screen: "Usage Analysis Collection",
            time_duration: timeTaken_ms,
          });
        });
    } catch (e) {
      const end = performance.now();
      const timeTaken_ms = end - begin;
      console.log(e);
      return resolve({
        statusCode: 400,
        result: e.stack,
        message: "File Not Executed Successfully",
        csvName: csvName,
        screen: "Usage Analysis Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

/**
 * @function [CreateUsageAnalysis] creates an document from the collection document created above.
 * @returns a document with specified document id and returns the status
 */
function CreateUsageAnalysis() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-04-01.csv";
      var begin = performance.now();

      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        //Creation of Model for collections
        const activityModelName = "custom_dev_abap_usage_analysises";
        const promiseArr = [];
        const ModelName = Mongoose.models[activityModelName]
          ? Mongoose.model(activityModelName)
          : Mongoose.model(activityModelName, mongooseSchema);

        let conditionToUpdate = {};
        let payloadToUpdate = {};

        let allmonths = [];
        var months = new Array(12);
        months["Jan"] = 1;
        months["Feb"] = 2;
        months["Mar"] = 3;
        months["Apr"] = 4;
        months["May"] = 5;
        months["Jun"] = 6;
        months["Jul"] = 7;
        months["Aug"] = 8;
        months["Sep"] = 9;
        months["Oct"] = 10;
        months["Nov"] = 11;
        months["Dec"] = 12;

        let chart_artifact_wise_custom = {
          label: [],
          value1: {
            label: "Count in Inventory",
            value: [],
          },
          value2: {
            label: "Count in Usage Log",
            value: [],
          },
          value_unit: "",
        };
        let chart_standard_custom = {
          label: [],
          value1: {
            label: "Standard",
            value: [],
          },
          value2: {
            label: "Custom",
            value: [],
          },
          value_unit: "",
        };
        let panel_frequently_custom_transaction = [];
        let panel_frequently_custom_programs = [];
        let panel_artifact_wise_custom = [];

        let UsageData = await ModelName.aggregate([
          {
            $facet: {
              ArtifactGraphData: [
                { $match: { "Object Type": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Object Type",
                    InventoryCount: { $first: "$Count in Inventory" },
                    UsageCount: { $first: "$Count in Usage Log" },
                    UsagePercent: { $first: "$Usage %" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    InventoryCount: 1,
                    UsageCount: 1,
                    UsagePercent: 1,
                    _id: 0,
                  },
                },
              ],
              AllMonths: [
                { $match: { Category: { $ne: "" } } },
                {
                  $group: {
                    _id: "$Category",
                  },
                },
                {
                  $project: {
                    Category: "$_id",
                    _id: 0,
                  },
                },
              ],
              CustomTransaction: [
                { $match: { "Transaction Code": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Transaction Code",
                    Tcode_count: { $first: "$Tcode Total Count" },
                  },
                },
                {
                  $project: {
                    Tcode: "$_id",
                    Tcode_count: 1,
                    _id: 0,
                  },
                },
              ],
              CustomProgram: [
                { $match: { Program: { $ne: "" } } },
                {
                  $group: {
                    _id: "$Program",
                    program_count: { $first: "$Program Total Count" },
                  },
                },
                {
                  $project: {
                    Program: "$_id",
                    program_count: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        //ARTIFACT WISE CUSTOM OBJECT USAGE Graph / List

        for (let ArtifactData of UsageData[0].ArtifactGraphData) {
          //console.log("ArtifactData",ArtifactData)
          chart_artifact_wise_custom["label"].push(ArtifactData["Object_Type"]);
          chart_artifact_wise_custom["value1"]["value"].push(
            +ArtifactData["InventoryCount"]
          );
          chart_artifact_wise_custom["value2"]["value"].push(
            +ArtifactData["UsageCount"]
          );

          panel_artifact_wise_custom.push({
            object_type: ArtifactData["Object_Type"],
            inventory_count: ArtifactData["InventoryCount"],
            usage_count: ArtifactData["UsageCount"],
            usage_percent: ArtifactData["UsagePercent"],
          });
        }

        panel_artifact_wise_custom.sort(
          (a, b) => b.inventory_count - a.inventory_count
        );

        for (let GraphData of UsageData[0].AllMonths) {
          allmonths.push(GraphData["Category"]);
        }

        function sortDate(a, b) {
          var m1 = a.substring(0, 3);
          var y1 = a.substring(4);
          var m2 = b.substring(0, 3);
          var y2 = b.substring(4);

          if (Number(y1) > Number(y2)) {
            return 1;
          } else if (Number(y1) < Number(y2)) {
            return -1;
          } else {
            if (months[m1] > months[m2]) {
              return 1;
            } else if (months[m1] < months[m2]) {
              return -1;
            }
          }

          return 0;
        }

        allmonths = allmonths.sort(sortDate);

        //STANDARD OBJECTS VS CUSTOM OBJECTS Graph

        let MonthData = [];
        for (let Monthwise of allmonths) {
          MonthData = await ModelName.aggregate([
            { $match: { Category: { $eq: Monthwise } } },
            {
              $group: {
                _id: "$Category",
                Standard: { $first: "$Standard" },
                Custom: { $first: "$Custom" },
              },
            },
            {
              $project: {
                Category: "$_id",
                Standard: 1,
                Custom: 1,
                _id: 0,
              },
            },
          ]);
          chart_standard_custom["label"].push(Monthwise);
          chart_standard_custom["value1"]["value"].push(
            +MonthData[0]["Standard"]
          );
          chart_standard_custom["value2"]["value"].push(
            +MonthData[0]["Custom"]
          );
        }
        //TOP 20 FREQUENTLY USED CUSTOM TRANSACTIONS
        for (let CustomTran of UsageData[0].CustomTransaction) {
          panel_frequently_custom_transaction.push({
            label: CustomTran["Tcode"],
            value: CustomTran["Tcode_count"],
          });
        }

        panel_frequently_custom_transaction.sort((a, b) => b.value - a.value);

        //TOP 20 FREQUENTLY USED CUSTOM Programs
        for (let CustomProg of UsageData[0].CustomProgram) {
          panel_frequently_custom_programs.push({
            label: CustomProg["Program"],
            value: CustomProg["program_count"],
          });
        }

        panel_frequently_custom_programs.sort((a, b) => b.value - a.value);
        // console.log("panel_frequently_custom_programs",panel_frequently_custom_programs)

        payloadToUpdate = {
          cust_id: "001",
          industry: "cpg",
          lob: "custom_development",
          menu: "abap",
          tab: "usage_analysis",
          document_id: "custom_development_abap_usage_analysis",
          __v: 0,
          chart_artifact_wise_custom: chart_artifact_wise_custom,
          chart_standard_custom: chart_standard_custom,
          panel_artifact_wise_custom: panel_artifact_wise_custom,
          panel_frequently_custom_transaction:
            panel_frequently_custom_transaction,
          panel_frequently_custom_programs: panel_frequently_custom_programs,
        };

        conditionToUpdate.document_id =
          "custom_development_abap_usage_analysis";
        let updateResult = await queryDao.UpdateDocument(
          "custom_developments",
          conditionToUpdate,
          payloadToUpdate,
          false,
          true
        );

        let response = await Promise.all(promiseArr);
      } else {
        console.log("MongoDB not connected");
      }
      const end = performance.now();
      const timeTaken_ms = end - begin;
      return resolve({
        statusCode: 200,
        result: {},
        message: "File Executed Successfully",
        csvName: csvName,
        screen: "abap_usage_analysis",
        time_duration: timeTaken_ms,
      });
    } catch (e) {
      const end = performance.now();
      const timeTaken_ms = end - begin;
      console.log("error", e);
      return resolve({
        statusCode: 400,
        result: e.stack,
        message: "File Not Executed Successfully",
        csvName: csvName,
        screen: "abap_usage_analysis",
        time_duration: timeTaken_ms,
      });
    }
  });
}
