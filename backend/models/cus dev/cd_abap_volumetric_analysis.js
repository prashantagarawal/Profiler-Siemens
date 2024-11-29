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
//     "Create_Volumetric_Analysis_Enhancements_Collection": CreateVolumetricAnalysisEnhancementsCollection,
//     "Create_Volumetric_Analysis_ProcessWise_Collection": CreateVolumetricAnalysisProcessWiseCollection,
//     "Create_Volumetric_Analysis_Custom_Object_Inventory_Collection": CreateVolumetricAnalysisCustomObjectInventoryCollection,
//     "Create_Volumetric_Analysis": CreateVolumetricAnalysis,
//  })[activity];
//  (chooseActivity("Create_Volumetric_Analysis"))();

/**
 * @function [createMaster] Function calls other functions of the file
 * @returns {Object} Response to the calling function from master_abap.js file in Master Folder
 */
exports.createMaster = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let Status = [];

      let const1 = await CreateVolumetricAnalysisEnhancementsCollection();
      pushStatusData(const1, "CreateVolumetricAnalysisEnhancementsCollection");

      let const2 = await CreateVolumetricAnalysisProcessWiseCollection();
      pushStatusData(const2, "CreateVolumetricAnalysisProcessWiseCollection");

      let const3 =
        await CreateVolumetricAnalysisCustomObjectInventoryCollection();
      pushStatusData(
        const3,
        "CreateVolumetricAnalysisCustomObjectInventoryCollection"
      );

      let const4 = await CreateVolumetricAnalysis();
      pushStatusData(const4, "CreateVolumetricAnalysis");

      if (
        Status[0].statusCode == 400 ||
        Status[1].statusCode == 400 ||
        Status[2].statusCode == 400 ||
        Status[3].statusCode == 400
      ) {
        return resolve({
          filename: "cd_abap_volumetric_analysis.js",
          statusCode: 400,
          csvName: [
            "Veolia - Volumetric Analysis - Enhancement Insights ",
            "Veolia - Process Wise distribution",
            "Volumetric Analysis - Custom Inventory - Veolia",
          ],
          result: {},
          message: "File Not Executed Successfully",
          funcName: Status,
        });
      } else {
        return resolve({
          filename: "cd_abap_volumetric_analysis.js",
          statusCode: 200,
          csvName: [
            "Veolia - Volumetric Analysis - Enhancement Insights ",
            "Veolia - Process Wise distribution",
            "Volumetric Analysis - Custom Inventory - Veolia",
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
        filename: "cd_abap_volumetric_analysis.js",
        statusCode: 400,
        csvName: [
          "Veolia - Volumetric Analysis - Enhancement Insights ",
          "Veolia - Process Wise distribution",
          "Volumetric Analysis - Custom Inventory - Veolia",
        ],
        result: { e },
        message: "File Not Executed Successfully",
        funcName: "createMaster",
      });
    }
  });
};

/************************************** Define Each Activity below ***********************************************/

/*
 * @functions [CreateVolumetricAnalysisEnhancementsCollection,
 * CreateVolumetricAnalysisProcessWiseCollection,
 * CreateVolumetricAnalysisCustomObjectInventoryCollection]  It takes the csv name and create the collection in Database .
 * @returns Returns status of the execution.
 */
// Volumetric Analysis Enhancements Collection
function CreateVolumetricAnalysisEnhancementsCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_enhancement_insights";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-02-01.csv")
        .then(async (JsonArray) => {
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_volumetric_analysis_enhancement_insights' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_volumetric_analysis_enhancement_insights';)
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
                screen: "Volumetric Analysis Enhancements Collection",
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
                screen: "Volumetric Analysis Enhancements Collectionn",
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
            screen: "Volumetric Analysis Enhancements Collection",
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
        screen: "Volumetric Analysis Enhancements Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

// Volumetric Analysis ProcessWise Collection
function CreateVolumetricAnalysisProcessWiseCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_processwises";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-02-02.csv")
        .then(async (JsonArray) => {
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_volumetric_analysis_processwises' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_volumetric_analysis_processwises';)
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
                screen: "Volumetric Analysis ProcessWise Collection",
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
                screen: "Volumetric Analysis ProcessWise Collection",
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
            screen: "Volumetric Analysis ProcessWise Collection",
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
        screen: "Volumetric Analysis ProcessWise Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

// Volumetric Analysis Custom Object Inventory Collection
function CreateVolumetricAnalysisCustomObjectInventoryCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      const activityModelName =
        "custom_dev_abap_volumetric_analysis_custom_objects";
      await CSVToJSON()
        .fromFile("../../excel_files/cus dev ABAP/08-02-03.csv")
        .then(async (JsonArray) => {
          let i = 1;
          for (let data of JsonArray) {
            data["index"] = i++;
          }
          //Creation of Connection to Database
          let dbConnected = await queryDao.dbConnection;
          if (dbConnected) {
            //Deletes the existing collection 'custom_dev_abap_volumetric_analysis_custom_objects' if present.
            let result1 = await queryDao.dropCollection(activityModelName);

            //Creates a collection (const activityModelName = 'custom_dev_abap_volumetric_analysis_custom_objects';)
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
                screen:
                  "Volumetric Analysis Custom Object Inventory Collection",
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
                screen:
                  "Volumetric Analysis Custom Object Inventory Collection",
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
            screen: "Volumetric Analysis Custom Object Inventory Collection",
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
        screen: "Volumetric Analysis Custom Object Inventory Collection",
        time_duration: timeTaken_ms,
      });
    }
  });
}

//Volumetric Analysis
function CreateVolumetricAnalysis() {
  return new Promise(async (resolve, reject) => {
    console.log("start");
    try {
      const csvName = "01-01-01.csv";
      var begin = performance.now();

      let dbConnected = await queryDao.dbConnection;
      if (dbConnected) {
        //Creation of Model for collections
        const EnhancementGraphModel =
          "custom_dev_abap_volumetric_analysis_enhancement_insights";
        const ProcessWiseGraphModel =
          "custom_dev_abap_volumetric_analysis_processwises";
        const CustomObjectGraphModel =
          "custom_dev_abap_volumetric_analysis_custom_objects";

        const promiseArr = [];
        const EnhancementGraphModelName = Mongoose.models[EnhancementGraphModel]
          ? Mongoose.model(EnhancementGraphModel)
          : Mongoose.model(EnhancementGraphModel, mongooseSchema);
        const ProcessWiseGraphModelName = Mongoose.models[ProcessWiseGraphModel]
          ? Mongoose.model(ProcessWiseGraphModel)
          : Mongoose.model(ProcessWiseGraphModel, mongooseSchema);
        const CustomObjectGraphModelName = Mongoose.models[
          CustomObjectGraphModel
        ]
          ? Mongoose.model(CustomObjectGraphModel)
          : Mongoose.model(CustomObjectGraphModel, mongooseSchema);

        let conditionToUpdate = {};
        let payloadToUpdate = {};

        let kpi_1 = {
          total: {
            label: "Total Custom Objects",
            value: "0",
            info: "Across All Processes",
            color: "color-green",
          },
          primary: {
            label: "Primary Objects",
            value: "0",
            info: "RICEFW,CDS,AMDP,ODATA,WEB Apps",
            color: "color-blue",
          },
          secondary: {
            label: "Secondary Objects",
            value: "0",
            info: "Includes,FMs,DD,Others",
            color: "color-red",
          },
        };
        let chart_primary_objects = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_process_wise_distribution = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_BC = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_BW = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_CA = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_HCM = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_LO = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_NA = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_OTC = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_Others = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_PS = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_PSM = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_PTD = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_PTP = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_RTR = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };
        let chart_object_dis_EAM = {
          label: [
            "Reports",
            "Interfaces",
            "Conversion",
            "Enhancements",
            "Forms",
            "Workflows",
          ],
          value: [],
          value_unit: "",
        };

        let chart_function_exit_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_badi_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_screen_exit_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_routines_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_table_exit_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_implicit_explicit_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_menu_exit_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_modified_object = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_repaired_object_by_module = {
          label: [],
          value: [],
          value_unit: "",
        };
        let chart_cloned_objects = {
          label: [],
          value1: {
            label: "Class",
            value: [],
          },
          value2: {
            label: "Function Module",
            value: [],
          },
          value3: {
            label: "Include",
            value: [],
          },
          value4: {
            label: "Program",
            value: [],
          },
          value_unit: "",
        };

        let panel_primary_object_list = [];

        //Enhancement Insight KPI
        let EnhancementData = await EnhancementGraphModelName.aggregate([
          {
            $facet: {
              FunctionExitGraph: [
                { $match: { "Function Exit module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Function Exit module",
                    count: { $first: "$FE count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              BadiGraph: [
                { $match: { "BADI module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$BADI module",
                    count: { $first: "$BADI count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              ScreenExitGraph: [
                { $match: { "screen exit module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$screen exit module",
                    count: { $first: "$screen count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              RoutinesGraph: [
                { $match: { "routines module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$routines module",
                    count: { $first: "$routine count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              TableExitGraph: [
                { $match: { "table exit module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$table exit module",
                    count: { $first: "$table exit count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              ImplicitExplicitGraph: [
                { $match: { "Implict/Explicit module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Implict/Explicit module",
                    count: { $first: "$Implict/explicit count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              MenuExitGraph: [
                { $match: { "MENU exit module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$MENU exit module",
                    count: { $first: "$Menu exit count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              ModifiedGraph: [
                { $match: { "repaired module": { $ne: "" } } },
                {
                  $group: {
                    _id: "$repaired module",
                    count: { $first: "$repaired module count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              RepairedGraph: [
                { $match: { "repaired Object": { $ne: "" } } },
                {
                  $group: {
                    _id: "$repaired Object",
                    count: { $first: "$repaired object count" },
                  },
                },
                {
                  $project: {
                    module_name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
              AllProcess: [
                { $match: { "Module Cloned": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Module Cloned",
                  },
                },
                {
                  $project: {
                    process: "$_id",
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        //Function Exits Graph
        for (let Data of EnhancementData[0].FunctionExitGraph) {
          chart_function_exit_by_module["label"].push(Data["module_name"]);
          chart_function_exit_by_module["value"].push(+Data["count"]);
        }

        //Badi Graph
        for (let Data of EnhancementData[0].BadiGraph) {
          chart_badi_by_module["label"].push(Data["module_name"]);
          chart_badi_by_module["value"].push(+Data["count"]);
        }

        //Screen Exit Graph
        for (let Data of EnhancementData[0].ScreenExitGraph) {
          chart_screen_exit_by_module["label"].push(Data["module_name"]);
          chart_screen_exit_by_module["value"].push(+Data["count"]);
        }

        //Routines Graph
        for (let Data of EnhancementData[0].RoutinesGraph) {
          chart_routines_by_module["label"].push(Data["module_name"]);
          chart_routines_by_module["value"].push(+Data["count"]);
        }

        //Table Exits Graph
        for (let Data of EnhancementData[0].TableExitGraph) {
          chart_table_exit_by_module["label"].push(Data["module_name"]);
          chart_table_exit_by_module["value"].push(+Data["count"]);
        }

        //Implicit Explicit Graph
        for (let Data of EnhancementData[0].ImplicitExplicitGraph) {
          chart_implicit_explicit_by_module["label"].push(Data["module_name"]);
          chart_implicit_explicit_by_module["value"].push(+Data["count"]);
        }

        //Menu Exit Graph
        for (let Data of EnhancementData[0].MenuExitGraph) {
          chart_menu_exit_by_module["label"].push(Data["module_name"]);
          chart_menu_exit_by_module["value"].push(+Data["count"]);
        }

        //Modified Graph
        for (let Data of EnhancementData[0].ModifiedGraph) {
          chart_modified_object["label"].push(Data["module_name"]);
          chart_modified_object["value"].push(+Data["count"]);
        }

        //Repaired Graph
        for (let Data of EnhancementData[0].RepairedGraph) {
          chart_repaired_object_by_module["label"].push(Data["module_name"]);
          chart_repaired_object_by_module["value"].push(+Data["count"]);
        }

        let ProcessData = [];
        for (let Processwise of EnhancementData[0].AllProcess) {
          ProcessData = await EnhancementGraphModelName.aggregate([
            {
              $match: { "Module Cloned": { $eq: Processwise["process"] } },
            },
            {
              $facet: {
                ClassData: [
                  {
                    $match: {
                      "Object type Cloned": { $eq: "Class (ABAP Objects)" },
                    },
                  },
                  {
                    $group: {
                      _id: "$Object type Cloned",
                      class_count: { $first: "$Count Cloned" },
                    },
                  },
                  {
                    $project: {
                      class_data: "$_id",
                      class_count: 1,
                      _id: 0,
                    },
                  },
                ],
                FunctionData: [
                  {
                    $match: {
                      "Object type Cloned": { $eq: "Function Module" },
                    },
                  },
                  {
                    $group: {
                      _id: "$Function Module",
                      class_count: { $first: "$Count Cloned" },
                    },
                  },
                  {
                    $project: {
                      function_data: "$_id",
                      class_count: 1,
                      _id: 0,
                    },
                  },
                ],
                IncludeData: [
                  { $match: { "Object type Cloned": { $eq: "Include" } } },
                  {
                    $group: {
                      _id: "$Include",
                      class_count: { $first: "$Count Cloned" },
                    },
                  },
                  {
                    $project: {
                      include_data: "$_id",
                      class_count: 1,
                      _id: 0,
                    },
                  },
                ],
                ProgramData: [
                  { $match: { "Object type Cloned": { $eq: "Program" } } },
                  {
                    $group: {
                      _id: "$Program",
                      class_count: { $first: "$Count Cloned" },
                    },
                  },
                  {
                    $project: {
                      program_data: "$_id",
                      class_count: 1,
                      _id: 0,
                    },
                  },
                ],
              },
            },
          ]);

          chart_cloned_objects["label"].push(Processwise["process"]);
          if (ProcessData[0].ClassData && ProcessData[0].ClassData.length) {
            chart_cloned_objects["value1"]["value"].push(
              +ProcessData[0].ClassData[0].class_count
            );
          } else {
            chart_cloned_objects["value1"]["value"].push(0);
          }
          if (
            ProcessData[0].FunctionData &&
            ProcessData[0].FunctionData.length
          ) {
            chart_cloned_objects["value2"]["value"].push(
              +ProcessData[0].FunctionData[0].class_count
            );
          } else {
            chart_cloned_objects["value2"]["value"].push(0);
          }
          if (ProcessData[0].IncludeData && ProcessData[0].IncludeData.length) {
            chart_cloned_objects["value3"]["value"].push(
              +ProcessData[0].IncludeData[0].class_count
            );
          } else {
            chart_cloned_objects["value3"]["value"].push(0);
          }
          if (ProcessData[0].ProgramData && ProcessData[0].ProgramData.length) {
            chart_cloned_objects["value4"]["value"].push(
              +ProcessData[0].ProgramData[0].class_count
            );
          } else {
            chart_cloned_objects["value4"]["value"].push(0);
          }
        }
        //ProcessWise
        let ProcessWise = await ProcessWiseGraphModelName.aggregate([
          {
            $facet: {
              Modules: [
                { $match: { Module: { $ne: "" } } },
                {
                  $group: {
                    _id: "$Module",
                    count: { $sum: 1 },
                  },
                },
                {
                  $project: {
                    name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);
        //Process Wise Distribution Graph
        for (let Data of ProcessWise[0].Modules) {
          chart_process_wise_distribution["label"].push(Data["name"]);
          chart_process_wise_distribution["value"].push(+Data["count"]);
        }
        let ProcesswiseGraphData = [];
        for (let Processwise of ProcessWise[0].Modules) {
          ProcesswiseGraphData = await ProcessWiseGraphModelName.aggregate([
            {
              $match: { Module: { $eq: Processwise["name"] } },
            },
            {
              $facet: {
                Reports: [
                  { $match: { Category: { $eq: "Reports" } } },
                  {
                    $group: {
                      _id: "$Category",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      data: "$_id",
                      count: 1,
                      _id: 0,
                    },
                  },
                ],
                Interface: [
                  { $match: { Category: { $eq: "Interface" } } },
                  {
                    $group: {
                      _id: "$Category",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      data: "$_id",
                      count: 1,
                      _id: 0,
                    },
                  },
                ],
                Conversion: [
                  { $match: { Category: { $eq: "Conversion" } } },
                  {
                    $group: {
                      _id: "$Category",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      data: "$_id",
                      count: 1,
                      _id: 0,
                    },
                  },
                ],
                Enhancement: [
                  { $match: { Category: { $eq: "Enhancement" } } },
                  {
                    $group: {
                      _id: "$Category",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      data: "$_id",
                      count: 1,
                      _id: 0,
                    },
                  },
                ],
                Forms: [
                  { $match: { Category: { $eq: "Forms" } } },
                  {
                    $group: {
                      _id: "$Category",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      data: "$_id",
                      count: 1,
                      _id: 0,
                    },
                  },
                ],
                Workflows: [
                  { $match: { Category: { $eq: "Workflow" } } },
                  {
                    $group: {
                      _id: "$Category",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      data: "$_id",
                      count: 1,
                      _id: 0,
                    },
                  },
                ],
              },
            },
          ]);

          if (Processwise["name"] == "BC") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_BC["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_BC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_BC["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_BC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_BC["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_BC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_BC["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_BC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_BC["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_BC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_BC["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_BC["value"].push(0);
            }
          } else if (Processwise["name"] == "BW") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_BW["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_BW["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_BW["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_BW["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_BW["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_BW["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_BW["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_BW["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_BW["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_BW["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_BW["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_BW["value"].push(0);
            }
          } else if (Processwise["name"] == "CA") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_CA["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_CA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_CA["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_CA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_CA["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_CA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_CA["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_CA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_CA["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_CA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_CA["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_CA["value"].push(0);
            }
          } else if (Processwise["name"] == "HCM") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_HCM["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_HCM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_HCM["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_HCM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_HCM["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_HCM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_HCM["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_HCM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_HCM["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_HCM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_HCM["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_HCM["value"].push(0);
            }
          } else if (Processwise["name"] == "LO") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_LO["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_LO["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_LO["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_LO["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_LO["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_LO["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_LO["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_LO["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_LO["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_LO["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_LO["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_LO["value"].push(0);
            }
          } else if (Processwise["name"] == "NA") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_NA["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_NA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_NA["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_NA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_NA["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_NA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_NA["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_NA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_NA["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_NA["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_NA["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_NA["value"].push(0);
            }
          } else if (Processwise["name"] == "OTC") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_OTC["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_OTC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_OTC["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_OTC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_OTC["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_OTC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_OTC["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_OTC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_OTC["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_OTC["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_OTC["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_OTC["value"].push(0);
            }
          } else if (Processwise["name"] == "OTHERS") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_Others["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_Others["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_Others["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_Others["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_Others["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_Others["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_Others["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_Others["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_Others["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_Others["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_Others["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_Others["value"].push(0);
            }
          } else if (Processwise["name"] == "PS") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_PS["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_PS["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_PS["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_PS["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_PS["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_PS["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_PS["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_PS["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_PS["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_PS["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_PS["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_PS["value"].push(0);
            }
          } else if (Processwise["name"] == "PSM") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_PSM["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_PSM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_PSM["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_PSM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_PSM["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_PSM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_PSM["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_PSM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_PSM["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_PSM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_PSM["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_PSM["value"].push(0);
            }
          } else if (Processwise["name"] == "PTD") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_PTD["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_PTD["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_PTD["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_PTD["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_PTD["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_PTD["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_PTD["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_PTD["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_PTD["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_PTD["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_PTD["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_PTD["value"].push(0);
            }
          } else if (Processwise["name"] == "PTP") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_PTP["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_PTP["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_PTP["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_PTP["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_PTP["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_PTP["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_PTP["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_PTP["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_PTP["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_PTP["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_PTP["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_PTP["value"].push(0);
            }
          } else if (Processwise["name"] == "RTR") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_RTR["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_RTR["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_RTR["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_RTR["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_RTR["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_RTR["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_RTR["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_RTR["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_RTR["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_RTR["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_RTR["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_RTR["value"].push(0);
            }
          } else if (Processwise["name"] == "EAM") {
            if (
              ProcesswiseGraphData[0].Reports &&
              ProcesswiseGraphData[0].Reports.length
            ) {
              chart_object_dis_EAM["value"].push(
                +ProcesswiseGraphData[0].Reports[0].count
              );
            } else {
              chart_object_dis_EAM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Interface &&
              ProcesswiseGraphData[0].Interface.length
            ) {
              chart_object_dis_EAM["value"].push(
                +ProcesswiseGraphData[0].Interface[0].count
              );
            } else {
              chart_object_dis_EAM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Conversion &&
              ProcesswiseGraphData[0].Conversion.length
            ) {
              chart_object_dis_EAM["value"].push(
                +ProcesswiseGraphData[0].Conversion[0].count
              );
            } else {
              chart_object_dis_EAM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Enhancement &&
              ProcesswiseGraphData[0].Enhancement.length
            ) {
              chart_object_dis_EAM["value"].push(
                +ProcesswiseGraphData[0].Enhancement[0].count
              );
            } else {
              chart_object_dis_EAM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Forms &&
              ProcesswiseGraphData[0].Forms.length
            ) {
              chart_object_dis_EAM["value"].push(
                +ProcesswiseGraphData[0].Forms[0].count
              );
            } else {
              chart_object_dis_EAM["value"].push(0);
            }
            if (
              ProcesswiseGraphData[0].Workflows &&
              ProcesswiseGraphData[0].Workflows.length
            ) {
              chart_object_dis_EAM["value"].push(
                +ProcesswiseGraphData[0].Workflows[0].count
              );
            } else {
              chart_object_dis_EAM["value"].push(0);
            }
          }
        }

        //Custom Object Inventory
        let CustomObjectData = await CustomObjectGraphModelName.aggregate([
          {
            $facet: {
              Total: [
                { $match: { "Total Custom Objects": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Total Custom Objects",
                  },
                },
                {
                  $project: {
                    Totalval: "$_id",
                    _id: 0,
                  },
                },
              ],
              Primary: [
                { $match: { "Primary Objects": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Primary Objects",
                  },
                },
                {
                  $project: {
                    Primaryval: "$_id",
                    _id: 0,
                  },
                },
              ],
              Secondary: [
                { $match: { "Secondary Objects": { $ne: "" } } },
                {
                  $group: {
                    _id: "$Secondary Objects",
                  },
                },
                {
                  $project: {
                    Secondayval: "$_id",
                    _id: 0,
                  },
                },
              ],
              PrimaryObjectList: [
                { $match: { "Sub Object": { $ne: "" } } },
                {
                  $sort: { index: 1 },
                },
                {
                  $project: {
                    "Sub Object": 1,
                    "Sub object count": 1,
                    _id: 0,
                  },
                },
              ],
              PrimaryGraph: [
                { $match: { Name: { $ne: "" } } },
                {
                  $group: {
                    _id: "$Name",
                    count: { $first: "$Count" },
                  },
                },
                {
                  $project: {
                    name: "$_id",
                    count: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
        ]);

        //KPI
        if (CustomObjectData[0].Total && CustomObjectData[0].Total.length) {
          kpi_1["total"]["value"] = CustomObjectData[0].Total[0].Totalval;
        }
        if (CustomObjectData[0].Primary && CustomObjectData[0].Primary.length) {
          kpi_1["primary"]["value"] = CustomObjectData[0].Primary[0].Primaryval;
        }
        if (
          CustomObjectData[0].Secondary &&
          CustomObjectData[0].Secondary.length
        ) {
          kpi_1["secondary"]["value"] =
            CustomObjectData[0].Secondary[0].Secondayval;
        }

        //Primary Graph
        for (let Data of CustomObjectData[0].PrimaryGraph) {
          chart_primary_objects["label"].push(Data["name"]);
          chart_primary_objects["value"].push(+Data["count"]);
        }

        //Primary Graph List
        for (let Data of CustomObjectData[0].PrimaryObjectList) {
          panel_primary_object_list.push({
            label: Data["Sub Object"],
            value: Data["Sub object count"],
          });
        }

        payloadToUpdate = {
          cust_id: "001",
          industry: "cpg",
          lob: "custom_development",
          menu: "abap",
          tab: "volumetric_analysis",
          document_id: "custom_development_abap_volumetric_analysis",
          __v: 0,
          kpi_1: kpi_1,
          chart_primary_objects: chart_primary_objects,
          chart_process_wise_distribution: chart_process_wise_distribution,
          chart_object_dis_BC: chart_object_dis_BC,
          chart_object_dis_BW: chart_object_dis_BW,
          chart_object_dis_CA: chart_object_dis_CA,
          chart_object_dis_HCM: chart_object_dis_HCM,
          chart_object_dis_LO: chart_object_dis_LO,
          chart_object_dis_NA: chart_object_dis_NA,
          chart_object_dis_OTC: chart_object_dis_OTC,
          chart_object_dis_Others: chart_object_dis_Others,
          chart_object_dis_PS: chart_object_dis_PS,
          chart_object_dis_PSM: chart_object_dis_PSM,
          chart_object_dis_PTD: chart_object_dis_PTD,
          chart_object_dis_PTP: chart_object_dis_PTP,
          chart_object_dis_RTR: chart_object_dis_RTR,
          chart_object_dis_EAM: chart_object_dis_EAM,
          chart_function_exit_by_module: chart_function_exit_by_module,
          chart_badi_by_module: chart_badi_by_module,
          chart_screen_exit_by_module: chart_screen_exit_by_module,
          chart_routines_by_module: chart_routines_by_module,
          chart_table_exit_by_module: chart_table_exit_by_module,
          chart_implicit_explicit_by_module: chart_implicit_explicit_by_module,
          chart_menu_exit_by_module: chart_menu_exit_by_module,
          chart_modified_object: chart_modified_object,
          chart_repaired_object_by_module: chart_repaired_object_by_module,
          chart_cloned_objects: chart_cloned_objects,
          panel_primary_object_list: panel_primary_object_list,
        };

        conditionToUpdate.document_id =
          "custom_development_abap_volumetric_analysis";
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
        screen: "volumetric_analysis",
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
        screen: "volumetric_analysis",
        time_duration: timeTaken_ms,
      });
    }
  });
}
