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
// "Create_Transport_Req_Analysis_Collection": CreateTransportReqAnalysisCollection,
// "Create_Transport_Req_Analysis": CreateTransportReqAnalysis,

// })[activity];
// (chooseActivity("Create_Transport_Req_Analysis"))();

/**
 * @function [createMaster] Function calls other functions of the file
 * @returns {Object} Response to the calling function from master_abap.js file in Master Folder
 */
exports.createMaster = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Status = [];

      let const1 = await CreateTransportReqAnalysisCollection();
      pushStatusData(const1, "CreateTransportReqAnalysisCollection");

      let const2 = await CreateTransportReqAnalysis();
      pushStatusData(const2, "CreateTransportReqAnalysis");

      if (Status[0].statusCode == 400 || Status[1].statusCode == 400) {
        return resolve({
          filename: "cd_abap_transport_req.js",
          statusCode: 400,
          csvName: ["Custom Code Transports - Veolia"],
          result: {},
          message: "File Not Executed Successfully",
          funcName: Status,
        });
      } else {
        return resolve({
          filename: "cd_abap_transport_req.js",
          statusCode: 200,
          csvName: ["Custom Code Transports - Veolia"],
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
        filename: "cd_abap_transport_req.js",
        statusCode: 400,
        csvName: ["Custom Code Transports - Veolia"],
        result: { e },
        message: "File Not Executed Successfully",
        funcName: "createMaster",
      });
    }
  });
};
/************************************** Define Each Activity below ***********************************************/

// Transport Req Analysis Collection
function CreateTransportReqAnalysisCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-05-01.csv";
      var begin = performance.now();

      const activityModelName = "custom_dev_abap_transport_req_analysises";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-05-01.csv")
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
            //Deletes the existing collection 'custom_dev_abap_transport_req_analysises' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_transport_req_analysises';)
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
                screen: "Transport Req Analysis Collection",
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
                screen: "Transport Req Analysis Collection",
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
            screen: "Transport Req Analysis Collection",
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
        screen: "Transport Req Analysis Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

/**
 * @function [CreateTransportReqAnalysis] creates an document from the collection document created above.
 * @returns a document with specified document id and returns the status
 */
function CreateTransportReqAnalysis() {
  return new Promise(async (resolve, reject) => {
    console.log("start");
    try {
      const csvName = "08-05-01.csv";
      var begin = performance.now();

      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        //Creation of Model for collections
        const activityModelName = "custom_dev_abap_transport_req_analysises";
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

        let chart_workbench_repair_customizing = {
          label: [],
          value1: {
            label: "Workbench Request",
            value: [],
          },
          value2: {
            label: "Repair Request",
            value: [],
          },
          value3: {
            label: "Customising Request",
            value: [],
          },
          value_unit: "",
        };
        let panel_frequently_transported_object = [];

        let TransportReqData = await ModelName.aggregate([
          {
            $facet: {
              Graph: [
                { $match: { "Month-Year": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Month-Year",
                  },
                },
                {
                  $project: {
                    Month: "$_id",
                  },
                },
              ],
              TransportList: [
                { $match: { "Object Name": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Object Name",
                    Object: { $first: "$Object" },
                    CountVal: { $first: "$Count" },
                  },
                },
                {
                  $project: {
                    Object_Name: "$_id",
                    Object: 1,
                    CountVal: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        for (let GraphData of TransportReqData[0].Graph) {
          allmonths.push(GraphData["Month"]);
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
        //WORKBENCH VS REPAIR VS CUSTOMIZING TRANSPORTS Graph

        let MonthData = [];
        for (let Monthwise of allmonths) {
          MonthData = await ModelName.aggregate([
            { $match: { "Month-Year": { $eq: Monthwise } } },
            {
              $group: {
                _id: "$Month-Year",
                YearVal: { $first: "$Year" },
                WorkBenchData: { $first: "$Workbench Request" },
                RepairData: { $first: "$Repair Request" },
                CustomisingData: { $first: "$Customising Request" },
              },
            },
            {
              $project: {
                Month: "$_id",
                YearVal: 1,
                WorkBenchData: 1,
                RepairData: 1,
                CustomisingData: 1,
                _id: 0,
              },
            },
          ]);
          chart_workbench_repair_customizing["label"].push(Monthwise);
          chart_workbench_repair_customizing["value1"]["value"].push(
            +MonthData[0]["WorkBenchData"]
          );
          chart_workbench_repair_customizing["value2"]["value"].push(
            +MonthData[0]["RepairData"]
          );
          chart_workbench_repair_customizing["value3"]["value"].push(
            +MonthData[0]["CustomisingData"]
          );
        }
        //Transport List
        for (let TransportData of TransportReqData[0].TransportList) {
          panel_frequently_transported_object.push({
            object: TransportData["Object"],
            object_name: TransportData["Object_Name"],
            count: TransportData["CountVal"],
          });
        }

        panel_frequently_transported_object.sort((a, b) => b.count - a.count);

        payloadToUpdate = {
          cust_id: "001",
          industry: "cpg",
          lob: "custom_development",
          menu: "abap",
          tab: "transport_req_analysis",
          document_id: "custom_development_abap_transport_req_analysis",
          __v: 0,
          chart_workbench_repair_customizing:
            chart_workbench_repair_customizing,
          panel_frequently_transported_object:
            panel_frequently_transported_object,
        };

        conditionToUpdate.document_id =
          "custom_development_abap_transport_req_analysis";
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
        screen: "transport_req_analysis",
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
        screen: "transport_req_analysis",
        time_duration: timeTaken_ms,
      });
    }
  });
}
