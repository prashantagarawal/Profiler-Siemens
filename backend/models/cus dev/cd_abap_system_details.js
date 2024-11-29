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
//     "Create_System_Detail_Collection": CreateSystemDetailCollection,
//     "Create_System_Detail": CreateSystemDetail,
//  })[activity];
//  (chooseActivity("Create_System_Detail_Collection"))();

/**
 * @function [createMaster] Function calls other functions of the file
 * @returns {Object} Response to the calling function from master_abap.js file in Master Folder
 */
exports.createMaster = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Status = [];

      let const1 = await CreateSystemDetailCollection();
      pushStatusData(const1, "CreateSystemDetailCollection");

      let const2 = await CreateAddOnsCollection();
      pushStatusData(const2, "CreateAddOnsCollection");

      let const3 = await CreateBusinessFunctionCollection();
      pushStatusData(const3, "CreateBusinessFunctionCollection");

      let const4 = await CreateSystemDetail();
      pushStatusData(const4, "CreateSystemDetail");

      if (
        Status[0].statusCode == 400 ||
        Status[1].statusCode == 400 ||
        Status[2].statusCode == 400 ||
        Status[3].statusCode == 400
      ) {
        return resolve({
          filename: "cd_abap_system_details.js",
          statusCode: 400,
          csvName: ["System Details - Veolia"],
          result: {},
          message: "File Not Executed Successfully",
          funcName: Status,
        });
      } else {
        return resolve({
          filename: "cd_abap_system_details.js",
          statusCode: 200,
          csvName: ["System Details - Veolia"],
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
        filename: "cd_abap_system_details.js",
        statusCode: 400,
        csvName: ["System Details - Veolia"],
        result: { e },
        message: "File Not Executed Successfully",
        funcName: "createMaster",
      });
    }
  });
};
/************************************** Define Each Activity below ***********************************************/

/**
 * @function [CreateSystemDetailCollection] It takes the csv name and create the collection in Database .
 * @returns Returns status of the execution.
 */
// System Detail Collection
function CreateSystemDetailCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      const activityModelName = "custom_dev_abap_system_details";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-01-01.csv") //System Details - Veolia
        .then(async (JsonArray) => {
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_system_details' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_system_details';)
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
                screen: "System Detail Collection",
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
                screen: "System Detail Collection",
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
            screen: "System Detail Collection",
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
        screen: "System Detail Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

/**
 * @function [CreateAddOnsCollection] It takes the csv name and create the collection in Database .
 * @returns Returns status of the execution.
 */
//System Detail ADDON Collection
function CreateAddOnsCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      const activityModelName = "custom_dev_abap_system_detail_add_ons";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/Addon.csv")
        .then(async (JsonArray) => {
          // console.log(JsonArray);

          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_system_detail_add_ons' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_system_detail_add_ons';)
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
                screen: "System Detail ADDON Collection",
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
                screen: "System Detail ADDON Collection",
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
          console.log("error", err);
          return resolve({
            statusCode: 400,
            result: err.stack,
            message: "Collection Not Created",
            csvName: csvName,
            screen: "System Detail ADDON Collection",
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
        screen: "System Detail ADDON Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

/**
 * @function [CreateBusinessFunctionCollection] It takes the csv name and create the collection in Database .
 * @returns Returns status of the execution.
 */
// System Detail business_funcs Collection
function CreateBusinessFunctionCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      const activityModelName = "custom_dev_abap_system_detail_business_funcs";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/Business Function.csv")
        .then(async (JsonArray) => {
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'otc_order_managements' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'otc_order_managements';)
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
                screen: "System Detail business_funcs Collection",
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
                screen: "System Detail business_funcs Collection",
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
            screen: "System Detail business_funcs Collection",
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
        screen: "System Detail business_funcs Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

/**
 * @function [CreateSystemDetail] creates an document from the collection document created above.
 * @returns a document with specified document id and returns the status
 */
function CreateSystemDetail() {
  return new Promise(async (resolve, reject) => {
    const csvName = "01-01-01.csv";
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        //Creation of Model for collections
        // const ModelName = Mongoose.model(activityModelName, mongooseSchema);const activityModelName = 'custom_dev_abap_system_details';
        const promiseArr = [];
        const activityModelName = "custom_dev_abap_system_details";
        const ModelName = Mongoose.models[activityModelName]
          ? Mongoose.model(activityModelName)
          : Mongoose.model(activityModelName, mongooseSchema);

        const activityModelAddOn = "custom_dev_abap_system_detail_add_ons";
        const ModelAddOn = Mongoose.models[activityModelAddOn]
          ? Mongoose.model(activityModelAddOn)
          : Mongoose.model(activityModelAddOn, mongooseSchema);

        const activityModelBussines =
          "custom_dev_abap_system_detail_business_funcs";
        const ModelABF = Mongoose.models[activityModelBussines]
          ? Mongoose.model(activityModelBussines)
          : Mongoose.model(activityModelBussines, mongooseSchema);

        let conditionToUpdate = {};
        let payloadToUpdate = {};

        let kpi_1 = {
          system_name: {
            label: "System Name/Id",
            value: "",
            info: "",
            color: "color-green",
          },
          sap_version: {
            label: "SAP Version",
            value: "",
            info: "",
            color: "color-blue",
          },
          operating: {
            label: "Operating System",
            value: "",
            info: " ",
            color: "color-red",
          },
          langauge: {
            label: "Languages",
            value: "",
            info: " ",
            color: "color-blue",
          },
          client: {
            label: "Client",
            value: "",
            info: "",
            color: "color-red",
          },
          database: {
            label: "Database",
            value: "",
            info: "",
            color: "color-green",
          },
          kernel: {
            label: "Kernel Release",
            value: "",
            info: "",
            color: "color-red",
          },
          last: {
            label: "Last Production Refresh Date",
            value: "",
            info: "",
            color: "color-blue",
          },
        };

        let SystemData = await ModelName.aggregate([
          {
            $facet: {
              SystemName: [
                { $match: { "System ID": { $ne: "" } } },
                {
                  $group: {
                    _id: "$System ID",
                  },
                },
                {
                  $project: {
                    SystemId: "$_id",
                    _id: 0,
                  },
                },
              ],
              SapVersion: [
                { $match: { "SAP Version": { $ne: "" } } },
                {
                  $group: {
                    _id: "$SAP Version",
                  },
                },
                {
                  $project: {
                    Version: "$_id",
                    _id: 0,
                  },
                },
              ],
              Operating: [
                { $match: { "Operating System": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Operating System",
                  },
                },
                {
                  $project: {
                    Operating_system: "$_id",
                    _id: 0,
                  },
                },
              ],
              Languages: [
                { $match: { "Languages Installed": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Languages Installed",
                  },
                },
                {
                  $project: {
                    languages_installed: "$_id",
                    _id: 0,
                  },
                },
              ],
              Client: [
                { $match: { Client: { $ne: "" } } },
                {
                  $group: {
                    _id: "$Client",
                  },
                },
                {
                  $project: {
                    Client_Name: "$_id",
                    _id: 0,
                  },
                },
              ],
              Database: [
                { $match: { Database: { $ne: "" } } },
                {
                  $group: {
                    _id: "$Database",
                  },
                },
                {
                  $project: {
                    Database_Name: "$_id",
                    _id: 0,
                  },
                },
              ],
              Kernel: [
                { $match: { "Kernel Release": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Kernel Release",
                  },
                },
                {
                  $project: {
                    Kernel_Release: "$_id",
                    _id: 0,
                  },
                },
              ],
              Last_date: [
                { $match: { "Last production refresh date": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Last production refresh date",
                  },
                },
                {
                  $project: {
                    last_date: "$_id",
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        //KPI
        if (SystemData[0].SystemName && SystemData[0].SystemName.length) {
          kpi_1["system_name"]["value"] = SystemData[0].SystemName[0].SystemId;
        }
        if (SystemData[0].SapVersion && SystemData[0].SapVersion.length) {
          kpi_1["sap_version"]["value"] = SystemData[0].SapVersion[0].Version;
        }
        if (SystemData[0].Operating && SystemData[0].Operating.length) {
          kpi_1["operating"]["value"] =
            SystemData[0].Operating[0].Operating_system;
        }
        if (SystemData[0].Languages && SystemData[0].Languages.length) {
          kpi_1["langauge"]["value"] =
            SystemData[0].Languages[0].languages_installed;
        }
        if (SystemData[0].Client && SystemData[0].Client.length) {
          kpi_1["client"]["value"] = SystemData[0].Client[0].Client_Name;
        }
        if (SystemData[0].Database && SystemData[0].Database.length) {
          kpi_1["database"]["value"] = SystemData[0].Database[0].Database_Name;
        }
        if (SystemData[0].Kernel && SystemData[0].Kernel.length) {
          kpi_1["kernel"]["value"] = SystemData[0].Kernel[0].Kernel_Release;
        }
        if (SystemData[0].Last_date && SystemData[0].Last_date.length) {
          kpi_1["last"]["value"] = SystemData[0].Last_date[0].last_date;
        }

        let add_ons_panel = [];
        let AddOnPanel = await ModelAddOn.aggregate([
          {
            $match: {},
          },
          {
            $facet: {
              Add_On: [
                {
                  $match: {
                    "Name of an AddOn Product": { $ne: "" },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    AddProduct: "$Name of an AddOn Product",
                    Version: "$Version of an AddOn Product",
                    Description: "$Addon Description",
                  },
                },
                {
                  $sort: {
                    AddProduct: 1,
                  },
                },
              ],
            },
          },
        ]);

        AddOnPanel[0].Add_On.map(function (element) {
          add_ons_panel.push({
            AddProduct: element.AddProduct,
            Version: element.Version,
            Description: element.Description,
          });
        });
        let business_func_panel = [];
        let BFuncPanel = await ModelABF.aggregate([
          {
            $match: {},
          },
          {
            $facet: {
              Business_func: [
                {
                  $match: {
                    "Activated Business Function": { $ne: "" },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    ActivatedBF: "$Activated Business Function",
                    Description: "$Business Function Description",
                  },
                },
                {
                  $sort: {
                    ActivatedBF: 1,
                  },
                },
              ],
            },
          },
        ]);

        BFuncPanel[0].Business_func.map(function (element) {
          business_func_panel.push({
            ActivatedBF: element.ActivatedBF,
            Description: element.Description,
          });
        });

        payloadToUpdate = {
          cust_id: "001",
          industry: "cpg",
          lob: "custom_development",
          menu: "abap",
          tab: "system_details",
          document_id: "custom_development_abap_system_details",
          __v: 0,
          kpi_1: kpi_1,
          add_ons_panel: add_ons_panel,
          business_func_panel: business_func_panel,
        };

        conditionToUpdate.document_id =
          "custom_development_abap_system_details";
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
        screen: "System Detail",
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
        screen: "System Details",
        time_duration: timeTaken_ms,
      });
    }
  });
}
