const master_abap = require("./master_abap");
const path = require("path");

const dirPath = path.join(__dirname,"..","..");

//Array containing all the file details (Name and Importing createmaster) of abap Backend js Folder
var all_abap_files = [
  {
    fileRequire: require("../../models/cus dev/cd_abap_custom_code_quality.js"),
    fileName: "cd_abap_custom_code_quality.js",
    Screen: "Custom Objects ABAP - Custom Code Quality Detail",
  },
  {
    fileRequire: require("../../models/cus dev/cd_abap_interface_insight.js"),
    fileName: "cd_abap_interface_insight.js",
    Screen: "Custom Objects ABAP - Interface Insights Detail",
  },
  {
    fileRequire: require("../../models/cus dev/cd_abap_system_details.js"),
    fileName: "cd_abap_system_details.js",
    Screen: "Custom Objects ABAP - System Details",
  },
  {
    fileRequire: require("../../models/cus dev/cd_abap_transport_req.js"),
    fileName: "cd_abap_transport_req.js",
    Screen: "Custom Objects ABAP - Transport Request Analysis Detail",
  },
  {
    fileRequire: require("../../models/cus dev/cd_abap_usage_analysis.js"),
    fileName: "cd_abap_usage_analysis.js",
    Screen: "Custom Objects ABAP - Usage Analysis Detail",
  },
  {
    fileRequire: require("../../models/cus dev/cd_abap_volumetric_analysis.js"),
    fileName: "cd_abap_volumetric_analysis.js",
    Screen: "Custom Objects ABAP - Volumetric Analysis Detail",
  },
];


//Function to compare the front end req file name array with all_abap_files array
module.exports.compareFiles = async (query_data) => {
 
  let files_to_exec = [];
  var files_to_exec_array = [];
  var files_to_exec_array_obj = {};
  files_to_exec = query_data.files;
  for (let file of files_to_exec) {
    for (let abap_file of all_abap_files) {
      if (file.fileName == abap_file.fileName) {
        files_to_exec_array.push(abap_file);
      } else continue;
    }
  }

  files_to_exec_array_obj = {
    filessss: files_to_exec_array,
    module: query_data.module,
    tab: query_data.tab,
  };
  console.log("Current Working Directory",__dirname);
  if (files_to_exec_array.length > 0) {
    process.chdir(`${dirPath}/excel_files/cus dev ABAP`);
    //Calling the function of master_abap.js
    let result = await master_abap.createMasterDataOverviewDocument(
      files_to_exec_array_obj
    );
    return result;
  } else {
    process.chdir("./excel_files/cus dev ABAP");
    return "Please select appropriate JS file to execute.";
  }
};
