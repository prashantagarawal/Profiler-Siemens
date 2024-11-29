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
//     "Create_Interface_KPI_Collection": CreateInterfaceKPICollection,
//     "Create_Interface_Graph_Collection": CreateInterfaceGraphCollection,
//     "Create_Interface_Odata_Graph_Collection": CreateInterfaceOdataGraphCollection,
//     "Create_Interface_RFC_Function_Graph_Collection": CreateInterfaceRFCFunctionGraphCollection,
//     "Create_Interface_RFC_Modules_Graph_Collection": CreateInterfaceRFCModulesGraphCollection,
//     "Create_Custom_Idoc_Message_Collection": CreateCustomIdocMessageCollection,
//     "Create_Interface_Idoc_Interface_Inbound_Graph_Collection": CreateInterfaceIdocInterfaceInboundGraphCollection,
//     "Create_Interface_Idoc_Interface_Outbound_Graph_Collection": CreateInterfaceIdocInterfaceOutboundGraphCollection,
//     "Create_Interface_Insights": CreateInterfaceInsight,

//  })[activity];
//  (chooseActivity("Create_Interface_Idoc_Interface_Outbound_Graph_Collection"))();

/**
 * @function [createMaster] Function calls other functions of the file
 * @returns {Object} Response to the calling function from master_abap.js file in Master Folder
 */
exports.createMaster = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Status = [];

      let const1 = await CreateInterfaceKPICollection();
      pushStatusData(const1, "CreateInterfaceKPICollection");

      let const2 = await CreateInterfaceGraphCollection();
      pushStatusData(const2, "CreateInterfaceGraphCollection");

      let const3 = await CreateInterfaceOdataGraphCollection();
      pushStatusData(const3, "CreateInterfaceOdataGraphCollection");

      let const4 = await CreateInterfaceRFCFunctionGraphCollection();
      pushStatusData(const4, "CreateInterfaceRFCFunctionGraphCollection");

      let const5 = await CreateInterfaceRFCModulesGraphCollection();
      pushStatusData(const5, "CreateInterfaceRFCModulesGraphCollection");

      let const6 = await CreateCustomIdocMessageCollection();
      pushStatusData(const6, "CreateCustomIdocMessageCollection");

      let const7 = await CreateInterfaceIdocInterfaceInboundGraphCollection();
      pushStatusData(
        const7,
        "CreateInterfaceIdocInterfaceInboundGraphCollection"
      );

      let const8 = await CreateInterfaceIdocInterfaceOutboundGraphCollection();
      pushStatusData(
        const8,
        "CreateInterfaceIdocInterfaceOutboundGraphCollection"
      );

      let const9 = await CreateInterfaceInsight();
      pushStatusData(const9, "CreateInterfaceInsight");

      // if(Status[0].statusCode == 400){
      if (
        Status[0].statusCode == 400 ||
        Status[1].statusCode == 400 ||
        Status[2].statusCode == 400 ||
        Status[3].statusCode == 400 ||
        Status[4].statusCode == 400 ||
        Status[5].statusCode == 400 ||
        Status[6].statusCode == 400 ||
        Status[7].statusCode == 400 ||
        Status[8].statusCode == 400
      ) {
        return resolve({
          filename: "cd_abap_interface_insight.js",
          statusCode: 400,
          csvName: [
            "Interface Insights - Part 1",
            "Interface Insights - Part2",
            "Interface Insights - ODATA",
            "RFC_Veolia",
            "Veolia - RFC Analysis",
            "IDOC Interface Analysis - Inbound",
            "Interface Analysis - Outbound",
            "Custom Interfaces - Veloia",
          ],
          result: {},
          message: "File Not Executed Successfully",
          funcName: Status,
        });
      } else {
        return resolve({
          filename: "cd_abap_interface_insight.js",
          statusCode: 200,
          csvName: [
            "Interface Insights - Part 1",
            "Interface Insights - Part2",
            "Interface Insights - ODATA",
            "RFC_Veolia",
            "Veolia - RFC Analysis",
            "IDOC Interface Analysis - Inbound",
            "Interface Analysis - Outbound",
            "Custom Interfaces - Veloia",
          ],
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
              result: data.result,
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
        filename: "cd_abap_interface_insight.js",
        statusCode: 400,
        csvName: [
          "Interface Insights - Part 1",
          "Interface Insights - Part2",
          "Interface Insights - ODATA",
          "RFC_Veolia",
          "Veolia - RFC Analysis",
          "IDOC Interface Analysis - Inbound",
          "Interface Analysis - Outbound",
          "Custom Interfaces - Veloia",
        ],
        result: { e },
        message: "File Not Executed Successfully",
        funcName: "createMaster",
      });
    }
  });
};

/************************************** Define Each Activity below ***********************************************/

/**
 * @functions [CreateInterfaceKPICollection,
 * CreateInterfaceGraphCollection,
 * CreateInterfaceOdataGraphCollection,
 * CreateInterfaceRFCFunctionGraphCollection,
 * CreateInterfaceRFCModulesGraphCollection,
 * CreateInterfaceIdocInterfaceInboundGraphCollection,
 * CreateInterfaceIdocInterfaceOutboundGraphCollection,
 * CreateCustomIdocMessageCollection] takes the csv names and creates the collections in Database .
 *
 * @returns Returns status of the execution.
 */

// Interface KPI Collection
function CreateInterfaceKPICollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_kpis";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-01.csv")
        .then(async (JsonArray) => {
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_volumetric_analysis_interface_insight_kpis' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_volumetric_analysis_interface_insight_kpis';)
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
                screen: "Interface KPI Collection",
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
                screen: "Interface KPI Collection",
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
            screen: "Interface KPI Collection",
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
        screen: "Interface KPI Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

// Interface Graph Collection
function CreateInterfaceGraphCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-03-02.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_graphs";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-02.csv")
        .then(async (JsonArray) => {
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_volumetric_analysis_interface_insight_graphs' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_volumetric_analysis_interface_insight_graphs';)
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
                screen: "Interface Graph Collection",
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
                screen: "Interface Graph Collection",
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
            screen: "Interface Graph Collection",
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
        screen: "Interface Graph Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

// Odata Graph Collection
function CreateInterfaceOdataGraphCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-03-03.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_odata_graphs";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-03.csv")
        .then(async (JsonArray) => {
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            let result1 = await queryDao.dropCollection(activityModelName);
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
                screen: "Odata Graph Collection",
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
                screen: "Odata Graph Collection",
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
            screen: "Odata Graph Collection",
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
        screen: "Odata Graph Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

// RFC Connections Graph Collection
function CreateInterfaceRFCFunctionGraphCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-03-04.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_rfc_function_graphs";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-04.csv")
        .then(async (JsonArray) => {
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            let result1 = await queryDao.dropCollection(activityModelName);
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
                screen: "RFC Connections Graph Collection",
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
                screen: "RFC Connections Graph Collection",
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
            screen: "RFC Connections Graph Collection",
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
        screen: "RFC Connections Graph Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

// RFC Function Module Graph Collection
function CreateInterfaceRFCModulesGraphCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-03-05.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_rfc_function_modules_graphs";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-05.csv")
        .then(async (JsonArray) => {
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            let result1 = await queryDao.dropCollection(activityModelName);
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
                screen: "RFC Function Module Graph Collection",
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
                screen: "RFC Function Module Graph Collection",
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
            screen: "RFC Function Module Graph Collection",
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
        screen: "RFC Function Module Graph Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

//Idoc Interface Inbound Graph Collection
function CreateInterfaceIdocInterfaceInboundGraphCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-03-06.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_idoc_interface_inbound_graphs";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-06.csv")
        .then(async (JsonArray) => {
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            let result1 = await queryDao.dropCollection(activityModelName);
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
                screen: "Idoc Interface Inbound Graph Collection",
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
                screen: "Idoc Interface Inbound Graph Collection",
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
            screen: "Idoc Interface Inbound Graph Collection",
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
        screen: "Idoc Interface Inbound Graph Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

//Idoc Interface Outbound Graph Collection
function CreateInterfaceIdocInterfaceOutboundGraphCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-03-07.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_idoc_interface_outbound_graphs";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-07.csv") //IDOC Interface Analysis - Outbound
        .then(async (JsonArray) => {
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            let result1 = await queryDao.dropCollection(activityModelName);
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
                screen: "Idoc Interface Outbound Graph Collection",
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
                screen: "Idoc Interface Outbound Graph Collection",
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
            screen: "Idoc Interface Outbound Graph Collection",
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
        screen: "Idoc Interface Outbound Graph Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

//Custo Idoc Message Drilldown Collection
function CreateCustomIdocMessageCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "08-03-08.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_interface_insight_custom_message_drilldowns";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-03-08.csv")
        .then(async (JsonArray) => {
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            let result1 = await queryDao.dropCollection(activityModelName);
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
                screen: "Custo Idoc Message Drilldown Collection",
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
                screen: "Custo Idoc Message Drilldown Collection",
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
            screen: "Custo Idoc Message Drilldown Collection",
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
        screen: "Custo Idoc Message Drilldown Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

//Interface Insight
function CreateInterfaceInsight() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        //Creation of Model for collections
        const InterfaceKpiModel =
          "custom_dev_abap_volumetric_analysis_interface_insight_kpis";
        const InterfaceGraphModel =
          "custom_dev_abap_volumetric_analysis_interface_insight_graphs";
        const InterfaceOdataGraphModel =
          "custom_dev_abap_volumetric_analysis_interface_insight_odata_graphs";
        const InterfaceRFCFunctionGraphModel =
          "custom_dev_abap_volumetric_analysis_interface_insight_rfc_function_graphs";
        const InterfaceRFCModuleGraphModel =
          "custom_dev_abap_volumetric_analysis_interface_insight_rfc_function_modules_graphs";
        const InterfaceCustomIdocDrilldown =
          "custom_dev_abap_volumetric_analysis_interface_insight_custom_message_drilldowns";
        const InterfaceIdocInterfaceInboundGraphModel =
          "custom_dev_abap_volumetric_analysis_interface_insight_idoc_interface_inbound_graphs";
        const InterfaceIdocInterfaceOutboundGraphModel =
          "custom_dev_abap_volumetric_analysis_interface_insight_idoc_interface_outbound_graphs";

        const promiseArr = [];
        const InterfaceKPIModelName = Mongoose.models[InterfaceKpiModel]
          ? Mongoose.model(InterfaceKpiModel)
          : Mongoose.model(InterfaceKpiModel, mongooseSchema);
        const InterfaceGraphModelName = Mongoose.models[InterfaceGraphModel]
          ? Mongoose.model(InterfaceGraphModel)
          : Mongoose.model(InterfaceGraphModel, mongooseSchema);
        const InterfaceOdataGraphModelName = Mongoose.models[
          InterfaceOdataGraphModel
        ]
          ? Mongoose.model(InterfaceOdataGraphModel)
          : Mongoose.model(InterfaceOdataGraphModel, mongooseSchema);
        const InterfaceRFCFunctionGraphModelName = Mongoose.models[
          InterfaceRFCFunctionGraphModel
        ]
          ? Mongoose.model(InterfaceRFCFunctionGraphModel)
          : Mongoose.model(InterfaceRFCFunctionGraphModel, mongooseSchema);
        const InterfaceRFCModuleGraphModelName = Mongoose.models[
          InterfaceRFCModuleGraphModel
        ]
          ? Mongoose.model(InterfaceRFCModuleGraphModel)
          : Mongoose.model(InterfaceRFCModuleGraphModel, mongooseSchema);
        const InterfaceCustomIdocDrilldownModelName = Mongoose.models[
          InterfaceCustomIdocDrilldown
        ]
          ? Mongoose.model(InterfaceCustomIdocDrilldown)
          : Mongoose.model(InterfaceCustomIdocDrilldown, mongooseSchema);
        const InterfaceIdocInterfaceInboundGraphModelName = Mongoose.models[
          InterfaceIdocInterfaceInboundGraphModel
        ]
          ? Mongoose.model(InterfaceIdocInterfaceInboundGraphModel)
          : Mongoose.model(
              InterfaceIdocInterfaceInboundGraphModel,
              mongooseSchema
            );
        const InterfaceIdocInterfaceOutboundGraphModelName = Mongoose.models[
          InterfaceIdocInterfaceOutboundGraphModel
        ]
          ? Mongoose.model(InterfaceIdocInterfaceOutboundGraphModel)
          : Mongoose.model(
              InterfaceIdocInterfaceOutboundGraphModel,
              mongooseSchema
            );

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

        let chart_custom_idoc_message = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_file_interface = {
          label: [],
          value1: {
            label: "Bi:Directional",
            value: [],
          },
          value2: {
            label: "Data Upload",
            value: [],
          },
          value3: {
            label: "Data Download",
            value: [],
          },
          value_unit: "",
        };

        let chart_partner_type = {
          label: [],
          value1: {
            label: "Inbound Direction",
            value: [],
          },
          value2: {
            label: "Outbound Direction",
            value: [],
          },
          value_unit: "",
        };
        let chart_inbound_traffic = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_outbound_traffic = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_odata = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_rfc_function = {
          label: [],
          value1: {
            label: "Valid RFC Connection",
            value: [],
          },
          value2: {
            label: "System Failure",
            value: [],
          },
          value3: {
            label: "Communication Failure",
            value: [],
          },
          value_unit: "",
        };
        let chart_rfc_modules_graph = {
          label: [],
          value1: {
            label: "RFC - Outbound",
            type: "column",
            yAxis: 1,
            value: [],
          },
          value2: {
            label: "RFC - Inbound",
            type: "column",
            yAxis: 1,
            value: [],
          },
          value3: {
            label: "Inbound Usage",
            type: "line",
            yAxis: 1,
            value: [],
          },
          value4: {
            label: "Outbound Usage",
            type: "line",
            yAxis: 1,
            value: [],
          },
          value_unit: "",
        };
        let chart_idoc_interface_analysis = {
          label: [],
          value1: {
            label: "Inbound",
            value: [],
          },
          value2: {
            label: "Outbound",
            value: [],
          },
          value_unit: "",
        };
        let system_integration_graph = {
          label: [],
          value1: {
            label: "Inbound",
            value: [],
          },
          value2: {
            label: "Outbound",
            value: [],
          },
        };

        let panel_external_system_integrated = [];
        let panel_idoc_inbound_integrated = [];
        let panel_idoc_outbound_integrated = [];
        let panel_odata = [];
        let panel_rfc_function = [];
        let panel_rfc_module = [];
        let panel_custom_idoc_message = [];
        let panel_partner_wise = [];
        let panel_message_type = [];
        let panel_all_transactions = [];

        let kpi_1 = {
          external_system: {
            label: "External System Integrated",
            value: "0",
            info: "",
            color: "color-green",
          },
          active_rfc: {
            label: "No. of Active RFC Connections",
            value: "0",
            info: "",
            color: "color-blue",
          },
          idoc: {
            label: "Idoc Interfaces",
            value: "0",
            info: " ",
            color: "color-red",
          },
          custom_idoc: {
            label: "Custom IDOCs",
            value: "0",
            info: " ",
            color: "color-blue",
          },
          file: {
            label: "File Interfaces",
            value: "0",
            info: "",
            color: "color-red",
          },
        };

        //Interface Insight KPI
        let InterfaceKPIData = await InterfaceKPIModelName.aggregate([
          {
            $facet: {
              ExternalSystem: [
                { $match: { "External System Count": { $ne: "" } } },
                {
                  $group: {
                    _id: "$External System Count",
                  },
                },
                {
                  $project: {
                    External: "$_id",
                    _id: 0,
                  },
                },
              ],
              IdocInterfaceCount1: [
                {
                  $match: {
                    "Inbound Interfaces per sender partner": { $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$Inbound Interfaces per sender partner",
                  },
                },
                {
                  $project: {
                    IdocCount1: "$_id",
                    _id: 0,
                  },
                },
              ],
              IdocInterfaceCount2: [
                {
                  $match: {
                    "Outbound Interfaces per reciever partner": { $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$Outbound Interfaces per reciever partner",
                  },
                },
                {
                  $project: {
                    IdocCount2: "$_id",
                    _id: 0,
                  },
                },
              ],
              ActiveRFC: [
                { $match: { "No of active RFC connections": { $ne: "" } } },
                {
                  $group: {
                    _id: "$No of active RFC connections",
                  },
                },
                {
                  $project: {
                    active: "$_id",
                    _id: 0,
                  },
                },
              ],
              CustomIDOC: [
                { $match: { "Custom IDOC": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Custom IDOC",
                  },
                },
                {
                  $project: {
                    customidoc: "$_id",
                    _id: 0,
                  },
                },
              ],
              FileInterface: [
                { $match: { "File Interfaces": { $ne: "" } } },
                {
                  $group: {
                    _id: "$File Interfaces",
                  },
                },
                {
                  $project: {
                    file_interface: "$_id",
                    _id: 0,
                  },
                },
              ],
              ExternalSystemList: [
                { $match: { "External System Name": { $ne: "" } } },
                {
                  $group: {
                    _id: "$External System Name",
                    Description: { $first: "$Description" },
                  },
                },
                {
                  $project: {
                    Name: "$_id",
                    Description: 1,
                    _id: 0,
                  },
                },
              ],
              IdocInteraceList1: [
                {
                  $match: {
                    "Inbound Message Type and Description": { $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$Inbound Message Type and Description",
                    Value: { $first: "$No of Inbound Partners" },
                  },
                },
                {
                  $project: {
                    Name: "$_id",
                    Value: 1,
                    _id: 0,
                  },
                },
              ],
              IdocInteraceList2: [
                {
                  $match: {
                    "Outbound Message Type and Description": { $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$Outbound Message Type and Description",
                    Value: { $first: "$No of Outbound Partners" },
                  },
                },
                {
                  $project: {
                    Name: "$_id",
                    Value: 1,
                    _id: 0,
                  },
                },
              ],
              CustomIDOCGraph: [
                { $match: { "Module Name Custom IDOC": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Module Name Custom IDOC",
                    count_custom: { $first: "$Count Custom IDOC" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count_custom: 1,
                    _id: 0,
                  },
                },
              ],
              FileInterfaceGraph: [
                { $match: { "File Interface Module Name": { $ne: "" } } },
                {
                  $group: {
                    _id: "$File Interface Module Name",
                    BidirectionalCount: { $first: "$Bi:Directional" },
                    DataUploadCount: { $first: "$Data Upload" },
                    DataDownloadCount: { $first: "$Data Download" },
                  },
                },
                {
                  $project: {
                    Interface_Type: "$_id",
                    BidirectionalCount: 1,
                    DataUploadCount: 1,
                    DataDownloadCount: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        //KPI
        if (
          InterfaceKPIData[0].ExternalSystem &&
          InterfaceKPIData[0].ExternalSystem.length
        ) {
          kpi_1["external_system"]["value"] =
            InterfaceKPIData[0].ExternalSystem[0].External;
        }
        if (
          InterfaceKPIData[0].IdocInterfaceCount1 &&
          InterfaceKPIData[0].IdocInterfaceCount1.length
        ) {
          kpi_1["idoc"]["value"] =
            +InterfaceKPIData[0].IdocInterfaceCount1[0].IdocCount1 +
            +InterfaceKPIData[0].IdocInterfaceCount2[0].IdocCount2;
        }
        if (
          InterfaceKPIData[0].ActiveRFC &&
          InterfaceKPIData[0].ActiveRFC.length
        ) {
          kpi_1["active_rfc"]["value"] =
            InterfaceKPIData[0].ActiveRFC[0].active;
        }
        if (
          InterfaceKPIData[0].CustomIDOC &&
          InterfaceKPIData[0].CustomIDOC.length
        ) {
          kpi_1["custom_idoc"]["value"] =
            InterfaceKPIData[0].CustomIDOC[0].customidoc;
        }
        if (
          InterfaceKPIData[0].FileInterface &&
          InterfaceKPIData[0].FileInterface.length
        ) {
          kpi_1["file"]["value"] =
            InterfaceKPIData[0].FileInterface[0].file_interface;
        }

        //External System Integrated List
        for (let External of InterfaceKPIData[0].ExternalSystemList) {
          panel_external_system_integrated.push({
            label: External["Name"],
            value: External["Description"],
          });
        }

        panel_external_system_integrated.sort((a, b) => b.value - a.value);

        //Idoc Interfaces Inbound System Integrated List
        for (let Idoc of InterfaceKPIData[0].IdocInteraceList1) {
          panel_idoc_inbound_integrated.push({
            label: Idoc["Name"],
            value: Idoc["Value"],
          });
        }
        panel_idoc_inbound_integrated.sort((a, b) => b.value - a.value);

        //Idoc Interfaces Outbound System Integrated List
        for (let Idoc of InterfaceKPIData[0].IdocInteraceList2) {
          panel_idoc_outbound_integrated.push({
            label: Idoc["Name"],
            value: Idoc["Value"],
          });
        }
        panel_idoc_outbound_integrated.sort((a, b) => b.value - a.value);

        //Custom IDOC Message Types Graph
        for (let CustomGraph of InterfaceKPIData[0].CustomIDOCGraph) {
          chart_custom_idoc_message["label"].push(CustomGraph["module_name"]);
          chart_custom_idoc_message["value"].push(+CustomGraph["count_custom"]);
        }

        //File Interfaces Graph
        for (let FileData of InterfaceKPIData[0].FileInterfaceGraph) {
          chart_file_interface["label"].push(FileData["Interface_Type"]);
          chart_file_interface["value1"]["value"].push(
            +FileData["BidirectionalCount"]
          );
          chart_file_interface["value2"]["value"].push(
            +FileData["DataUploadCount"]
          );
          chart_file_interface["value3"]["value"].push(
            +FileData["DataDownloadCount"]
          );
        }

        //Interface Insight Graph
        let InterfaceGraphData = await InterfaceGraphModelName.aggregate([
          {
            $facet: {
              AllMonths: [
                { $match: { Months: { $ne: "" } } },
                {
                  $group: {
                    _id: "$Months",
                  },
                },
                {
                  $project: {
                    Month: "$_id",
                    _id: 0,
                  },
                },
              ],
              PartnerType: [
                { $match: { "Partner Type": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Partner Type",
                    InboundCount: { $first: "$Inbound Direction" },
                    OutboundCount: { $first: "$Outbound Direction" },
                  },
                },
                {
                  $project: {
                    Partner_Type: "$_id",
                    InboundCount: 1,
                    OutboundCount: 1,
                    _id: 0,
                  },
                },
              ],
              InboundIDOCGraph: [
                { $match: { "Inbound IDOC Traffic": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Inbound IDOC Traffic",
                    month1_val: { $first: "$imonth1" },
                    month2_val: { $first: "$imonth2" },
                    month3_val: { $first: "$imonth3" },
                    month4_val: { $first: "$imonth4" },
                    month5_val: { $first: "$imonth5" },
                    month6_val: { $first: "$imonth6" },
                    month7_val: { $first: "$imonth7" },
                    month8_val: { $first: "$imonth8" },
                    month9_val: { $first: "$imonth9" },
                    month10_val: { $first: "$imonth10" },
                    month11_val: { $first: "$imonth11" },
                    month12_val: { $first: "$imonth12" },
                  },
                },
                {
                  $project: {
                    Inbound_Type: "$_id",
                    month1_val: 1,
                    month2_val: 1,
                    month3_val: 1,
                    month4_val: 1,
                    month5_val: 1,
                    month6_val: 1,
                    month7_val: 1,
                    month8_val: 1,
                    month9_val: 1,
                    month10_val: 1,
                    month11_val: 1,
                    month12_val: 1,
                    _id: 0,
                  },
                },
              ],
              OutboundIDOCGraph: [
                { $match: { "Outbound IDOC Traffic": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Outbound IDOC Traffic",
                    month1_val: { $first: "$omonth1" },
                    month2_val: { $first: "$omonth2" },
                    month3_val: { $first: "$omonth3" },
                    month4_val: { $first: "$omonth4" },
                    month5_val: { $first: "$omonth5" },
                    month6_val: { $first: "$omonth6" },
                    month7_val: { $first: "$omonth7" },
                    month8_val: { $first: "$omonth8" },
                    month9_val: { $first: "$omonth9" },
                    month10_val: { $first: "$omonth10" },
                    month11_val: { $first: "$omonth11" },
                    month12_val: { $first: "$omonth12" },
                  },
                },
                {
                  $project: {
                    Outbound_Type: "$_id",
                    month1_val: 1,
                    month2_val: 1,
                    month3_val: 1,
                    month4_val: 1,
                    month5_val: 1,
                    month6_val: 1,
                    month7_val: 1,
                    month8_val: 1,
                    month9_val: 1,
                    month10_val: 1,
                    month11_val: 1,
                    month12_val: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        //Partner Types Graph
        for (let PartnerData of InterfaceGraphData[0].PartnerType) {
          chart_partner_type["label"].push(PartnerData["Partner_Type"]);
          chart_partner_type["value1"]["value"].push(
            +PartnerData["InboundCount"]
          );
          chart_partner_type["value2"]["value"].push(
            +PartnerData["OutboundCount"]
          );
        }

        for (let Monthwise of InterfaceGraphData[0].AllMonths) {
          allmonths.push(Monthwise["Month"]);
        }

        function sortDate(a, b) {
          console.log("ab", a, b);
          var m1 = a.substring(3, 5);
          var y1 = a.substring(6);
          var m2 = b.substring(3, 5);
          var y2 = b.substring(6);
          console.log(
            "m1 y1 m2 y2",
            "-------",
            m1,
            "...",
            y1,
            "...",
            m2,
            "...",
            y2
          );

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

        //Date Sorting code added by Saransh on 29 June 2023
        const sortableDates = allmonths.map((date) => {
          const [day, month, year] = date.split("-");
          return `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}`;
        });
        sortableDates.sort();

        allmonths = sortableDates.map((sortabledate) => {
          return `${sortabledate.substring(6)}-${sortabledate.substring(
            4,
            6
          )}-${sortabledate.substring(0, 4)}`;
        });

        //Inbound Graph Month
        for (let monthdata of allmonths) {
          chart_inbound_traffic["label"].push(monthdata);
          chart_outbound_traffic["label"].push(monthdata);
        }

        //Inbound Types Graph
        for (let Inbound of InterfaceGraphData[0].InboundIDOCGraph) {
          let value = [
            +Inbound["month1_val"],
            +Inbound["month2_val"],
            +Inbound["month3_val"],
            +Inbound["month4_val"],
            +Inbound["month5_val"],
            +Inbound["month6_val"],
            +Inbound["month7_val"],
            +Inbound["month8_val"],
            +Inbound["month9_val"],
            +Inbound["month10_val"],
            +Inbound["month11_val"],
            +Inbound["month12_val"],
          ];

          chart_inbound_traffic["value"].push({
            label: Inbound["Inbound_Type"],
            value: value,
          });
        }

        //Outbound Types Graph
        for (let OutboundData of InterfaceGraphData[0].OutboundIDOCGraph) {
          let value = [
            +OutboundData["month1_val"],
            +OutboundData["month2_val"],
            +OutboundData["month3_val"],
            +OutboundData["month4_val"],
            +OutboundData["month5_val"],
            +OutboundData["month6_val"],
            +OutboundData["month7_val"],
            +OutboundData["month8_val"],
            +OutboundData["month9_val"],
            +OutboundData["month10_val"],
            +OutboundData["month11_val"],
            +OutboundData["month12_val"],
          ];

          chart_outbound_traffic["value"].push({
            label: OutboundData["Outbound_Type"],
            value: value,
          });
        }

        //Interface Insight Odata Graph
        let InterfaceOdataGraphData =
          await InterfaceOdataGraphModelName.aggregate([
            {
              $facet: {
                ModuleWise: [
                  {
                    $match: {
                      $and: [
                        { Module: { $ne: "" } },
                        { "Gen Art Type": { $eq: "SRV" } },
                      ],
                    },
                  },
                  {
                    $group: {
                      _id: "$Module",
                      count: { $sum: 1 },
                    },
                  },
                ],
              },
            },
          ]);

        let InterfaceOdataKPIData = [];

        for (let OdataGraph of InterfaceOdataGraphData[0].ModuleWise) {
          chart_odata["label"].push(OdataGraph["_id"]);
          chart_odata["value"].push(+OdataGraph["count"]);

          InterfaceOdataKPIData = await InterfaceOdataGraphModelName.aggregate([
            {
              $facet: {
                ModelPanel: [
                  {
                    $match: {
                      $and: [
                        { Module: { $eq: OdataGraph["_id"] } },
                        { "Gen Art Type": { $eq: "SRV" } },
                      ],
                    },
                  },
                  {
                    $project: {
                      Project: 1,
                      Description: 1,
                      "Node id": 1,
                      "Entity Name": 1,
                      "ABAP Structure Type Name": 1,
                      "Technical Name": 1,
                      "Domain Model Plug-In": 1,
                      "Node Type": 1,
                      "Data Provider Class": 1,
                      "External Service Name": 1,
                      "Creating User ID": 1,
                      "Creation date": 1,
                      "Creation Time": 1,
                      "Program ID": 1,
                      "Object Type": 1,
                      "Object Name": 1,
                      "Gen Art Type": 1,
                      Package: 1,
                      _id: 0,
                    },
                  },
                ],
              },
            },
          ]);

          if (
            InterfaceOdataKPIData[0].ModelPanel &&
            InterfaceOdataKPIData[0].ModelPanel.length
          ) {
            InterfaceOdataKPIData[0].ModelPanel.map((item) => {
              panel_odata.push({
                label: OdataGraph["_id"],
                project: item["Project"],
                description: item["Description"],
                "Node id": item["Node id"],
                "Entity Name": item["Entity Name"],
                "ABAP Structure Type Name": item["ABAP Structure Type Name"],
                "Technical Name": item["Technical Name"],
                "Domain Model Plug-In": item["Domain Model Plug-In"],
                "Node Type": item["Node Type"],
                "Data Provider Class": item["Data Provider Class"],
                "External Service Name": item["External Service Name"],
                "Creating User ID": item["Creating User ID"],
                "Creation date": item["Creation date"],
                "Creation Time": item["Creation Time"],
                "Program ID": item["Program ID"],
                "Object Type": item["Object Type"],
                "Object Name": item["Object Name"],
                "Gen Art Type": item["Gen Art Type"],
                Package: item["Package"],
              });
            });
          }
        }

        //Interface Insight RFC Function Graph
        let InterfaceRFCGraphData =
          await InterfaceRFCFunctionGraphModelName.aggregate([
            {
              $facet: {
                Types: [
                  { $match: { "RFC Type Description": { $ne: "" } } },
                  {
                    $group: {
                      _id: "$RFC Type Description",
                    },
                  },
                  {
                    $project: {
                      Type: "$_id",
                      _id: 0,
                    },
                  },
                ],
              },
            },
          ]);
        let InterfaceRFCGraphKPIData = [];
        for (let RFCData of InterfaceRFCGraphData[0].Types) {
          InterfaceRFCGraphKPIData =
            await InterfaceRFCFunctionGraphModelName.aggregate([
              {
                $facet: {
                  ValidRFC: [
                    {
                      $match: {
                        "RFC Type Description": { $eq: RFCData["Type"] },
                      },
                    },
                    {
                      $match: {
                        "RFC Remarks": { $eq: "Valid RFC Connection" },
                      },
                    },
                    {
                      $group: {
                        _id: "$RFC Type Description",
                        count: { $sum: 1 },
                      },
                    },
                    {
                      $project: {
                        Type: "$_id",
                        validcount: "$count",
                        _id: 0,
                      },
                    },
                  ],
                  SystemFailure: [
                    {
                      $match: {
                        "RFC Type Description": { $eq: RFCData["Type"] },
                      },
                    },
                    { $match: { "RFC Remarks": { $eq: "System Failure" } } },
                    {
                      $group: {
                        _id: "$RFC Type Description",
                        count: { $sum: 1 },
                      },
                    },
                    {
                      $project: {
                        Type: "$_id",
                        systemcount: "$count",
                        _id: 0,
                      },
                    },
                  ],
                  CommunicationFailure: [
                    {
                      $match: {
                        "RFC Type Description": { $eq: RFCData["Type"] },
                      },
                    },
                    {
                      $match: {
                        "RFC Remarks": { $eq: "Communication Failure" },
                      },
                    },
                    {
                      $group: {
                        _id: "$RFC Type Description",
                        count: { $sum: 1 },
                      },
                    },
                    {
                      $project: {
                        Type: "$_id",
                        communicationcount: "$count",
                        _id: 0,
                      },
                    },
                  ],
                  ValidRFCList: [
                    {
                      $match: {
                        "RFC Type Description": { $eq: RFCData["Type"] },
                      },
                    },
                    {
                      $match: {
                        "RFC Remarks": { $eq: "Valid RFC Connection" },
                      },
                    },

                    {
                      $project: {
                        "RFC Destination": 1,
                        "RFC Description": 1,
                        "RFC Type": 1,
                        "RFC Type Description": 1,
                        "Host or IP Address": 1,
                        "Gateway Host": 1,
                        "Gateway Service": 1,
                        "System Number": 1,
                        "RFC Client": 1,
                        "RFC Username": 1,
                        "RFC Logon Language": 1,
                        "Trusted/Non-Trusted RFC": 1,
                        "Unicode/ Non-Unicode": 1,
                        "Load Balance": 1,
                        "RFC Remarks": 1,
                        _id: 0,
                      },
                    },
                  ],
                  SystemFailureList: [
                    {
                      $match: {
                        "RFC Type Description": { $eq: RFCData["Type"] },
                      },
                    },
                    { $match: { "RFC Remarks": { $eq: "System Failure" } } },

                    {
                      $project: {
                        "RFC Destination": 1,
                        "RFC Description": 1,
                        "RFC Type": 1,
                        "RFC Type Description": 1,
                        "Host or IP Address": 1,
                        "Gateway Host": 1,
                        "Gateway Service": 1,
                        "System Number": 1,
                        "RFC Client": 1,
                        "RFC Username": 1,
                        "RFC Logon Language": 1,
                        "Trusted/Non-Trusted RFC": 1,
                        "Unicode/ Non-Unicode": 1,
                        "Load Balance": 1,
                        "RFC Remarks": 1,
                        _id: 0,
                      },
                    },
                  ],
                  CommunicationFailureList: [
                    {
                      $match: {
                        "RFC Type Description": { $eq: RFCData["Type"] },
                      },
                    },
                    {
                      $match: {
                        "RFC Remarks": { $eq: "Communication Failure" },
                      },
                    },

                    {
                      $project: {
                        "RFC Destination": 1,
                        "RFC Description": 1,
                        "RFC Type": 1,
                        "RFC Type Description": 1,
                        "Host or IP Address": 1,
                        "Gateway Host": 1,
                        "Gateway Service": 1,
                        "System Number": 1,
                        "RFC Client": 1,
                        "RFC Username": 1,
                        "RFC Logon Language": 1,
                        "Trusted/Non-Trusted RFC": 1,
                        "Unicode/ Non-Unicode": 1,
                        "Load Balance": 1,
                        "RFC Remarks": 1,
                        _id: 0,
                      },
                    },
                  ],
                },
              },
            ]);
          chart_rfc_function["label"].push(RFCData["Type"]);

          //Valid RFC
          if (
            InterfaceRFCGraphKPIData[0].ValidRFC &&
            InterfaceRFCGraphKPIData[0].ValidRFC.length
          ) {
            InterfaceRFCGraphKPIData[0].ValidRFC.map((item) => {
              chart_rfc_function["value1"]["value"].push(+item.validcount);
            });
          } else {
            chart_rfc_function["value1"]["value"].push(0);
          }

          //System Failure RFC
          if (
            InterfaceRFCGraphKPIData[0].SystemFailure &&
            InterfaceRFCGraphKPIData[0].SystemFailure.length
          ) {
            InterfaceRFCGraphKPIData[0].SystemFailure.map((item) => {
              chart_rfc_function["value2"]["value"].push(+item.systemcount);
            });
          } else {
            chart_rfc_function["value2"]["value"].push(0);
          }

          //Communication Failure RFC
          if (
            InterfaceRFCGraphKPIData[0].CommunicationFailure &&
            InterfaceRFCGraphKPIData[0].CommunicationFailure.length
          ) {
            InterfaceRFCGraphKPIData[0].CommunicationFailure.map((item) => {
              chart_rfc_function["value3"]["value"].push(
                +item.communicationcount
              );
            });
          } else {
            chart_rfc_function["value3"]["value"].push(0);
          }

          //Valid RFC List
          if (
            InterfaceRFCGraphKPIData[0].ValidRFCList &&
            InterfaceRFCGraphKPIData[0].ValidRFCList.length
          ) {
            InterfaceRFCGraphKPIData[0].ValidRFCList.map((item) => {
              panel_rfc_function.push({
                "RFC Destination": item["RFC Destination"],
                "RFC Description": item["RFC Description"],
                "RFC Type": item["RFC Type"],
                "RFC Type Description":
                  "Valid RFC Connection" + " - " + item["RFC Type Description"],
                "Host or IP Address": item["Host or IP Address"],
                "Gateway Host": item["Gateway Host"],
                "Gateway Service": item["Gateway Service"],
                "System Number": item["System Number"],
                "RFC Client": item["RFC Client"],
                "RFC Username": item["RFC Username"],
                "RFC Logon Language": item["RFC Logon Language"],
                "Trusted/Non-Trusted RFC": item["Trusted/Non-Trusted RFC"],
                "Unicode/ Non-Unicode": item["Unicode/ Non-Unicode"],
                "Load Balance": item["Load Balance"],
                "RFC Remarks": item["RFC Remarks"],
              });
            });
          }

          //System Failure List
          if (
            InterfaceRFCGraphKPIData[0].SystemFailureList &&
            InterfaceRFCGraphKPIData[0].SystemFailureList.length
          ) {
            InterfaceRFCGraphKPIData[0].SystemFailureList.map((item) => {
              panel_rfc_function.push({
                "RFC Destination": item["RFC Destination"],
                "RFC Description": item["RFC Description"],
                "RFC Type": item["RFC Type"],
                "RFC Type Description":
                  "System Failure" + " - " + item["RFC Type Description"],
                "Host or IP Address": item["Host or IP Address"],
                "Gateway Host": item["Gateway Host"],
                "Gateway Service": item["Gateway Service"],
                "System Number": item["System Number"],
                "RFC Client": item["RFC Client"],
                "RFC Username": item["RFC Username"],
                "RFC Logon Language": item["RFC Logon Language"],
                "Trusted/Non-Trusted RFC": item["Trusted/Non-Trusted RFC"],
                "Unicode/ Non-Unicode": item["Unicode/ Non-Unicode"],
                "Load Balance": item["Load Balance"],
                "RFC Remarks": item["RFC Remarks"],
              });
            });
          }

          //Communication Failure List
          if (
            InterfaceRFCGraphKPIData[0].CommunicationFailureList &&
            InterfaceRFCGraphKPIData[0].CommunicationFailureList.length
          ) {
            InterfaceRFCGraphKPIData[0].CommunicationFailureList.map((item) => {
              panel_rfc_function.push({
                "RFC Destination": item["RFC Destination"],
                "RFC Description": item["RFC Description"],
                "RFC Type": item["RFC Type"],
                "RFC Type Description":
                  "Communication Failure" +
                  " - " +
                  item["RFC Type Description"],
                "Host or IP Address": item["Host or IP Address"],
                "Gateway Host": item["Gateway Host"],
                "Gateway Service": item["Gateway Service"],
                "System Number": item["System Number"],
                "RFC Client": item["RFC Client"],
                "RFC Username": item["RFC Username"],
                "RFC Logon Language": item["RFC Logon Language"],
                "Trusted/Non-Trusted RFC": item["Trusted/Non-Trusted RFC"],
                "Unicode/ Non-Unicode": item["Unicode/ Non-Unicode"],
                "Load Balance": item["Load Balance"],
                "RFC Remarks": item["RFC Remarks"],
              });
            });
          }
        }

        //Interface Insight RFC MOdules Graph
        let InterfaceRFCModuleGraphData =
          await InterfaceRFCModuleGraphModelName.aggregate([
            {
              $facet: {
                BarData: [
                  { $match: { "FM module": { $ne: "" } } },
                  {
                    $group: {
                      _id: "$FM module",
                      //count: {$sum : 1 }
                    },
                  },
                  {
                    $project: {
                      Type: "$_id",
                      _id: 0,
                    },
                  },
                ],
                LineData: [
                  { $match: { "Prog Module": { $ne: "" } } },
                  {
                    $group: {
                      _id: "$Prog Module",
                      //count: {$sum : 1 }
                    },
                  },
                  {
                    $project: {
                      Type: "$_id",
                      _id: 0,
                    },
                  },
                ],
              },
            },
          ]);

        let InterfaceRFCModuleGraphKPIData = [];
        for (let RFCModuleData of InterfaceRFCModuleGraphData[0].BarData) {
          InterfaceRFCModuleGraphKPIData =
            await InterfaceRFCModuleGraphModelName.aggregate([
              {
                $facet: {
                  OutboundBarGraph: [
                    { $match: { "FM module": { $eq: RFCModuleData["Type"] } } },
                    { $match: { category: { $eq: "OUTBOUND" } } },
                    {
                      $group: {
                        _id: "$FM module",
                        count: { $sum: 1 },
                      },
                    },
                    {
                      $project: {
                        Type: "$_id",
                        count: "$count",
                        _id: 0,
                      },
                    },
                  ],
                  InboundBarGraph: [
                    { $match: { "FM module": { $eq: RFCModuleData["Type"] } } },
                    { $match: { category: { $eq: "Inbound" } } },
                    {
                      $group: {
                        _id: "$FM module",
                        count: { $sum: 1 },
                      },
                    },
                    {
                      $project: {
                        Type: "$_id",
                        count: "$count",
                        _id: 0,
                      },
                    },
                  ],
                  OutboundLineGraph: [
                    {
                      $match: { "Prog Module": { $eq: RFCModuleData["Type"] } },
                    },
                    { $match: { category: { $eq: "OUTBOUND" } } },
                    {
                      $group: {
                        _id: "$Prog Module",
                        count: { $sum: 1 },
                      },
                    },
                    {
                      $project: {
                        Type: "$_id",
                        count: "$count",
                        _id: 0,
                      },
                    },
                  ],
                  InboundLineGraph: [
                    {
                      $match: { "Prog Module": { $eq: RFCModuleData["Type"] } },
                    },
                    { $match: { category: { $eq: "Inbound" } } },
                    {
                      $group: {
                        _id: "$Prog Module",
                        count: { $sum: 1 },
                      },
                    },
                    {
                      $project: {
                        Type: "$_id",
                        count: "$count",
                        _id: 0,
                      },
                    },
                  ],
                  OutboundList: [
                    { $match: { "FM module": { $eq: RFCModuleData["Type"] } } },
                    { $match: { category: { $eq: "OUTBOUND" } } },

                    {
                      $project: {
                        "FM Name": 1,
                        Package: 1,
                        "Short Text": 1,
                        "Short text 1": 1,
                        Char: 1,
                        "Funct grp": 1,
                        Appl: 1,
                        Program: 1,
                        type: 1,
                        name: 1,
                        _id: 0,
                      },
                    },
                  ],
                  InboundList: [
                    { $match: { "FM module": { $eq: RFCModuleData["Type"] } } },
                    { $match: { category: { $eq: "Inbound" } } },

                    {
                      $project: {
                        "FM Name": 1,
                        Package: 1,
                        "Short Text": 1,
                        "Short text 1": 1,
                        Char: 1,
                        "Funct grp": 1,
                        Appl: 1,
                        Program: 1,
                        type: 1,
                        name: 1,
                        _id: 0,
                      },
                    },
                  ],
                },
              },
            ]);

          //OutboundBarGraph
          if (
            InterfaceRFCModuleGraphKPIData[0].OutboundBarGraph &&
            InterfaceRFCModuleGraphKPIData[0].OutboundBarGraph.length
          ) {
            InterfaceRFCModuleGraphKPIData[0].OutboundBarGraph.map((item) => {
              chart_rfc_modules_graph["value1"]["value"].push(+item.count);
            });
          } else {
            chart_rfc_modules_graph["value1"]["value"].push(0);
          }

          //InboundBarGraph
          if (
            InterfaceRFCModuleGraphKPIData[0].InboundBarGraph &&
            InterfaceRFCModuleGraphKPIData[0].InboundBarGraph.length
          ) {
            InterfaceRFCModuleGraphKPIData[0].InboundBarGraph.map((item) => {
              chart_rfc_modules_graph["value2"]["value"].push(+item.count);
            });
          } else {
            chart_rfc_modules_graph["value2"]["value"].push(0);
          }

          //InboundLineGraph
          if (
            InterfaceRFCModuleGraphKPIData[0].InboundLineGraph &&
            InterfaceRFCModuleGraphKPIData[0].InboundLineGraph.length
          ) {
            InterfaceRFCModuleGraphKPIData[0].InboundLineGraph.map((item) => {
              chart_rfc_modules_graph["value3"]["value"].push(+item.count);
            });
          } else {
            chart_rfc_modules_graph["value3"]["value"].push(0);
          }

          //OutboundLineGraph
          if (
            InterfaceRFCModuleGraphKPIData[0].OutboundLineGraph &&
            InterfaceRFCModuleGraphKPIData[0].OutboundLineGraph.length
          ) {
            InterfaceRFCModuleGraphKPIData[0].OutboundLineGraph.map((item) => {
              chart_rfc_modules_graph["value4"]["value"].push(+item.count);
            });
          } else {
            chart_rfc_modules_graph["value4"]["value"].push(0);
          }

          //Outbound List
          if (
            InterfaceRFCModuleGraphKPIData[0].OutboundList &&
            InterfaceRFCModuleGraphKPIData[0].OutboundList.length
          ) {
            InterfaceRFCModuleGraphKPIData[0].OutboundList.map((item) => {
              panel_rfc_module.push({
                Module: RFCModuleData["Type"],
                "RFC FM Name": item["FM Name"],
                "Development Class or Package": item["Package"],
                "Development Class or Package Des": item["Short Text"],
                "RFC Description": item["Short text 1"],
                "FM Include": item["Char"],
                "Function Group Name": item["Funct grp"],
                Application: item["Appl"],
                "Used In Object": item["Program"],
                "Object Type": item["type"],
                "RFC Destination": item["name"],
                "RFC Dest Des": "X",
              });
            });
          }

          //InboundList
          if (
            InterfaceRFCModuleGraphKPIData[0].InboundList &&
            InterfaceRFCModuleGraphKPIData[0].InboundList.length
          ) {
            InterfaceRFCModuleGraphKPIData[0].InboundList.map((item) => {
              panel_rfc_module.push({
                Module: RFCModuleData["Type"],
                "RFC FM Name": item["FM Name"],
                "Development Class or Package": item["Package"],
                "Development Class or Package Des": item["Short Text"],
                "RFC Description": item["Short text 1"],
                "FM Include": item["Char"],
                "Function Group Name": item["Funct grp"],
                Application: item["Appl"],
                "Used In Object": item["Program"],
                "Object Type": item["type"],
                "RFC Destination": item["name"],
                "RFC Dest Des": "X",
              });
            });
          }
        }

        //Idoc Interface Inbound Graph
        let IdocInterfaceInboundGraphData =
          await InterfaceIdocInterfaceInboundGraphModelName.aggregate([
            {
              $facet: {
                InboundTypes: [
                  { $match: { "Partner Type Description": { $ne: "" } } },
                  {
                    $group: {
                      _id: "$Partner Type Description",
                    },
                  },
                ],

                InboundBank: [
                  { $match: { "Partner Type Description": { $eq: "Bank" } } },
                  {
                    $group: {
                      _id: "$Partner Type Description",
                      count: { $sum: 1 },
                    },
                  },
                ],
                InboundCustomer: [
                  {
                    $match: { "Partner Type Description": { $eq: "Customer" } },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                InboundVendor: [
                  { $match: { "Partner Type Description": { $eq: "Vendor" } } },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                InboundBenefitsProvider: [
                  {
                    $match: {
                      "Partner Type Description": { $eq: "Benefits provider" },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                InboundBusinessPartner: [
                  {
                    $match: {
                      "Partner Type Description": { $eq: "Business Partner" },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                InboundLogical: [
                  {
                    $match: {
                      "Partner Type Description": { $eq: "Logical system" },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
              },
            },
          ]);

        //Idoc Interface Inbound Graph
        if (
          IdocInterfaceInboundGraphData[0].InboundBank &&
          IdocInterfaceInboundGraphData[0].InboundBank.length
        ) {
          chart_idoc_interface_analysis["label"].push("Bank");
          chart_idoc_interface_analysis["value1"]["value"].push(
            +IdocInterfaceInboundGraphData[0].InboundBank[0]["count"]
          );
        }
        if (
          IdocInterfaceInboundGraphData[0].InboundCustomer &&
          IdocInterfaceInboundGraphData[0].InboundCustomer.length
        ) {
          chart_idoc_interface_analysis["label"].push("Customer");
          chart_idoc_interface_analysis["value1"]["value"].push(
            +IdocInterfaceInboundGraphData[0].InboundCustomer[0]["count"]
          );
        } else {
          chart_idoc_interface_analysis["label"].push("Customer");
          chart_idoc_interface_analysis["value1"]["value"].push(0);
        }
        if (
          IdocInterfaceInboundGraphData[0].InboundVendor &&
          IdocInterfaceInboundGraphData[0].InboundVendor.length
        ) {
          chart_idoc_interface_analysis["label"].push("Vendor");
          chart_idoc_interface_analysis["value1"]["value"].push(
            +IdocInterfaceInboundGraphData[0].InboundVendor[0]["count"]
          );
        }
        if (
          IdocInterfaceInboundGraphData[0].InboundBenefitsProvider &&
          IdocInterfaceInboundGraphData[0].InboundBenefitsProvider.length
        ) {
          chart_idoc_interface_analysis["label"].push("Benefits");
          chart_idoc_interface_analysis["value1"]["value"].push(
            +IdocInterfaceInboundGraphData[0].InboundBenefitsProvider[0][
              "count"
            ]
          );
        }
        if (
          IdocInterfaceInboundGraphData[0].InboundBusinessPartner &&
          IdocInterfaceInboundGraphData[0].InboundBusinessPartner.length
        ) {
          chart_idoc_interface_analysis["label"].push("Business Partner");
          chart_idoc_interface_analysis["value1"]["value"].push(
            +IdocInterfaceInboundGraphData[0].InboundBusinessPartner[0]["count"]
          );
        }
        if (
          IdocInterfaceInboundGraphData[0].InboundLogical &&
          IdocInterfaceInboundGraphData[0].InboundLogical.length
        ) {
          chart_idoc_interface_analysis["label"].push("Logical System");
          chart_idoc_interface_analysis["value1"]["value"].push(
            +IdocInterfaceInboundGraphData[0].InboundLogical[0]["count"]
          );
        }
        //Idoc Interface Inbound Panels
        let IdocInterfaceInboundPanelData = [];
        for (let InboundData of IdocInterfaceInboundGraphData[0].InboundTypes) {
          IdocInterfaceInboundPanelData =
            await InterfaceIdocInterfaceInboundGraphModelName.aggregate([
              {
                $facet: {
                  AllTransactionPanel: [
                    {
                      $match: {
                        "Partner Type Description": { $eq: InboundData["_id"] },
                      },
                    },
                    {
                      $group: {
                        _id: {
                          Number: "$Partner number",
                          Message: "$Message type",
                        },
                        PartnerNumber: { $first: "$Partner number" },
                        PartnerNumberDes: {
                          $first: "$Partner Type Description",
                        },
                        MessageType: { $first: "$Message type" },
                        MessageTypeText: { $first: "$Message type text" },
                      },
                    },
                  ],
                  PartnerwisePanel: [
                    {
                      $match: {
                        "Partner Type Description": { $eq: InboundData["_id"] },
                      },
                    },
                    {
                      $group: {
                        _id: {
                          Number: "$Partner number",
                          Partner: "$Partner Type Description",
                        },
                        PartnerNumber: { $first: "$Partner number" },
                        PartnerNumberDes: {
                          $first: "$Partner Type Description",
                        },
                      },
                    },
                  ],
                  MessagePanel: [
                    {
                      $match: {
                        "Partner Type Description": { $eq: InboundData["_id"] },
                      },
                    },
                    {
                      $group: {
                        _id: {
                          Message: "$Message type",
                          MessageTypeText: "$Message type text",
                        },
                        PartnerNumberDes: {
                          $first: "$Partner Type Description",
                        },
                        MessageType: { $first: "$Message type" },
                        MessageTypeText: { $first: "$Message type text" },
                      },
                    },
                  ],
                },
              },
            ]);

          //AllTransaction Panel
          if (
            IdocInterfaceInboundPanelData[0].AllTransactionPanel &&
            IdocInterfaceInboundPanelData[0].AllTransactionPanel.length
          ) {
            IdocInterfaceInboundPanelData[0].AllTransactionPanel.map((item) => {
              panel_all_transactions.push({
                label: "Inbound" + " - " + item["PartnerNumberDes"],
                "Partner number": item["PartnerNumber"],
                "Partner Type Description": item["PartnerNumberDes"],
                "Message type": item["MessageType"],
                Port: "X",
                RFC: "X",
              });
            });
          }

          //Partnerwise Panel
          if (
            IdocInterfaceInboundPanelData[0].PartnerwisePanel &&
            IdocInterfaceInboundPanelData[0].PartnerwisePanel.length
          ) {
            IdocInterfaceInboundPanelData[0].PartnerwisePanel.map((item) => {
              panel_partner_wise.push({
                label: "Inbound" + " - " + item["PartnerNumberDes"],
                "Partner number": item["PartnerNumber"],
                "Partner Type Description": item["PartnerNumberDes"],
              });
            });
          }

          //MEssage Panel
          if (
            IdocInterfaceInboundPanelData[0].MessagePanel &&
            IdocInterfaceInboundPanelData[0].MessagePanel.length
          ) {
            IdocInterfaceInboundPanelData[0].MessagePanel.map((item) => {
              panel_message_type.push({
                label: "Inbound" + " - " + item["PartnerNumberDes"],
                "Message type": item["MessageType"],
                "Message type text": item["MessageTypeText"],
                "Basic Type": "X",
              });
            });
          }
        }

        //Idoc Interface Outbound Graph
        let IdocInterfaceOutboundGraphData =
          await InterfaceIdocInterfaceOutboundGraphModelName.aggregate([
            {
              $facet: {
                OutboundTypes: [
                  { $match: { "Partner Type Description": { $ne: "" } } },
                  {
                    $group: {
                      _id: "$Partner Type Description",
                      //count: {$sum : 1 }
                    },
                  },
                ],
                OutboundBank: [
                  { $match: { "Partner Type Description": { $eq: "Bank" } } },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message Type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                OutboundCustomer: [
                  {
                    $match: { "Partner Type Description": { $eq: "Customer" } },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message Type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                OutboundVendor: [
                  { $match: { "Partner Type Description": { $eq: "Vendor" } } },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message Type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                OutboundBenefitsProvider: [
                  {
                    $match: {
                      "Partner Type Description": { $eq: "Benefits provider" },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message Type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                OutboundBusinessPartner: [
                  {
                    $match: {
                      "Partner Type Description": { $eq: "Business Partner" },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message Type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
                OutboundLogical: [
                  {
                    $match: {
                      "Partner Type Description": { $eq: "Logical system" },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        Number: "$Partner number",
                        Message: "$Message Type",
                      },
                    },
                  },
                  {
                    $group: {
                      _id: 1,
                      count: { $sum: 1 },
                    },
                  },
                ],
              },
            },
          ]);
        console.log(
          "IdocInterfaceOutboundGraphData",
          IdocInterfaceOutboundGraphData[0].OutboundTypes
        );

        //Idoc Interface Outbound Graph
        if (
          IdocInterfaceOutboundGraphData[0].OutboundBank &&
          IdocInterfaceOutboundGraphData[0].OutboundBank.length
        ) {
          chart_idoc_interface_analysis["value2"]["value"].push(
            +IdocInterfaceOutboundGraphData[0].OutboundBank[0]["count"]
          );
        }
        if (
          IdocInterfaceOutboundGraphData[0].OutboundCustomer &&
          IdocInterfaceOutboundGraphData[0].OutboundCustomer.length
        ) {
          chart_idoc_interface_analysis["value2"]["value"].push(
            +IdocInterfaceOutboundGraphData[0].OutboundCustomer[0]["count"]
          );
        }
        if (
          IdocInterfaceOutboundGraphData[0].OutboundVendor &&
          IdocInterfaceOutboundGraphData[0].OutboundVendor.length
        ) {
          chart_idoc_interface_analysis["value2"]["value"].push(
            +IdocInterfaceOutboundGraphData[0].OutboundVendor[0]["count"]
          );
        }
        if (
          IdocInterfaceOutboundGraphData[0].OutboundBenefitsProvider &&
          IdocInterfaceOutboundGraphData[0].OutboundBenefitsProvider.length
        ) {
          chart_idoc_interface_analysis["value2"]["value"].push(
            +IdocInterfaceOutboundGraphData[0].OutboundBenefitsProvider[0][
              "count"
            ]
          );
        }
        if (
          IdocInterfaceOutboundGraphData[0].OutboundBusinessPartner &&
          IdocInterfaceOutboundGraphData[0].OutboundBusinessPartner.length
        ) {
          chart_idoc_interface_analysis["value2"]["value"].push(
            +IdocInterfaceOutboundGraphData[0].OutboundBusinessPartner[0][
              "count"
            ]
          );
        }
        if (
          IdocInterfaceOutboundGraphData[0].OutboundLogical &&
          IdocInterfaceOutboundGraphData[0].OutboundLogical.length
        ) {
          chart_idoc_interface_analysis["value2"]["value"].push(
            +IdocInterfaceOutboundGraphData[0].OutboundLogical[0]["count"]
          );
        }

        //Idoc Interface Outbound Panels
        let IdocInterfaceOutboundPanelData = [];
        for (let OutboundData of IdocInterfaceOutboundGraphData[0]
          .OutboundTypes) {
          IdocInterfaceOutboundPanelData =
            await InterfaceIdocInterfaceOutboundGraphModelName.aggregate([
              {
                $facet: {
                  AllTransactionPanel: [
                    {
                      $match: {
                        "Partner Type Description": {
                          $eq: OutboundData["_id"],
                        },
                      },
                    },
                    {
                      $group: {
                        _id: {
                          Number: "$Partner number",
                          Message: "$Message Type",
                        },
                        PartnerNumber: { $first: "$Partner number" },
                        PartnerNumberDes: {
                          $first: "$Partner Type Description",
                        },
                        MessageType: { $first: "$Message Type" },
                        MessageTypeText: { $first: "$Message Description" },
                        BasicType: { $first: "$Basic type" },
                        ReceiverPort: { $first: "$Receiver port" },
                        RFCDestination: { $first: "$Rfc Destination" },
                        //"count": { "$sum": 1 }
                      },
                    },
                  ],

                  PartnerwisePanel: [
                    {
                      $match: {
                        "Partner Type Description": {
                          $eq: OutboundData["_id"],
                        },
                      },
                    },
                    {
                      $group: {
                        _id: {
                          Number: "$Partner number",
                          Message: "$Partner Type Description",
                        },
                        PartnerNumber: { $first: "$Partner number" },
                        PartnerNumberDes: {
                          $first: "$Partner Type Description",
                        },
                      },
                    },
                  ],

                  MessagePanel: [
                    {
                      $match: {
                        "Partner Type Description": {
                          $eq: OutboundData["_id"],
                        },
                      },
                    },
                    {
                      $group: {
                        _id: {
                          Message: "$Message Type",
                          MessageTypeText: "$Message Description",
                        },
                        PartnerNumberDes: {
                          $first: "$Partner Type Description",
                        },
                        MessageType: { $first: "$Message Type" },
                        MessageTypeText: { $first: "$Message Description" },
                        BasicType: { $first: "$Basic type" },
                      },
                    },
                  ],
                },
              },
            ]);

          //AllTransaction Panel
          if (
            IdocInterfaceOutboundPanelData[0].AllTransactionPanel &&
            IdocInterfaceOutboundPanelData[0].AllTransactionPanel.length
          ) {
            IdocInterfaceOutboundPanelData[0].AllTransactionPanel.map(
              (item) => {
                panel_all_transactions.push({
                  label: "Outbound" + " - " + item["PartnerNumberDes"],
                  "Partner number": item["PartnerNumber"],
                  "Partner Type Description": item["PartnerNumberDes"],
                  "Message type": item["MessageType"],
                  Port: item["ReceiverPort"],
                  RFC: item["RFCDestination"],
                });
              }
            );
          }

          //Partnerwise Panel
          if (
            IdocInterfaceOutboundPanelData[0].PartnerwisePanel &&
            IdocInterfaceOutboundPanelData[0].PartnerwisePanel.length
          ) {
            IdocInterfaceOutboundPanelData[0].PartnerwisePanel.map((item) => {
              panel_partner_wise.push({
                label: "Outbound" + " - " + item["PartnerNumberDes"],
                "Partner number": item["PartnerNumber"],
                "Partner Type Description": item["PartnerNumberDes"],
              });
            });
          }

          //Message Panel
          if (
            IdocInterfaceOutboundPanelData[0].MessagePanel &&
            IdocInterfaceOutboundPanelData[0].MessagePanel.length
          ) {
            IdocInterfaceOutboundPanelData[0].MessagePanel.map((item) => {
              panel_message_type.push({
                label: "Outbound" + " - " + item["PartnerNumberDes"],
                "Message type": item["MessageType"],
                "Message type text": item["MessageTypeText"],
                "Basic Type": item["BasicType"],
              });
            });
          }
        }

        //Interface Custom Idoc Drilldown
        let InterfaceCustomIdocDrilldownData =
          await InterfaceCustomIdocDrilldownModelName.aggregate([
            {
              $facet: {
                Drilldown: [
                  { $match: { Module: { $ne: "" } } },
                  {
                    $group: {
                      _id: "$Module",
                    },
                  },
                ],
              },
            },
          ]);

        //Custom Idoc Messgae Panels
        let IdocMessagePanel = [];
        for (let data of InterfaceCustomIdocDrilldownData[0].Drilldown) {
          IdocMessagePanel =
            await InterfaceCustomIdocDrilldownModelName.aggregate([
              {
                $facet: {
                  PanelValue: [
                    { $match: { Module: { $eq: data["_id"] } } },
                    {
                      $project: {
                        Type: data["_id"],
                        "Object Name": 1,
                        "Development Class or Package": 1,
                        "Development Class or Package Description": 1,
                        Author: 1,
                        "Description of The Object": 1,
                        "Message Type": 1,
                        "Short Description of Object": 1,
                        _id: 0,
                      },
                    },
                  ],
                },
              },
            ]);

          //Custom Idoc Panel
          if (
            IdocMessagePanel[0].PanelValue &&
            IdocMessagePanel[0].PanelValue.length
          ) {
            IdocMessagePanel[0].PanelValue.map((item) => {
              panel_custom_idoc_message.push({
                label: item["Type"],
                ObjectName: item["Object Name"],
                DevelopmentClass: item["Development Class or Package"],
                DevelopmentClassDescription:
                  item["Development Class or Package Description"],
                Author: item["Author"],
                DescriptionObject: item["Description of The Object"],
                "Message Type": item["Message Type"],
                ShortDescription: item["Short Description of Object"],
              });
            });
          }
        }

        // System Integration
        let systemIntegration = await InterfaceKPIModelName.aggregate([
          {
            $match: {},
          },
          {
            $facet: {
              IdocNames: [
                {
                  $match: {
                    "External System Name": { $ne: "" },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    external: "$External System Name",
                    Description: "$Description",
                  },
                },
              ],
            },
          },
        ]);

        for (let idocnames of systemIntegration[0].IdocNames) {
          let systemIntegrationInbound =
            await InterfaceIdocInterfaceInboundGraphModelName.aggregate([
              {
                $match: {
                  "Partner number": { $eq: idocnames["external"] },
                },
              },
              {
                $facet: {
                  inbounds: [
                    {
                      $group: {
                        _id: "$Message type",
                      },
                    },
                    {
                      $group: {
                        _id: 1,
                        count: {
                          $sum: 1,
                        },
                      },
                    },
                  ],
                },
              },
            ]);

          let systemIntegrationOutbound =
            await InterfaceIdocInterfaceOutboundGraphModelName.aggregate([
              {
                $match: {
                  "Partner number": { $eq: idocnames["external"] },
                },
              },
              {
                $facet: {
                  outbounds: [
                    {
                      $group: {
                        _id: "$Message Type",
                      },
                    },
                    {
                      $group: {
                        _id: 1,
                        count: {
                          $sum: 1,
                        },
                      },
                    },
                  ],
                },
              },
            ]);
          system_integration_graph["label"].push(idocnames["Description"]);
          system_integration_graph["value1"]["value"].push(
            systemIntegrationInbound[0].inbounds[0] != undefined
              ? systemIntegrationInbound[0].inbounds[0].count
              : 0
          );
          system_integration_graph["value2"]["value"].push(
            systemIntegrationOutbound[0].outbounds[0] != undefined
              ? systemIntegrationOutbound[0].outbounds[0].count
              : 0
          );
        }

        payloadToUpdate = {
          cust_id: "001",
          industry: "cpg",
          lob: "custom_development",
          menu: "abap",
          tab: "interface_insight",
          document_id: "custom_development_abap_interface_insight",
          __v: 0,
          kpi_1: kpi_1,
          chart_partner_type: chart_partner_type,
          chart_custom_idoc_message: chart_custom_idoc_message,
          chart_inbound_traffic: chart_inbound_traffic,
          chart_outbound_traffic: chart_outbound_traffic,
          chart_file_interface: chart_file_interface,
          chart_odata: chart_odata,
          chart_rfc_function: chart_rfc_function,
          chart_rfc_modules_graph: chart_rfc_modules_graph,
          chart_idoc_interface_analysis: chart_idoc_interface_analysis,
          panel_external_system_integrated: panel_external_system_integrated,
          panel_idoc_inbound_integrated: panel_idoc_inbound_integrated,
          panel_idoc_outbound_integrated: panel_idoc_outbound_integrated,
          panel_odata: panel_odata,
          panel_rfc_function: panel_rfc_function,
          panel_rfc_module: panel_rfc_module,
          panel_custom_idoc_message: panel_custom_idoc_message,
          panel_partner_wise: panel_partner_wise,
          panel_message_type: panel_message_type,
          panel_all_transactions: panel_all_transactions,
          system_integration_graph: system_integration_graph,
        };

        conditionToUpdate.document_id =
          "custom_development_abap_interface_insight";
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
        screen: "Interface Insight",
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
        screen: "Interface Insight",
        time_duration: timeTaken_ms,
      });
    }
  });
}
