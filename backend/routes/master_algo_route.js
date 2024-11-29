const express = require("express");
const router = express.Router();

const {
  reqRunMasterALgorithm,
  getMasterAlgoFileCount,
  checkCsv,
  checkCsvTemp,
  csvCountForJsFiles,
  login,
  getMasterAlgorithm,
} = require("../handlers/master_algo_handler");

router.post("/master_algo", reqRunMasterALgorithm);

router.get("/master_algo", getMasterAlgorithm);

router.get("/master_algo_file_count", getMasterAlgoFileCount);

router.get("/check_csv", checkCsv);

router.get("/check_csv_temp", checkCsvTemp);

router.get("/csv_count_for_js_files", csvCountForJsFiles);

router.get("/login", login);

module.exports = router;
