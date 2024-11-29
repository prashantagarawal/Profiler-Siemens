const mongoose = require("mongoose");
const winston = require("winston");
const fs = require("fs");
const { json } = require("express");

let mongooseSchema = new mongoose.Schema({}, { strict: false });
const path = require('path');

// Define the log directory within the writable directory
const logDir = path.join(__dirname, 'logs');

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
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    // new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: "error",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: winston.format.json(),
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    // winston.format.timestamp(),
    // winston.format.json(),
    // winston.format.label({
    //     label: `Label🏷️`
    // }),
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    new TimestampFirst(true),
    winston.format.printf((info) => {
      // `${[info.timestamp]}: ${info}: ${info.label}:  ${info.message}`
      //console.log(info)
      const msgstr = JSON.stringify(info, null, "\t");
      return `${info.level} ${info.timestamp} ${msgstr}`;
    })
  ),
});
const getAllMatchDocument = async (req, res) => {
  try {
    // let model = mongoose.model(req.query.collection_name, mongooseSchema);
    // console.log("req.query", req.query);
    let model = mongoose.models[req.query.collection_name]
      ? mongoose.model(req.query.collection_name)
      : mongoose.model(req.query.collection_name, mongooseSchema);
    let document_id = req.query.document_id;
    let query = {};
    query.document_id = document_id;
    const result = await model.find(query);
    // console.log("result", result);
    logger.info("info", {
      req: req.query,
      status: 200,
      message: "success",
      API_Endpoint: "/",
      query: "find",
    });
    res.status(200).json({ data: result, message: "success" });
  } catch (err) {
    console.log("error :", err);
    logger.error("error", {
      req: req.query,
      status: 500,
      message: "error",
      API_Endpoint: "/",
      query: "find",
    });
    res.status(500).json({ message: err.message });
  }
};

const postAllMatchDocument = async (req, res) => {
  try {
    let collection = mongoose.models[req.query.collection_name]
      ? mongoose.model(req.query.collection_name)
      : mongoose.model(req.query.collection_name, mongooseSchema);
    let payload = req.body;
    /*if(req.query.collection_name ==='queries'){
              payload.query = JSON.stringify(payload.query);
          }*/
    const document = new collection(payload);
    const savedDocument = await document.save();
    res.status(201).json({ data: savedDocument, message: "success" });
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ message: err.message });
  }
};
module.exports = {
  getAllMatchDocument,
  postAllMatchDocument,
};
