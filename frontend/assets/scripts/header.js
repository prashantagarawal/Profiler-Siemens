const params = new URLSearchParams(
  decodeURIComponent(document.location.search)
);
let client = params.get("client");

function getWithExpiry(client) {
  const itemStr = localStorage.getItem(client);
  // if the item doesn't exist, return null
  if (!itemStr) {
    window.location.href = `login.html${window.location.search}&page=${window.location.pathname}`;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(client);
    window.location.href = `login.html${window.location.search}&page=${window.location.pathname}`;
  }
  return item.value;
}

if (params.get("client") == null) {
} else {
  sessionStorage.setItem("DatabaseName", params.get("client"));
}

/******************************************************************************************************* */
/* *******************AJAX CALL TO CUSOMIZE SIDE PANEL BASED ON VARIOUS CLIENTS************************* */
/******************************************************************************************************* */
$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=side_panels&document_id=menu_side_panel_and_overview_tabs`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    let sideMenuData = data.data;

    $.each(sideMenuData, function (i, data) {
      $.each(data, function (i, innerDetailMenu) {
        if (
          typeof innerDetailMenu == "object" &&
          innerDetailMenu.flag === false &&
          innerDetailMenu.id_side_menu !== ""
        ) {
          document.getElementById(innerDetailMenu.id_side_menu).style.display =
            "none";
        }
        if (data["flag"] == false) {
          document.getElementById(data.id_side_menu).style.display = "none";
        }
      });
    });
  },
});

function createURL(htmlFileName) {
  window.location = createDynamicURL(htmlFileName);
}

function createDynamicURL(htmlFileName) {
  let htmlPageURL = encodeURIComponent(
    `client=${sessionStorage.getItem("DatabaseName")}`
  );
  // The variable to be returned
  var URL = `${htmlFileName}?${htmlPageURL}`;
  return URL;
}

function createDownloadReportsOutPdfDynamicURL(csvName) {
  let url = `https://lntinfotech.sharepoint.com/sites/IPToolsExecution/Shared%20Documents/Profiler2_Reports_Out/${sessionStorage.getItem(
    "DatabaseName"
  )}/${csvName}`;
  return url;
}
