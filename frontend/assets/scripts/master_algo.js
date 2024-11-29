$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=master_csv_documents&document_id=overall_csv_status`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    let OverallCSVStatus = data.data[0]?.module_wise_summary;
    for (let info of OverallCSVStatus) {
      let tableRow =
        "<tr>" +
        "<td class='text-left'>" +
        info["Modules"] +
        "</td>" +
        "<td class='text-left'>" +
        info["Total CSV required"] +
        "</td>" +
        "<td class='text-left'>" +
        info["CSV Received from ABAP"] +
        "</td>" +
        "<td class='text-left'>" +
        info["Issues in CSV"] +
        "</td>" +
        "<td class='text-left'>" +
        info["Manual CSV required from Functionals"] +
        "</td>" +
        "<td class='text-left'>" +
        info["Issues in Manual CSV"] +
        "</td>" +
        "<td class='text-left'>" +
        info["Total Csvs Yet To Receive"] +
        "</td>" +
        "<td class='text-left'>" +
        info["Manual Csvs Yet To Receive"] +
        "</td>" +
        "</tr>";
      $(tableRow).appendTo("#overallCsvStatus");
    }
  },
});

var master_algorithm_data = [];
//API to fetch data for log tables.
$.ajax({
  type: "GET",
  url:
    masterUrl +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=master_documents_uis`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    master_algorithm_data = data.data[0].MasterDocument;
    $.each(master_algorithm_data, function (i, info) {
      var tableBody = "";
      const module = ["OTC", "Dashboard"];

      if (info.OverallStatus == 200) {
        let table_id = "table_" + i;
        tableBody += `<thead>
        <tr>
        <td colspan="4" data-toggle="collapse" data-target=".${table_id}" style="cursor: pointer;"><strong style="float: left;font-family:helvetica;" ><i class="fa fa-file-code text-primary"></i>&nbsp &nbsp JS File : ${info.filename}</strong><i class="pe-7s-angle-down pe-2x"></i></td>
        <td><i class="fa fa-check-circle fa-lg text-success" aria-hidden="true"></i></td>
        </tr>
        </thead>
        <tbody class="collapse ${table_id}">
        <th>Screen</th>
        <th>CSV Name</th>
        <th>Status Code</th>
        <th>Function Name</th>
        <th>Execution Time (s)</th>
        </tr>`;
      } else {
        let table_id = "table_" + i;
        tableBody += `<thead>
        <tr>
        <td colspan="4" data-toggle="collapse" data-target=".${table_id}" style="cursor: pointer;"><strong style="float: left;font-family:helvetica;" ><i class="fa fa-file-code text-primary"></i>&nbsp &nbsp JS File : ${info.filename}</strong><i class="pe-7s-angle-down pe-2x"></i></td>
        <td><i class="fa fa-times-circle fa-lg text-danger" aria-hidden="true"></i></td>
        </tr>
        </thead>
        <tbody class="collapse ${table_id}">
        <th>Screen</th>
        <th>CSV Name</th>
        <th>Status Code</th>
        <th>Function Name</th>       
        <th>Execution Time (s)</th>
        </tr>`;
      }

      tabledata = info.FuncStatus;
      for (j = 0; j < tabledata.length; j++) {
        if (tabledata[j].statusCode == 200 && module.includes(info.module)) {
          tableBody += `<tr><td>${tabledata[j].screen}</td><td>${
            tabledata[j].csvName
          }</td><td>${tabledata[j].statusCode}</td><td>${
            tabledata[j].funcName
          }</td><td>${(tabledata[j].time_duration / 1000).toFixed(
            3
          )}</td></tr>`;
        } else if (tabledata[j].statusCode == 200) {
          tableBody += `<tr><td>${info.screen_name}</td><td>${
            tabledata[j].csvName
          }</td><td>${tabledata[j].statusCode}</td><td>${
            tabledata[j].funcName
          }</td><td>${(tabledata[j].time_duration / 1000).toFixed(
            3
          )}</td></tr>`;
        } else if (
          tabledata[j].statusCode == 400 &&
          module.includes(info.module)
        ) {
          tableBody += `<tr style="color: red;cursor:pointer" data-toggle="modal" data-target="#overall_modal" onClick="ClickOnTable(' ${
            info.filename
          }','${tabledata[j].funcName}')"><td>${tabledata[j].screen}</td><td>${
            tabledata[j].csvName
          }</td><td>${tabledata[j].statusCode}</td><td>${
            tabledata[j].funcName
          }</td><td>${(tabledata[j].time_duration / 1000).toFixed(
            3
          )}</td></tr>`;
        } else {
          tableBody += `<tr style="color: red;cursor:pointer" data-toggle="modal" data-target="#overall_modal" onClick="ClickOnTable(' ${
            info.filename
          }','${tabledata[j].funcName}')"><td>${info.screen_name}</td><td>${
            tabledata[j].csvName
          }</td><td>${tabledata[j].statusCode}</td><td>${
            tabledata[j].funcName
          }</td><td>${(tabledata[j].time_duration / 1000).toFixed(
            3
          )}</td></tr>`;
        }
      }

      tableBody += `</tbody>`;
      document.getElementById(info.tab).innerHTML += tableBody;
    });
  },
});

//API to fetch KPI data for log tabs
$.ajax({
  type: "GET",
  url:
    masterUrlGetFileCount + `db_name=${sessionStorage.getItem("DatabaseName")}`,
  contentType: "application/json",
  dataType: "json",
  data: {
    collection_name: "master_documents_uis",
    moduleNames: ["CUSTOM_DEV_ABAP"],
  },
  success: function (data) {
    document.getElementById("CUSTOM_DEV_ABAP_All_Files").innerHTML =
      data.data.Total_files_executed[0];
    document.getElementById("CUSTOM_DEV_ABAP_Success").innerHTML =
      data.data.Files_Executed_Successfully[0];
    document.getElementById(
      "CUSTOM_DEV_ABAP_All_Collections_Created"
    ).innerHTML = data.data.Collections_created[0];
    document.getElementById(
      "CUSTOM_DEV_ABAP_All_Collections_Deleted"
    ).innerHTML = data.data.Collections_dropped[0];

    if (
      data.data.Total_files_executed[0] >
      data.data.Files_Executed_Successfully[0]
    ) {
      document
        .getElementById("CUSTOM_DEV_ABAP_Success")
        .classList.add("text-danger");
    } else {
      document
        .getElementById("CUSTOM_DEV_ABAP_Success")
        .classList.add("text-success");
    }
  },
});

//----------------------------------------Master Algorithm API Call----------------------------------------------------
var responseFromBackend;

function submitFunction(tableId, tableTab) {
  var tableElement = document.getElementById(tableId);
  var checkBoxes = tableElement.getElementsByTagName("INPUT");
  table_tab_id = "";
  log_tab_id = "";
  log_table_id = "";
  table_div_id = "";
  log_div_id = "";

  var files_to_execute = [];
  var module_name = "";

  if (tableId == "custom_dev_abap_all_Table") {
    module_name = "CUSTOM_DEV_ABAP";
    table_div_id = "custom_dev_abap_all";
  }

  //Loop through the CheckBoxes.
  for (var i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      var row = checkBoxes[i].parentNode.parentNode;
      files_to_execute.push({ fileName: row.cells[1].id });
    }
  }

  //API to run the master files in backend
  $.ajax({
    url: masterUrl + `db_name=${sessionStorage.getItem("DatabaseName")}`,
    dataType: "json",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify({
      files: files_to_execute,
      module: module_name,
      tab: tableTab,
    }),

    //To show the loader while ajax call is in process.
    beforeSend: function () {
      $("#loader").show();
      document.getElementById(table_div_id).classList.remove("active", "show");
    },

    success: function (response) {
      sessionStorage.setItem("reloading", "true");
      $("#loader").hide();
      location.reload();
    },

    // //On ajax response hides the loader
    complete: function () {
      $("#loader").hide();
    },
    error: function (e) {
      console.log("error", e);
    },
  });
}

//To display Modal by clicking on the table row with error
function ClickOnTable(file, func) {
  document.getElementById(
    "overall_modal_title_description"
  ).innerHTML = `<div>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Function Name : ${func}</div>`;
  for (let fileDet of master_algorithm_data) {
    file = file.trim();
    if (file.localeCompare(fileDet.filename) == 0) {
      for (let functtionDet of fileDet.FuncStatus) {
        if (functtionDet.funcName == func) {
          document.getElementById(
            "ModalBody"
          ).innerHTML = `<div><pre>${functtionDet?.result?.message}</pre></div>`;
        }
      }
    }
  }
}

function checkCSV(moduleSelected) {
  $.ajax({
    type: "GET",
    url:
      checkCsvUrl +
      `db_name=${sessionStorage.getItem(
        "DatabaseName"
      )}&module_name=${moduleSelected}`,
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      let checkCsvResult;
      let correctCsvsCount = 0;

      $.each(data.data.result, function (i, info) {
        $("#check_csv_modal_title").html(
          `<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp ${moduleSelected.toUpperCase()} - CSV Verification Logs</h5>`
        );
        let statusSign;
        if (info.statusCode == 200) {
          statusSign = `<i class="fa fa-check-circle fa-lg text-success" aria-hidden="true"></i>`;
          correctCsvsCount++;
        } else {
          statusSign = `<i class="fa fa-times-circle fa-lg text-danger" aria-hidden="true"></i>`;
        }

        checkCsvResult = `<tr>
        <td> ${info.file}</td>
        <td>${info.message}</td>
        <td> ${statusSign}</td>
        </tr>`;

        $(checkCsvResult).appendTo("#check_csv_modal_tbody");
      });
      $("#csvs_required").html(data.data.totalCSVsRequired);
      $("#csvs_recieved").html(data.data.totalCSVsRecieved);
      $("#correct_csvs").html(correctCsvsCount);
      $("#incorrect_csvs").html(data.data.totalCSVsRecieved - correctCsvsCount);

      $("#check_csv_modal").modal("show");
    },
    error: function (err) {
      console.log("err", err.responseJSON.data.result);
      $("#check_csv_modal_body").html(err.responseJSON.data.result);
      $("#check_csv_modal").modal("show");
    },
  });
}

$.ajax({
  type: "GET",
  url: checkCsvCount + `db_name=${sessionStorage.getItem("DatabaseName")}`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    let moduleCsv_table;

    $.each(data.data, function (i, info) {
      if (info.excel_file_csv_count == 0) {
        $("#tab_" + info.moduleName).css("display", "none");
      }

      moduleCsv_table =
        "<tr>" +
        "<td class='text-left'>" +
        info.moduleName.toUpperCase() +
        "</td>" +
        "<td class='text-left'>" +
        info.repository_count +
        "</td>" +
        "<td class='text-left'>" +
        (info.received_count + info.excel_file_csv_count) +
        "</td>" +
        "<td class='text-left'>" +
        info.received_count +
        "</td>" +
        (info.received_count == 0
          ? "<td>" +
            '<button class="btn-wide btn btn-primary disabled" >Check CSVs</button>' +
            "</td>"
          : "<td >" +
            '<button class="btn-wide btn btn-primary " onclick="checkCSV(\'' +
            info.moduleName +
            "')\">Check CSVs</button>" +
            "</td>") +
        "<td class='text-left'>" +
        info.excel_file_csv_count +
        "</td>" +
        "<td class='text-left'>" +
        (info.repository_count - info.excel_file_csv_count) +
        "</td>" +
        (info.excel_file_csv_count == 0
          ? "<td >" +
            '<button class="btn-wide btn btn-primary disabled" >Master Algorithm</button>' +
            "</td>"
          : "<td>" +
            '<button class="btn-wide btn btn-primary "  onclick="changeTab(\'' +
            info.moduleName +
            "')\"> Master Algorithm</button>" +
            "</td>") +
        "</tr>";

      $(moduleCsv_table).appendTo("#moduleWiseCSVCount");
    });
  },
  error: function (err) {
    console.log("error", err);
  },
});

function changeTab(tab) {
  tab = tab.toLowerCase().replace(/ /g, "_");
  $("#tab_" + tab).addClass("active");
  $("#" + tab).addClass("active show");
  $("#tab_check_csv").removeClass("active");
  $("#check_csv").removeClass("active show");
}

$.ajax({
  type: "GET",
  url: csvCountForJSFiles + `db_name=${sessionStorage.getItem("DatabaseName")}`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    let jsFileWiseData = data.data;
    let ptdCheckBoxClasses = [];

    for (let info of jsFileWiseData) {
      for (let fileData of info.JSWiseDetails) {
        let nodetotalCsvCount = document.createElement("td");
        let nodeprovidedCsvCount = document.createElement("td");
        let totalCsvCount = document.createTextNode(fileData.totalcsvCount);
        let providedCsvCount = document.createTextNode(
          fileData.correctCsvsProvided
        );
        nodetotalCsvCount.appendChild(totalCsvCount);
        nodeprovidedCsvCount.appendChild(providedCsvCount);
        if (document.getElementById(fileData.jsFile)) {
          document
            .getElementById(fileData.jsFile)
            .parentElement.appendChild(nodetotalCsvCount);
          document
            .getElementById(fileData.jsFile)
            .parentElement.appendChild(nodeprovidedCsvCount);
          if (
            fileData.totalcsvCount > fileData.correctCsvsProvided &&
            info.Module != "PTD"
          ) {
            let checkbox = document.getElementById(fileData.jsFile)
              .parentElement.children[2].children;
            $(checkbox).attr("disabled", "true");
          } else if (
            info.Module == "PTD" &&
            fileData.correctCsvsProvided == 0 &&
            fileData.totalcsvCount != 0 &&
            fileData.totalcsvCount != ""
          ) {
            let checkbox = document.getElementById(fileData.jsFile)
              .parentElement.children[2].children;
            let abc = document.getElementById(fileData.jsFile).parentElement
              .children[2].children[0].className;
            abc = abc.split(" ");
            if (abc.length > 1 && !ptdCheckBoxClasses.includes(abc[1])) {
              ptdCheckBoxClasses.push(abc[1]);
            }
            $(checkbox).attr("disabled", "true");
          }
        }
      }
    }
    for (let checkboxClass of ptdCheckBoxClasses) {
      let count = 0;
      let checkBoxesLength =
        document.getElementsByClassName(checkboxClass).length;

      for (let checkboxes of document.getElementsByClassName(checkboxClass)) {
        if (checkboxes.disabled) {
          $("." + checkboxClass + "_overview").attr("disabled", "true");
        }
      }
    }
  },
  error: function (err) {
    console.log("error", err);
  },
});
