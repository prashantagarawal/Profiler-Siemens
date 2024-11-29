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
//     "Create_Custom_Code_Quality_Collection": CreateCustomCodeQualityCollection,
//     "Create_Custom_Code_Quality": CreateCustomCodeQuality,

//  })[activity];
//  (chooseActivity("Create_Custom_Code_Quality"))();

/**
 * @function [createMaster] Function calls other functions of the file
 * @returns {Object} Response to the calling function from master_abap.js file in Master Folder
 */
exports.createMaster = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Status = [];

      let const1 = await CreateCustomCodeQualityCollection();
      pushStatusData(const1, "CreateCustomCodeQualityCollection");

      let const2 = await CreateCustomCodeQuality();
      pushStatusData(const2, "CreateCustomCodeQuality");
      if (Status[0].statusCode == 400 || Status[1].statusCode == 400) {
        return resolve({
          filename: "cd_abap_custom_code_quality.js",
          statusCode: 400,
          csvName: ["Custom Code Quality - Veolia"],
          result: {},
          message: "File Not Executed Successfully",
          funcName: Status,
        });
      } else {
        return resolve({
          filename: "cd_abap_custom_code_quality.js",
          statusCode: 200,
          csvName: ["Custom Code Quality - Veolia"],
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
        filename: "cd_abap_custom_code_quality.js",
        statusCode: 400,
        csvName: ["Custom Code Quality - Veolia"],
        result: { e },
        message: "File Not Executed Successfully",
        funcName: "createMaster",
      });
    }
  });
};

/************************************** Define Each Activity below ***********************************************/

/**
 * @function [CreateCustomCodeQualityCollection] takes the csv name and creates the collection in Database .
 * @returns Returns status of the execution.
 */
// Custom Code Quality Collection
function CreateCustomCodeQualityCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-06-01.csv";
      var begin = performance.now();

      const activityModelName = "custom_dev_abap_custom_code_qualities";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-06-01.csv")
        .then(async (JsonArray) => {
          for (let val of JsonArray) {
            // val['Count - HANA Optimization'] = parseInt(val['Count - HANA Optimization']);
            // val['HANA Opti Count'] = parseInt(val['HANA Opti Count']);
            // val['Count - HANA Migration'] = parseInt(val['Count - HANA Migration']);
            // val['HANA Mig count'] = parseInt(val['HANA Mig count']);
            // val['Count - Best Practices'] = parseInt(val['Count - Best Practices']);
            // val['Best Practice count'] = parseInt(val['Best Practice count']);
            // val['Count - Security'] = parseInt(val['Count - Security']);
            // val['Security Count'] = parseInt(val['Security Count']);
          }

          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_custom_code_qualities' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_custom_code_qualities';)
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
                screen: "Custom Code Quality Collection",
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
                screen: "Custom Code Quality Collection",
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
            screen: "Custom Code Quality Collection",
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
        screen: "Custom Code Quality Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

/**
 * @function [CreateCustomCodeQuality] creates an document from the collection document created above.
 * @returns a document with specified document id and returns the status
 */
function CreateCustomCodeQuality() {
  return new Promise(async (resolve, reject) => {
    console.log("start");
    try {
      const csvName = "08-04-01.csv";
      var begin = performance.now();

      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        //Creation of Model for collections
        const activityModelName = "custom_dev_abap_custom_code_quality";
        const promiseArr = [];
        const ModelName = Mongoose.models[activityModelName]
          ? Mongoose.model(activityModelName)
          : Mongoose.model(activityModelName, mongooseSchema);

        let conditionToUpdate = {};
        let payloadToUpdate = {};

        let chart_hana_optimization = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_hana_migration = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_best_practice = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_security = {
          label: [],
          value: [],
          value_unit: "",
        };
        let panel_hana_optimization = [];
        let panel_hana_migration = [];
        let panel_best_practice = [];
        let panel_security = [];

        let CustomCodeQualityData = await ModelName.aggregate([
          {
            $facet: {
              HanaOptimizationGraph: [
                {
                  $match: {
                    "Object Type Description - HANA Optimization": { $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$Object Type Description - HANA Optimization",
                    HanaDesCount: { $first: "$Count - HANA Optimization" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
              HanaOptimizationList: [
                { $match: { "HANA Opti List": { $ne: "" } } },
                {
                  $group: {
                    _id: "$HANA Opti List",
                    HanaDesCount: { $first: "$HANA Opti Count" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
              HanaMigrationGraph: [
                {
                  $match: {
                    "Object Type Description - HANA Migration": { $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$Object Type Description - HANA Migration",
                    HanaDesCount: { $first: "$Count - HANA Migration" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
              HanaMigrationList: [
                { $match: { "HANA Migration List": { $ne: "" } } },
                {
                  $group: {
                    _id: "$HANA Migration List",
                    HanaDesCount: { $first: "$HANA Mig count" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
              BestPracticeGraph: [
                {
                  $match: {
                    "Object Type Description - Best Practices": { $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$Object Type Description - Best Practices",
                    HanaDesCount: { $first: "$Count - Best Practices" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
              BestPracticeList: [
                { $match: { "Best Practice List": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Best Practice List",
                    HanaDesCount: { $first: "$Best Practice count" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
              SecurityGraph: [
                {
                  $match: { "Object Type Description - Security": { $ne: "" } },
                },
                {
                  $group: {
                    _id: "$Object Type Description - Security",
                    HanaDesCount: { $first: "$Count - Security" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
              SecurityList: [
                { $match: { "Security List": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Security List",
                    HanaDesCount: { $first: "$Security Count" },
                  },
                },
                {
                  $project: {
                    Object_Type: "$_id",
                    HanaDesCount: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        //Hana Optimization Graph
        for (let HanaData of CustomCodeQualityData[0].HanaOptimizationGraph) {
          chart_hana_optimization["label"].push(HanaData["Object_Type"]);
          chart_hana_optimization["value"].push(+HanaData["HanaDesCount"]);
        }

        //Hana Optimization List
        for (let HanaList of CustomCodeQualityData[0].HanaOptimizationList) {
          panel_hana_optimization.push({
            label: HanaList["Object_Type"],
            value: HanaList["HanaDesCount"],
          });
        }

        panel_hana_optimization.sort((a, b) => b.value - a.value);

        //Hana Migration Graph
        for (let HanaMigData of CustomCodeQualityData[0].HanaMigrationGraph) {
          chart_hana_migration["label"].push(HanaMigData["Object_Type"]);
          chart_hana_migration["value"].push(+HanaMigData["HanaDesCount"]);
        }

        //Hana Migration List
        for (let HanaMigList of CustomCodeQualityData[0].HanaMigrationList) {
          panel_hana_migration.push({
            label: HanaMigList["Object_Type"],
            value: HanaMigList["HanaDesCount"],
          });
        }

        panel_hana_migration.sort((a, b) => b.value - a.value);

        //Best Practice Graph
        for (let BestData of CustomCodeQualityData[0].BestPracticeGraph) {
          chart_best_practice["label"].push(BestData["Object_Type"]);
          chart_best_practice["value"].push(+BestData["HanaDesCount"]);
        }

        //Hana Optimization List
        for (let BestList of CustomCodeQualityData[0].BestPracticeList) {
          panel_best_practice.push({
            label: BestList["Object_Type"],
            value: BestList["HanaDesCount"],
          });
        }

        panel_best_practice.sort((a, b) => b.value - a.value);

        //Security Graph
        for (let SecurityData of CustomCodeQualityData[0].SecurityGraph) {
          chart_security["label"].push(SecurityData["Object_Type"]);
          chart_security["value"].push(+SecurityData["HanaDesCount"]);
        }

        //Hana Optimization List
        for (let SecurityList of CustomCodeQualityData[0].SecurityList) {
          panel_security.push({
            label: SecurityList["Object_Type"],
            value: SecurityList["HanaDesCount"],
          });
        }

        panel_security.sort((a, b) => b.value - a.value);

        payloadToUpdate = {
          cust_id: "001",
          industry: "cpg",
          lob: "custom_development",
          menu: "abap",
          tab: "custom_code_quality",
          document_id: "custom_development_abap_custom_code_quality",
          __v: 0,
          chart_hana_optimization: chart_hana_optimization,
          chart_hana_migration: chart_hana_migration,
          chart_best_practice: chart_best_practice,
          chart_security: chart_security,
          panel_hana_optimization: panel_hana_optimization,
          panel_hana_migration: panel_hana_migration,
          panel_best_practice: panel_best_practice,
          panel_security: panel_security,
        };

        conditionToUpdate.document_id =
          "custom_development_abap_custom_code_quality";
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
        screen: "custom_code_quality",
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
        screen: "custom_code_quality",
        time_duration: timeTaken_ms,
      });
    }
  });
}
