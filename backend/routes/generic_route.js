const express = require("express");
const router = express.Router();

const {
  getAllMatchDocument,
  postAllMatchDocument,
} = require("../handlers/generic_handler");

// // Getting all matched documents
router.get("/", getAllMatchDocument);

// Creating new document if collection exists or create a collection and insert record into it
router.post("/", postAllMatchDocument);

module.exports = router;
