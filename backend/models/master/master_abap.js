"use strict";
const fs = require("fs");
const process = require("process");
const queryDao = require("../../dao/mongodao");
const Mongoose = require("mongoose");
const mongooseSchema = new Mongoose.Schema({}, { strict: false });
require("../../console.js");
let fileCount = 0,
  total = 0;
const winston = require("winston");
const path = require("path");
let itemsProcessed = 1;

module.exports = { createMasterDataOverviewDocument };

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

var FileStatus = [];

function createMasterDataOverviewDocument(abapJson) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        " \n Running ABAP Master Algorithm ...................... \n "
      );

      console.log(
        " \n\n Running " +
          abapJson.filessss.length +
          " files...................... \n\n  "
      );
      const activityModelName = "master_documents";
      const ModelName = Mongoose.models[activityModelName]
        ? Mongoose.model(activityModelName)
        : Mongoose.model(activityModelName, mongooseSchema);
      const activityModelName1 = "master_documents_uis";
      const ModelName1 = Mongoose.models[activityModelName1]
        ? Mongoose.model(activityModelName1)
        : Mongoose.model(activityModelName1, mongooseSchema);
      let payloadToUpdate = {};
      let conditionToUpdate = {};
      let queryToFindDocument = {};
      let fieldsToSelect = {};
      let data = [];
      let JsFilesStatus = [];
      itemsProcessed = 1;
      (fileCount = 0), (total = 0);
      let UnexecutedFile = [];

      for (let file of abapJson.filessss) {
        queryToFindDocument = {
          document_id:
            abapJson.module + "_" + abapJson.tab + "_" + file.fileName,
          is_active: true,
        };
        fieldsToSelect = {
          _id: 1,
          document_id: 1,
          is_active: 1,
        };
        let findDocumentResult = await queryDao.findAll(
          activityModelName1,
          queryToFindDocument,
          fieldsToSelect
        );

        if (findDocumentResult.result && findDocumentResult.result.length) {
          payloadToUpdate = {
            is_active: false,
          };

          conditionToUpdate.document_id =
            abapJson.module + "_" + abapJson.tab + "_" + file.fileName;
          let updateResult = await queryDao.UpdateManyDocument(
            activityModelName1,
            conditionToUpdate,
            payloadToUpdate,
            false,
            true
          );
        }
      }
      let ExecutedData;
      for (let seqOrder of abapJson.filessss) {
        payloadToUpdate = {};
        ExecutedData = await processArray(seqOrder);
        ExecutedData[0].FuncStatus.shift();
        let count = await queryDao.CountCollection();
        payloadToUpdate = {
          document_id:
            abapJson.module +
            "_" +
            abapJson.tab +
            "_" +
            ExecutedData[0].filename,
          FuncStatus: ExecutedData[0].FuncStatus,
          __v: 0,
          user: "UserName",
          user_role: "admin",
          "executed_at ": new Date(),
          cust_id: "001",
          industry: "siemens",
          screen_name: seqOrder.Screen,
          module: abapJson.module,
          tab: abapJson.tab,
          filename: ExecutedData[0].filename,
          OverallStatus: ExecutedData[0].OverallStatus,
          db_document: false,
          collection_created: count.CreatedCollectionVar,
          collection_dropped: count.DeletedCOllectionVar,
          is_active: true,
        };
        let updateResult = await ModelName1.insertMany(payloadToUpdate);
      }

      console.info(
        " \n\n Total " +
          total +
          " files executed out of which " +
          fileCount +
          " files executed successfully \n\n ---------------------------------------------------------------- \n "
      );
      logger.info(
        "Total " +
          total +
          " files executed out of which " +
          fileCount +
          " files executed successfully"
      );
      let count = await queryDao.CountCollection();
      return resolve(FileStatus);
    } catch (e) {
      console.log("Erorroror", e)();
    }
  });
}

async function processArray(item) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        " ........................................ File No " +
          itemsProcessed++ +
          " : Running File " +
          item.fileName +
          " ........................................\n\n\n"
      );
      let result = await item.fileRequire.createMaster();
      FileStatus = [];
      FileStatus.push({
        filename: result.filename,
        OverallStatus: result.statusCode,
        FuncStatus: result.funcName,
        error: result.error,
        message: result.message,
      });
      total++;
      if (result.statusCode == 200) {
        console.info("\n\n" + result.filename + " is executed successfully ");
        console.log(
          " \n\n\n ----------------------------------------------------------- ***********************************************************----------------------------------------------------------- \n\n\n "
        );

        fileCount++;
      } else {
        console.warn(
          "\n\n" + result.filename + " is not executed successfully "
        );
        console.log(
          " \n\n\n ----------------------------------------------------------- ***********************************************************----------------------------------------------------------- \n\n\n "
        );
      }
      return resolve(FileStatus);
    } catch (e) {
      console.log(e);
    }
  });
}
