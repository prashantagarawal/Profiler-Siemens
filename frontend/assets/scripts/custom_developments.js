Highcharts.setOptions({
  colors: [
    "rgb(0, 143, 251)",
    "rgb(0, 227, 150)",
    "rgb(254, 176, 25)",
    "rgba(255, 69, 96, 0.85)",
    "#64E572",
    "#FF9655",
    "#FFF263",
    "#6AF9C4",
  ],
});

$("#tab-custom-pipo-usage").click(function () {
  $(".app-main").css({ display: "block" });
});

let count_abap = 0;
//---------------------------------------ABAP Starts-----------------------------------------------//

//--------------------------Volumetric Analysis API Starts--------------------------------------------//
var volumetric_analysis_data;
$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=custom_developments&document_id=custom_development_abap_volumetric_analysis`,

  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    volumetric_analysis_data = data.data[0];

    if (volumetric_analysis_data && volumetric_analysis_data.length == 0) {
      document.getElementById("tab-custom-volumetric-analysis").style.display =
        "none";
    } else {
      document.getElementById("tab-custom-volumetric-analysis").style.display =
        "block";
      count_abap++;
    }
    if (count_abap > 0) {
      document.getElementById("tab_abap").style.display = "block";
    }

    let index = 1;
    $.each(volumetric_analysis_data.kpi_1, function (i, data) {
      document.getElementById("kpi_custom_object_label_" + index).innerHTML =
        data.label;
      document.getElementById("kpi_custom_object_info_" + index).innerHTML =
        data.info;
      document.getElementById("kpi_custom_object_value_" + index).innerHTML =
        data.value;
      document.getElementById("kpi_custom_object_value_" + index).style.color =
        color[data.color];
      index++;
    });

    //Primary OBject Graph
    ApexCharts.exec("chart_primary_objects_id", "updateOptions", {
      labels: volumetric_analysis_data.chart_primary_objects.label,
      series: volumetric_analysis_data.chart_primary_objects.value,
    });

    //Primary OBJECTS List
    document.getElementById("primary_object_table_tbody").innerHTML = "";
    let list_data = "";

    $.each(
      volumetric_analysis_data.panel_primary_object_list,
      function (i, data) {
        list_data =
          "<tr>" +
          "<td class='text-left' style='padding-left: 20px;'>" +
          data.label +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          data.value +
          "</td>" +
          "</tr>";
        $(list_data).appendTo("#primary_object_table_tbody");
      }
    );

    //Process Wise Dist
    ApexCharts.exec("chart_process_wise_distribution_id", "updateOptions", {
      xaxis: {
        categories:
          volumetric_analysis_data.chart_process_wise_distribution.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_process_wise_distribution.value,
        },
      ],
    });

    //HCM Graph
    ApexCharts.exec("chart_object_dis_HCM_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_object_dis_HCM.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_object_dis_HCM.value,
        },
      ],
    });

    //Otc Graph
    ApexCharts.exec("chart_object_dis_OTC_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_object_dis_OTC.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_object_dis_OTC.value,
        },
      ],
    });

    //PS Graph
    ApexCharts.exec("chart_object_dis_PS_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_object_dis_PS.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_object_dis_PS.value,
        },
      ],
    });

    //PTD Graph
    ApexCharts.exec("chart_object_dis_PTD_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_object_dis_PTD.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_object_dis_PTD.value,
        },
      ],
    });

    //PTP Graph
    ApexCharts.exec("chart_object_dis_PTP_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_object_dis_PTP.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_object_dis_PTP.value,
        },
      ],
    });

    //RTR Graph
    ApexCharts.exec("chart_object_dis_RTR_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_object_dis_RTR.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_object_dis_RTR.value,
        },
      ],
    });

    //EAM Graph
    ApexCharts.exec("custom_object_dist_eam_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_object_dis_EAM.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_object_dis_EAM.value,
        },
      ],
    });

    ApexCharts.exec("chart_function_exit_by_module_id", "updateOptions", {
      xaxis: {
        categories:
          volumetric_analysis_data.chart_function_exit_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_function_exit_by_module.value,
        },
      ],
    });

    //Badi Graph
    ApexCharts.exec("chart_badi_by_module_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_badi_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_badi_by_module.value,
        },
      ],
    });

    //Screen Exit Graph
    ApexCharts.exec("chart_screen_exit_by_module_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_screen_exit_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_screen_exit_by_module.value,
        },
      ],
    });

    // Routines Graph
    ApexCharts.exec("chart_routines_by_module_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_routines_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_routines_by_module.value,
        },
      ],
    });

    // Table Exit Graph
    ApexCharts.exec("chart_table_exit_by_module_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_table_exit_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_table_exit_by_module.value,
        },
      ],
    });

    //Implicit Explicit Graph
    ApexCharts.exec("chart_implicit_explicit_by_module_id", "updateOptions", {
      xaxis: {
        categories:
          volumetric_analysis_data.chart_implicit_explicit_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_implicit_explicit_by_module
            .value,
        },
      ],
    });

    //Menu Exit Graph
    ApexCharts.exec("chart_menu_exit_by_module_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_menu_exit_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_menu_exit_by_module.value,
        },
      ],
    });

    //Modified Graph
    ApexCharts.exec("chart_modified_object_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_modified_object.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_modified_object.value,
        },
      ],
    });

    //Repaired Graph
    ApexCharts.exec("chart_repaired_object_by_module_id", "updateOptions", {
      xaxis: {
        categories:
          volumetric_analysis_data.chart_repaired_object_by_module.label,
      },
      series: [
        {
          data: volumetric_analysis_data.chart_repaired_object_by_module.value,
        },
      ],
    });

    //ARTIFACT WISE PROCESS WISE CLONED OBJECTS
    ApexCharts.exec("chart_cloned_objects_id", "updateOptions", {
      xaxis: {
        categories: volumetric_analysis_data.chart_cloned_objects.label,
      },
      series: [
        {
          name: volumetric_analysis_data.chart_cloned_objects.value1.label,
          data: volumetric_analysis_data.chart_cloned_objects.value1.value,
        },
        {
          name: volumetric_analysis_data.chart_cloned_objects.value2.label,
          data: volumetric_analysis_data.chart_cloned_objects.value2.value,
        },
        {
          name: volumetric_analysis_data.chart_cloned_objects.value3.label,
          data: volumetric_analysis_data.chart_cloned_objects.value3.value,
        },
        {
          name: volumetric_analysis_data.chart_cloned_objects.value4.label,
          data: volumetric_analysis_data.chart_cloned_objects.value4.value,
        },
      ],
    });
  },
});

//---------------------------Volumetric Analysis API Ends--------------------------------------------//

//---------------------------Volumetric Analysis Graph Starts--------------------------------------------//

//Primary Object Graph
var custom_primary = {
  series: [],
  chart: {
    // width: 480,
    height: 400,
    type: "pie",
    id: "chart_primary_objects_id",
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },
  labels: [],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          // width: 380
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  legend: {
    position: "bottom",
    offsetY: 0,
    height: 60,
  },
};
var custom_primary_chart = new ApexCharts(
  document.querySelector("#custom_primary"),
  custom_primary
);
custom_primary_chart.render();

//Process Wise Dist
var custom_process_wise_dist = {
  series: [],
  chart: {
    type: "bar",
    height: 295,
    id: "chart_process_wise_distribution_id",
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_process_wise_dist_chart = new ApexCharts(
  document.querySelector("#custom_process_wise_dist"),
  custom_process_wise_dist
);
custom_process_wise_dist_chart.render();

var custom_object_dist_hcm = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_object_dis_HCM_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_object_dist_hcm_chart = new ApexCharts(
  document.querySelector("#custom_object_dist_hcm"),
  custom_object_dist_hcm
);
custom_object_dist_hcm_chart.render();

var custom_object_dist_otc = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_object_dis_OTC_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_object_dist_otc_chart = new ApexCharts(
  document.querySelector("#custom_object_dist_otc"),
  custom_object_dist_otc
);
custom_object_dist_otc_chart.render();

var custom_object_dist_ps = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_object_dis_PS_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_object_dist_ps_chart = new ApexCharts(
  document.querySelector("#custom_object_dist_ps"),
  custom_object_dist_ps
);
custom_object_dist_ps_chart.render();

var custom_object_dist_ptd = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_object_dis_PTD_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_object_dist_ptd_chart = new ApexCharts(
  document.querySelector("#custom_object_dist_ptd"),
  custom_object_dist_ptd
);
custom_object_dist_ptd_chart.render();

//PTP Graph
var custom_object_dist_ptp = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_object_dis_PTP_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_object_dist_ptp_chart = new ApexCharts(
  document.querySelector("#custom_object_dist_ptp"),
  custom_object_dist_ptp
);
custom_object_dist_ptp_chart.render();

//RTR Graph
var custom_object_dist_rtr = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_object_dis_RTR_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_object_dist_rtr_chart = new ApexCharts(
  document.querySelector("#custom_object_dist_rtr"),
  custom_object_dist_rtr
);
custom_object_dist_rtr_chart.render();

//EAM Graph
var custom_object_dist_eam = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "custom_object_dist_eam_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_object_dist_eam_chart = new ApexCharts(
  document.querySelector("#custom_object_dist_eam"),
  custom_object_dist_eam
);
custom_object_dist_eam_chart.render();

//Function Exits
var custom_ei_func_exits = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_function_exit_by_module_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_func_exits_chart = new ApexCharts(
  document.querySelector("#custom_ei_func_exits"),
  custom_ei_func_exits
);
custom_ei_func_exits_chart.render();

//Badi graph
var custom_ei_badi = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_badi_by_module_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_badi_chart = new ApexCharts(
  document.querySelector("#custom_ei_badi"),
  custom_ei_badi
);
custom_ei_badi_chart.render();

//Screen Exit Graph
var custom_ei_screen_exits = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_screen_exit_by_module_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_screen_exits_chart = new ApexCharts(
  document.querySelector("#custom_ei_screen_exits"),
  custom_ei_screen_exits
);
custom_ei_screen_exits_chart.render();

//Routine Graph
var custom_ei_routines = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_routines_by_module_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    //   labels: {
    //   rotate: -45
    // },
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_routines_chart = new ApexCharts(
  document.querySelector("#custom_ei_routines"),
  custom_ei_routines
);
custom_ei_routines_chart.render();

//Table Exit Graph
var custom_ei_table_exits = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_table_exit_by_module_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_table_exits_chart = new ApexCharts(
  document.querySelector("#custom_ei_table_exits"),
  custom_ei_table_exits
);
custom_ei_table_exits_chart.render();

//Implicit/Explicit
var custom_ei_implicit = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_implicit_explicit_by_module_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_implicit_chart = new ApexCharts(
  document.querySelector("#custom_ei_implicit"),
  custom_ei_implicit
);
custom_ei_implicit_chart.render();

//Menu Exit Graph
var custom_ei_menu_exits = {
  series: [],
  chart: {
    type: "bar",
    height: 265,
    id: "chart_menu_exit_by_module_id",
  },
  plotOptions: {
    bar: {
      vertical: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_menu_exits_chart = new ApexCharts(
  document.querySelector("#custom_ei_menu_exits"),
  custom_ei_menu_exits
);
custom_ei_menu_exits_chart.render();

//Modified Graph
var custom_ei_modified = {
  series: [],
  chart: {
    type: "bar",
    height: 350,
    id: "chart_modified_object_id",
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_modified_chart = new ApexCharts(
  document.querySelector("#custom_ei_modified"),
  custom_ei_modified
);
custom_ei_modified_chart.render();

//Repaired Graph
var custom_ei_repaired = {
  series: [],
  chart: {
    type: "bar",
    height: 295,
    id: "chart_repaired_object_by_module_id",
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ei_repaired_chart = new ApexCharts(
  document.querySelector("#custom_ei_repaired"),
  custom_ei_repaired
);
custom_ei_repaired_chart.render();

//ARTIFACT WISE PROCESS WISE CLONED OBJECTS
var custom_ei_artifact = {
  series: [],
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    id: "chart_cloned_objects_id",
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  xaxis: {
    categories: [],
  },
  legend: {
    position: "bottom",
  },
  fill: {
    opacity: 1,
  },
};
var custom_ei_artifact_chart = new ApexCharts(
  document.querySelector("#custom_ei_artifact"),
  custom_ei_artifact
);
custom_ei_artifact_chart.render();

//---------------------------Volumetric Analysis Graph Ends--------------------------------------------//

//---------------------------Transport Req API Starts--------------------------------------------//
var abap_transport_req_quality;
$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=custom_developments&document_id=custom_development_abap_transport_req_analysis`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    abap_transport_req_quality = data.data[0];

    if (abap_transport_req_quality && abap_transport_req_quality.length == 0) {
      document.getElementById("tab-custom-transport").style.display = "none";
    } else {
      document.getElementById("tab-custom-transport").style.display = "block";
      count_abap++;
    }
    if (count_abap > 0) {
      document.getElementById("tab_abap").style.display = "block";
    }

    //workbench_vs_repair_vs_customizing
    ApexCharts.exec("chart_workbench_repair_customizing_id", "updateOptions", {
      xaxis: {
        categories:
          abap_transport_req_quality.chart_workbench_repair_customizing.label,
      },
      series: [
        {
          name: abap_transport_req_quality.chart_workbench_repair_customizing
            .value1.label,
          data: abap_transport_req_quality.chart_workbench_repair_customizing
            .value1.value,
        },
        {
          name: abap_transport_req_quality.chart_workbench_repair_customizing
            .value2.label,
          data: abap_transport_req_quality.chart_workbench_repair_customizing
            .value2.value,
        },
        {
          name: abap_transport_req_quality.chart_workbench_repair_customizing
            .value3.label,
          data: abap_transport_req_quality.chart_workbench_repair_customizing
            .value3.value,
        },
      ],
    });

    //TOP 10 FREQUENTLY TRANSPORTED OBJECTS
    document.getElementById("custom_transport_req_table_tbody").innerHTML = "";
    let list_data = "";

    $.each(
      abap_transport_req_quality.panel_frequently_transported_object,
      function (i, custom_data) {
        list_data =
          "<tr>" +
          "<td class='text-left' style='padding-left: 20px;'>" +
          custom_data.object +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          custom_data.object_name +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          custom_data.count +
          "</td>" +
          "</tr>";
        $(list_data).appendTo("#custom_transport_req_table_tbody");
      }
    );
  },
});

//---------------------------Transport Req API Ends--------------------------------------------//

//---------------------------Transport Req Graph Start--------------------------------------------//
//workbench_vs_repair_vs_customizing
var custom_workbench_vs_repair_vs_customizing_var = {
  series: [],
  chart: {
    type: "bar",
    height: 350,
    id: "chart_workbench_repair_customizing_id",
    stacked: true,
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  xaxis: {
    categories: [],
  },
  legend: {
    position: "bottom",
  },
  fill: {
    opacity: 1,
  },
};
var custom_workbench_vs_repair_vs_customizing_chart = new ApexCharts(
  document.querySelector("#custom_workbench_vs_repair_vs_customizing"),
  custom_workbench_vs_repair_vs_customizing_var
);
custom_workbench_vs_repair_vs_customizing_chart.render();

//---------------------------Transport Req Graph Ends--------------------------------------------//

//---------------------------Custom Code Quality API Starts--------------------------------------------//
var abap_custom_code_quality;
$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=custom_developments&document_id=custom_development_abap_custom_code_quality`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    abap_custom_code_quality = data.data[0];

    if (abap_custom_code_quality && abap_custom_code_quality.length == 0) {
      document.getElementById("tab-custom-code-quality").style.display = "none";
    } else {
      document.getElementById("tab-custom-code-quality").style.display =
        "block";
      count_abap++;
    }

    if (count_abap > 0) {
      document.getElementById("tab_abap").style.display = "block";
    }
    //Objects contributing Hana Optimization
    ApexCharts.exec("chart_hana_optimization_id", "updateOptions", {
      labels: abap_custom_code_quality.chart_hana_optimization.label,
      series: abap_custom_code_quality.chart_hana_optimization.value,
    });

    //Objects contributing Hana Migration
    ApexCharts.exec("chart_hana_migration_id", "updateOptions", {
      labels: abap_custom_code_quality.chart_hana_migration.label,
      series: abap_custom_code_quality.chart_hana_migration.value,
    });

    //Objects contributing Best practice
    ApexCharts.exec("chart_best_practice_id", "updateOptions", {
      labels: abap_custom_code_quality.chart_best_practice.label,
      series: abap_custom_code_quality.chart_best_practice.value,
    });

    //Objects contributing Security
    ApexCharts.exec("chart_security_id", "updateOptions", {
      labels: abap_custom_code_quality.chart_security.label,
      series: abap_custom_code_quality.chart_security.value,
    });

    //Objects contributing Hana Optimization List
    document.getElementById("custom_hana_optimization_table_thead").innerHTML =
      "";
    document.getElementById("custom_hana_optimization_table_tbody").innerHTML =
      "";
    let hana_optimization_list = "";

    $.each(
      abap_custom_code_quality.panel_hana_optimization,
      function (i, hana_optimization) {
        if (i == 0) {
          hana_optimization_list =
            "<tr>" +
            "<th class='text-left'>" +
            hana_optimization.label +
            "</th>" +
            "<th class='text-center'>" +
            hana_optimization.value +
            "</th>" +
            "</tr>";

          $(hana_optimization_list).appendTo(
            "#custom_hana_optimization_table_thead"
          );
        } else {
          hana_optimization_list =
            "<tr>" +
            "<td class='text-left'>" +
            hana_optimization.label +
            "</td>" +
            "<td class='text-center'>" +
            hana_optimization.value +
            "</td>" +
            "</tr>";
          $(hana_optimization_list).appendTo(
            "#custom_hana_optimization_table_tbody"
          );
        }
      }
    );

    //Objects contributing Hana Migration List
    document.getElementById("custom_hana_migration_table_thead").innerHTML = "";
    document.getElementById("custom_hana_migration_table_tbody").innerHTML = "";
    let hana_migration_list = "";

    $.each(
      abap_custom_code_quality.panel_hana_migration,
      function (i, hana_optimization) {
        if (i == 0) {
          hana_migration_list =
            "<tr>" +
            "<th class='text-left'>" +
            hana_optimization.label +
            "</th>" +
            "<th class='text-center'>" +
            hana_optimization.value +
            "</th>" +
            "</tr>";

          $(hana_migration_list).appendTo("#custom_hana_migration_table_thead");
        } else {
          hana_migration_list =
            "<tr>" +
            "<td class='text-left'>" +
            hana_optimization.label +
            "</td>" +
            "<td class='text-center'>" +
            hana_optimization.value +
            "</td>" +
            "</tr>";
          $(hana_migration_list).appendTo("#custom_hana_migration_table_tbody");
        }
      }
    );

    //Objects contributing Best Practice List
    document.getElementById("custom_best_practice_table_thead").innerHTML = "";
    document.getElementById("custom_best_practice_table_tbody").innerHTML = "";
    let hana_best_practice_list = "";

    $.each(
      abap_custom_code_quality.panel_best_practice,
      function (i, hana_optimization) {
        if (i == 0) {
          hana_best_practice_list =
            "<tr>" +
            "<th class='text-left'>" +
            hana_optimization.label +
            "</th>" +
            "<th class='text-center'>" +
            hana_optimization.value +
            "</th>" +
            "</tr>";

          $(hana_best_practice_list).appendTo(
            "#custom_best_practice_table_thead"
          );
        } else {
          hana_best_practice_list =
            "<tr>" +
            "<td class='text-left'>" +
            hana_optimization.label +
            "</td>" +
            "<td class='text-center'>" +
            hana_optimization.value +
            "</td>" +
            "</tr>";
          $(hana_best_practice_list).appendTo(
            "#custom_best_practice_table_tbody"
          );
        }
      }
    );

    //Objects contributing Security List
    document.getElementById("custom_security_table_thead").innerHTML = "";
    document.getElementById("custom_security_table_tbody").innerHTML = "";
    let hana_security_list = "";

    $.each(
      abap_custom_code_quality.panel_security,
      function (i, hana_optimization) {
        if (i == 0) {
          hana_security_list =
            "<tr>" +
            "<th class='text-left'>" +
            hana_optimization.label +
            "</th>" +
            "<th class='text-center'>" +
            hana_optimization.value +
            "</th>" +
            "</tr>";

          $(hana_security_list).appendTo("#custom_security_table_thead");
        } else {
          hana_security_list =
            "<tr>" +
            "<td class='text-left'>" +
            hana_optimization.label +
            "</td>" +
            "<td class='text-center'>" +
            hana_optimization.value +
            "</td>" +
            "</tr>";
          $(hana_security_list).appendTo("#custom_security_table_tbody");
        }
      }
    );
  },
});
//---------------------------Custom Code Quality API Ends------------------------------//

//---------------------------Custom Code Quality Graph Start------------------------------//

//Objects contributing Hana Optimization
var custom_hana_optimization = {
  series: [],
  labels: [],
  chart: {
    height: 350,
    type: "pie",
    id: "chart_hana_optimization_id",
  },

  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },
  responsive: [
    {
      // breakpoint: 480,
      options: {
        chart: {
          width: 10,
        },
        legend: {
          show: true,
        },
      },
    },
  ],
  legend: {
    position: "bottom",
    offsetY: 0,
    height: 50,
  },
};

var custom_hana_optimization_chart = new ApexCharts(
  document.querySelector("#custom_hana_optimization"),
  custom_hana_optimization
);
custom_hana_optimization_chart.render();

//Objects contributing Hana Migration
var custom_hana_migration = {
  series: [],
  labels: [],
  chart: {
    height: 350,
    type: "pie",
    id: "chart_hana_migration_id",
  },

  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },
  responsive: [
    {
      // breakpoint: 480,
      options: {
        chart: {
          //width: 0
        },
        legend: {
          show: true,
        },
      },
    },
  ],
  legend: {
    position: "bottom",
    offsetY: 0,
    height: 50,
  },
};

var custom_hana_migration_chart = new ApexCharts(
  document.querySelector("#custom_hana_migration"),
  custom_hana_migration
);
custom_hana_migration_chart.render();

//Objects contributing best practice
var custom_best_pratice = {
  series: [],
  labels: [],
  chart: {
    height: 350,
    type: "pie",
    id: "chart_best_practice_id",
  },

  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },
  responsive: [
    {
      // breakpoint: 480,
      options: {
        chart: {
          //width: 0
        },
        legend: {
          show: true,
        },
      },
    },
  ],
  legend: {
    position: "bottom",
    offsetY: 0,
    height: 50,
  },
};

var custom_best_pratice_chart = new ApexCharts(
  document.querySelector("#custom_best_pratice"),
  custom_best_pratice
);
custom_best_pratice_chart.render();

//Objects contributing Security
var custom_security = {
  series: [],
  labels: [],
  chart: {
    height: 350,
    type: "pie",
    id: "chart_security_id",
  },

  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },
  responsive: [
    {
      options: {
        chart: {},
        legend: {
          show: true,
        },
      },
    },
  ],
  legend: {
    position: "bottom",
    offsetY: 0,
    height: 50,
  },
};

var custom_security_chart = new ApexCharts(
  document.querySelector("#custom_security"),
  custom_security
);
custom_security_chart.render();

//---------------------------Custom Code Quality Graph Ends------------------------------//

//---------------------------System Details API Starts--------------------------------------------//
var coatable_destroy;
var coatable_destroy_add_on;
var system_details;
$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=custom_developments&document_id=custom_development_abap_system_details`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    system_details = data.data;

    if (system_details && system_details.length == 0) {
      document.getElementById("tab-custom-system-details").style.display =
        "none";
    } else {
      document.getElementById("tab-custom-system-details").style.display =
        "block";
      count_abap++;
    }

    if (count_abap > 0) {
      document.getElementById("tab_abap").style.display = "block";
    }
    let system_details_kpi_index = 1;
    $.each(system_details[0].kpi_1, function (i, system_details_kpi_data) {
      document.getElementById(
        "kpi_abap_label_" + system_details_kpi_index
      ).innerHTML = system_details_kpi_data.label;
      document.getElementById(
        "kpi_abap_value_" + system_details_kpi_index
      ).innerHTML = system_details_kpi_data.value;
      document.getElementById(
        "kpi_abap_value_" + system_details_kpi_index
      ).style.color = color[system_details_kpi_data.color];
      system_details_kpi_index++;
    });

    let add_ons_data = "";

    $.each(system_details[0].add_ons_panel, function (i, panel_data) {
      add_ons_data =
        "<tr>" +
        "<td class='text-left' >" +
        panel_data.AddProduct +
        "</td>" +
        "<td class='text-left' >" +
        panel_data.Version +
        "</td>" +
        "<td class='text-left' >" +
        panel_data.Description +
        "</td>" +
        "</tr>";
      $(add_ons_data).appendTo("#add_ons_table tbody");
    });

    document.getElementById("business_functions_table_tbody").innerHTML = "";
    let business_functions_data = "";

    $.each(system_details[0].business_func_panel, function (i, panel_data) {
      business_functions_data =
        "<tr>" +
        "<td class='text-left'>" +
        panel_data.ActivatedBF +
        "</td>" +
        "<td class='text-left' >" +
        panel_data.Description +
        "</td>" +
        "</tr>";
      $(business_functions_data).appendTo("#business_functions_table");
    });
  },
});

//---------------------------System Details API Ends--------------------------------------------//

//---------------------------Interface Insight API Starts--------------------------------------------//
var interface_data;
var chart_rfc_modules_var_label = [];
var chart_rfc_module_value = [];
$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=custom_developments&document_id=custom_development_abap_interface_insight`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    interface_data = data.data[0];
    console.log("Interface Data", interface_data);
    if (interface_data && interface_data.length == 0) {
      document.getElementById("tab-custom-interface-insights").style.display =
        "none";
    } else {
      document.getElementById("tab-custom-interface-insights").style.display =
        "block";
      count_abap++;
    }

    if (count_abap > 0) {
      document.getElementById("tab_abap").style.display = "block";
    }

    //Interface Insights KPI
    document.getElementById("kpi_interface_insight_label_1").innerHTML =
      interface_data.kpi_1.external_system.label +
      "<span class='card-more' style='padding:6px' data-toggle='modal' data-target='#modal_external_system_integrated'>" +
      "<i class='fa fa-info-circle'></i></span>";

    document.getElementById("kpi_interface_insight_value_1").innerHTML =
      interface_data.kpi_1.external_system.value;
    document.getElementById("kpi_interface_insight_value_1").style.color =
      color[interface_data.kpi_1.external_system.color];

    document.getElementById("kpi_interface_insight_label_2").innerHTML =
      interface_data.kpi_1.active_rfc.label;
    document.getElementById("kpi_interface_insight_value_2").innerHTML =
      interface_data.kpi_1.active_rfc.value;
    document.getElementById("kpi_interface_insight_value_2").style.color =
      color[interface_data.kpi_1.active_rfc.color];

    document.getElementById("kpi_interface_insight_label_3").innerHTML =
      interface_data.kpi_1.idoc.label +
      "<span class='card-more' style='padding:6px' data-toggle='modal' data-target='#modal_idoc_interface'>" +
      "<i class='fa fa-info-circle'></i></span>";
    document.getElementById("kpi_interface_insight_value_3").innerHTML =
      interface_data.kpi_1.idoc.value;
    document.getElementById("kpi_interface_insight_value_3").style.color =
      color[interface_data.kpi_1.idoc.color];

    document.getElementById("kpi_interface_insight_label_4").innerHTML =
      interface_data.kpi_1.custom_idoc.label;
    document.getElementById("kpi_interface_insight_value_4").innerHTML =
      interface_data.kpi_1.custom_idoc.value;
    document.getElementById("kpi_interface_insight_value_4").style.color =
      color[interface_data.kpi_1.custom_idoc.color];

    document.getElementById("kpi_interface_insight_label_5").innerHTML =
      interface_data.kpi_1.file.label;
    document.getElementById("kpi_interface_insight_value_5").innerHTML =
      interface_data.kpi_1.file.value;
    document.getElementById("kpi_interface_insight_value_5").style.color =
      color[interface_data.kpi_1.file.color];

    //External System List
    document.getElementById("custom_external_system_table_tbody").innerHTML =
      "";
    let external_list_data = "";

    $.each(
      interface_data.panel_external_system_integrated,
      function (i, panel_data) {
        external_list_data =
          "<tr>" +
          "<td class='text-left' style='padding-left: 20px;'>" +
          panel_data.label +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          panel_data.value +
          "</td>" +
          "</tr>";
        $(external_list_data).appendTo("#custom_external_system_table_tbody");
      }
    );

    //Idoc Inbound List
    document.getElementById("table_inbound_idoc_tbody").innerHTML = "";
    let inbound_idoc_interface_list = "";

    $.each(
      interface_data.panel_idoc_inbound_integrated,
      function (i, panel_data) {
        inbound_idoc_interface_list =
          "<tr>" +
          "<td class='text-left' style='padding-left: 20px;'>" +
          panel_data.label +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          panel_data.value +
          "</td>" +
          "</tr>";
        $(inbound_idoc_interface_list).appendTo("#table_inbound_idoc_tbody");
      }
    );

    //Idoc Outbound List
    document.getElementById("table_outbound_idoc_tbody").innerHTML = "";
    let outbound_idoc_list = "";

    $.each(
      interface_data.panel_idoc_outbound_integrated,
      function (i, panel_data) {
        outbound_idoc_list =
          "<tr>" +
          "<td class='text-left' style='padding-left: 20px;'>" +
          panel_data.label +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          panel_data.value +
          "</td>" +
          "</tr>";
        $(outbound_idoc_list).appendTo("#table_outbound_idoc_tbody");
      }
    );

    ApexCharts.exec("chart_custom_idoc_message_id", "updateOptions", {
      xaxis: {
        categories: interface_data.chart_custom_idoc_message.label,
      },
      series: [
        {
          data: interface_data.chart_custom_idoc_message.value,
        },
      ],
    });

    //INBOUND IDOC TRAFFIC
    let chart_inbound_traffic_label = [];
    let chart_inbound_traffic_value = [];
    chart_inbound_traffic_label = interface_data.chart_inbound_traffic.label;
    $.each(interface_data.chart_inbound_traffic.value, function (i, info) {
      if (info.label && info.value) {
        chart_inbound_traffic_value.push({
          name: info.label,
          data: info.value,
        });
      }
    });

    ApexCharts.exec("chart_inbound_traffic_id", "updateOptions", {
      xaxis: {
        categories: chart_inbound_traffic_label,
      },
      series: chart_inbound_traffic_value,
    });

    //Outbound IDOC TRAFFIC
    let chart_outbound_traffic_label = [];
    let chart_outbound_traffic_value = [];
    chart_outbound_traffic_label = interface_data.chart_outbound_traffic.label;

    $.each(interface_data.chart_outbound_traffic.value, function (i, info) {
      if (info.label && info.value) {
        chart_outbound_traffic_value.push({
          name: info.label,
          data: info.value,
        });
      }
    });

    ApexCharts.exec("chart_outbound_traffic_id", "updateOptions", {
      xaxis: {
        categories: chart_outbound_traffic_label,
      },
      series: chart_outbound_traffic_value,
    });

    //File Interfaces
    ApexCharts.exec("chart_file_interface_id", "updateOptions", {
      xaxis: {
        categories: interface_data.chart_file_interface.label,
      },
      series: [
        {
          name: interface_data.chart_file_interface.value1.label,
          data: interface_data.chart_file_interface.value1.value,
        },
        {
          name: interface_data.chart_file_interface.value2.label,
          data: interface_data.chart_file_interface.value2.value,
        },
        {
          name: interface_data.chart_file_interface.value3.label,
          data: interface_data.chart_file_interface.value3.value,
        },
      ],
    });

    //RFC FUNCTION MODULES
    ApexCharts.exec("chart_rfc_function_id", "updateOptions", {
      xaxis: {
        categories: interface_data.chart_rfc_function.label,
      },
      series: [
        {
          name: interface_data.chart_rfc_function.value1.label,
          data: interface_data.chart_rfc_function.value1.value,
        },
        {
          name: interface_data.chart_rfc_function.value2.label,
          data: interface_data.chart_rfc_function.value2.value,
        },
        {
          name: interface_data.chart_rfc_function.value3.label,
          data: interface_data.chart_rfc_function.value3.value,
        },
      ],
    });

    //Odata Service
    ApexCharts.exec("chart_odata_id", "updateOptions", {
      labels: interface_data.chart_odata.label,
      series: interface_data.chart_odata.value,
    });

    //Idoc Interface Analysis
    ApexCharts.exec("chart_idoc_interface_analysis_id", "updateOptions", {
      xaxis: {
        categories: interface_data.chart_idoc_interface_analysis.label,
      },
      series: [
        {
          name: interface_data.chart_idoc_interface_analysis.value1.label,
          data: interface_data.chart_idoc_interface_analysis.value1.value,
        },
        {
          name: interface_data.chart_idoc_interface_analysis.value2.label,
          data: interface_data.chart_idoc_interface_analysis.value2.value,
        },
      ],
    });

    //RFC MODULES

    chart_rfc_modules_var_label = interface_data.chart_rfc_modules_graph.label;

    $.each(interface_data.chart_rfc_modules_graph, function (i, info) {
      if (info.label && info.value) {
        chart_rfc_module_value.push({
          name: info.label,
          data: info.value,
          type: info.type,
          yAxis: info.yAxis,
        });
      }
    });
    // System Integration
    ApexCharts.exec("system_integration_chart_id", "updateOptions", {
      xaxis: {
        categories: interface_data.system_integration_graph.label,
      },
      series: [
        {
          name: interface_data.system_integration_graph.value1.label,
          data: interface_data.system_integration_graph.value1.value,
        },
        {
          name: interface_data.system_integration_graph.value2.label,
          data: interface_data.system_integration_graph.value2.value,
        },
      ],
    });

    //RFC Function Modules
    Highcharts.chart("abap_interface_inbound_outbound", {
      title: {
        text: "",
      },
      legend: {
        itemStyle: {
          color: "rgb(55, 61, 63)",
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Helvetica, Arial, sans-serif",
        },
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: chart_rfc_modules_var_label,
      },
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: "{value}",
            style: {
              color: "black",
            },
          },
          title: {
            text: "",
            style: {
              color: "black",
            },
          },
          opposite: true,
          min: 0,
        },
        {
          // Secondary yAxis
          gridLineWidth: 1,

          title: {
            text: "",
            style: {
              color: "black",
            },
          },
          labels: {
            format: "{value}",
            style: {
              color: "black",
            },
          },
          opposite: false,
          reversedStacks: false,
        },
      ],
      plotOptions: {
        series: {
          pointWidth: 40,
          label: {
            enabled: false,
          },
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                //alert('Category: ' + this.category + ', value: ' + this.y);
                if (this.colorIndex == 0) {
                  barRFCConnection(this.category, "RFC Outbound");
                }
                if (this.colorIndex == 1) {
                  barRFCConnection(this.category, "RFC Inbound");
                }
              },
            },
          },
        },
        column: {
          stacking: "",
          dataLabels: {
            enabled: false,
            color: "white",
            style: {
              textShadow: false,
            },
          },
        },
        line: {
          dataLabels: {
            enabled: true,
            color: "black",
            style: {
              textShadow: false,
            },
          },
        },
      },
      series: chart_rfc_module_value,
    });
  },
});

// System Integration
// $.ajax({
//   type: "GET",
//   url:
//     url +
//     `db_name=${sessionStorage.getItem(
//       "DatabaseName"
//     )}&collection_name=dashboards&document_id=dashboard_overview`,
//   contentType: "application/json",
//   dataType: "json",
//   success: function (data) {
//     console.log("From Dashboard", data.data[0].system_integration_graph);
//     //System Integration
//     ApexCharts.exec("system_integration_chart_id", "updateOptions", {
//       xaxis: {
//         categories: data.data[0].system_integration_graph.label,
//       },
//       series: [
//         {
//           name: data.data[0].system_integration_graph.value1.label,
//           data: data.data[0].system_integration_graph.value1.value,
//         },
//         {
//           name: data.data[0].system_integration_graph.value2.label,
//           data: data.data[0].system_integration_graph.value2.value,
//         },
//       ],
//     });
//   },
// });

//---------------------------Interface Insight API Ends--------------------------------------------//

//---------------------------Interface Insight Graph Start--------------------------------------------//

// System Integration
var sys_int_bar_options = {
  series: [
    {
      name: "",
      data: [],
    },
    {
      name: "",
      data: [],
    },
  ],
  chart: {
    type: "bar",
    height: 344,
    stacked: true,
    id: "system_integration_chart_id",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: "40%",
    },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: [],
    title: {
      text: "",
    },
  },
  yaxis: {
    title: {
      text: "",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return " " + val;
      },
    },
  },
};

var sys_int_bar = new ApexCharts(
  document.querySelector("#sys_int_barchart"),
  sys_int_bar_options
);
sys_int_bar.render();
//Idoc Interface Analysis
var abap_idoc_interface_analysis = {
  series: [],
  chart: {
    id: "chart_idoc_interface_analysis_id",
    type: "bar",
    height: 350,
    stacked: false,
    events: {
      dataPointSelection: function (event, chartContext, config) {
        let index = config.dataPointIndex;
        let seriesIndex = config.seriesIndex;
        let categoryname = config.w.config.xaxis.categories[index];
        let seriesName = config.w.config.series[seriesIndex].name;
        barIDOCFunction(categoryname, seriesName);
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      dataLabels: {
        position: "center",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: 0,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
    },
  },
  stroke: {
    show: true,
    width: 1,
    colors: ["#fff"],
  },
  xaxis: {
    categories: [],
  },
  // yaxis: {
  //        tickAmount: 10
  //       //min: 0
  //      // max: 6,
  // }
};
var abap_idoc_interface_analysis_chart = new ApexCharts(
  document.querySelector("#abap_idoc_interface_analysis"),
  abap_idoc_interface_analysis
);
abap_idoc_interface_analysis_chart.render();

//RFC Connections
var abap_interface_rfc_function = {
  series: [],
  chart: {
    id: "chart_rfc_function_id",
    type: "bar",
    height: 350,
    stacked: true,
    events: {
      dataPointSelection: function (event, chartContext, config) {
        let index = config.dataPointIndex;
        let seriesIndex = config.seriesIndex;
        let categoryname = config.w.config.xaxis.categories[index];
        let seriesName = config.w.config.series[seriesIndex].name;
        barRFCFunctionModule(categoryname, seriesName);
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: "center",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: 0,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
    },
  },
  stroke: {
    show: true,
    width: 1,
    colors: ["#fff"],
  },
  xaxis: {
    labels: {
      width: 120,
    },
    categories: [],
  },
};
var abap_interface_rfc_function_chart = new ApexCharts(
  document.querySelector("#abap_interface_rfc_function"),
  abap_interface_rfc_function
);
abap_interface_rfc_function_chart.render();

//Odata Service
var abap_interface_odata = {
  colors: [
    "rgb(0, 143, 251)",
    "rgb(0, 227, 150)",
    "rgb(254, 176, 25)",
    "rgb(255, 69, 96)",
    "#6610f2",
    "#FF9655",
  ],
  series: [],
  labels: [],
  chart: {
    height: 350,
    type: "donut",
    id: "chart_odata_id",
    events: {
      dataPointSelection: function (event, chartContext, config) {
        let index = config.dataPointIndex;
        let categoryname = config.w.config.labels[index];
        OdataFunction(categoryname);
      },
    },
  },

  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },

  responsive: [
    {
      // breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: true,
        },
      },
    },
  ],
  legend: {
    position: "bottom",
    offsetY: 0,
    height: 30,
  },
};

var abap_interface_odata_chart = new ApexCharts(
  document.querySelector("#abap_interface_odata"),
  abap_interface_odata
);
abap_interface_odata_chart.render();

//Idoc Interface
function barIDOCFunction(xaxisValue, TypeName) {
  $("#idoc_interface_analysis_modal").modal("show");
  document.getElementById("interface_name").innerHTML =
    TypeName + " - " + xaxisValue;
  let partnername = TypeName + " - " + xaxisValue;

  document.getElementById("idoc_partnerwise_table_tbody").innerHTML = "";
  document.getElementById("idoc_message_type_table_tbody").innerHTML = "";
  document.getElementById("idoc_alltransactions_table_tbody").innerHTML = "";

  let partnerwise_list = "";
  let message_type_list = "";
  let alltransaction_list = "";

  //PartnerWise List
  $.each(interface_data.panel_partner_wise, function (i, panel_data) {
    if (panel_data["label"].toLowerCase() == partnername.toLowerCase()) {
      partnerwise_list =
        "<tr>" +
        "<td>" +
        panel_data["Partner number"] +
        "</td>" +
        "<td>" +
        panel_data["Partner Type Description"] +
        "</td>" +
        "</tr>";
      $(partnerwise_list).appendTo("#idoc_partnerwise_table_tbody");
    }
  });

  //Message Type List
  $.each(interface_data.panel_message_type, function (i, panel_data) {
    if (panel_data["label"].toLowerCase() == partnername.toLowerCase()) {
      message_type_list =
        "<tr>" +
        "<td>" +
        panel_data["Message type"] +
        "</td>" +
        "<td>" +
        panel_data["Message type text"] +
        "</td>" +
        "<td>" +
        panel_data["Basic Type"] +
        "</td>" +
        "</tr>";
      $(message_type_list).appendTo("#idoc_message_type_table_tbody");
    }
  });

  //AllTransactions List
  $.each(interface_data.panel_all_transactions, function (i, panel_data) {
    if (panel_data["label"].toLowerCase() == partnername.toLowerCase()) {
      alltransaction_list =
        "<tr>" +
        "<td>" +
        panel_data["Partner number"] +
        "</td>" +
        "<td>" +
        panel_data["Partner Type Description"] +
        "</td>" +
        "<td>" +
        panel_data["Message type"] +
        "</td>" +
        "<td>" +
        panel_data["Port"] +
        "</td>" +
        "<td>" +
        panel_data["RFC"] +
        "</td>" +
        "</tr>";
      $(alltransaction_list).appendTo("#idoc_alltransactions_table_tbody");
    }
  });
}

//RfcConnection
function barRFCConnection(xaxisValue, TypeName) {
  $("#rfc_connection_modal").modal("show");

  document.getElementById("rfc_connection_name").innerHTML =
    TypeName + " - " + xaxisValue;

  document.getElementById("table_rfc_module_tbody").innerHTML = "";
  let rfc_module_list = "";

  $.each(interface_data.panel_rfc_module, function (i, rfc_function_panel) {
    if (rfc_function_panel["Module"] == xaxisValue) {
      rfc_module_list =
        "<tr>" +
        "<td>" +
        rfc_function_panel["Module"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC FM Name"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Development Class or Package"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Development Class or Package Des"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Description"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["FM Include"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Function Group Name"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Application"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Used In Object"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Object Type"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Destination"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Dest Des"] +
        "</td>" +
        "</tr>";
      $(rfc_module_list).appendTo("#table_rfc_module_tbody");
    }
  });
}

//RFC Function MOdule
function barCustomIdoc(xaxisValue) {
  $("#rfc_custom_idoc_modal").modal("show");

  document.getElementById("rfc_custom_idoc_module_name").innerHTML = xaxisValue;
  let rfc_match_data = xaxisValue;

  document.getElementById("rfc_custom_idoc_table_tbody").innerHTML = "";
  let custom_idoc_message_list = "";

  $.each(interface_data.panel_custom_idoc_message, function (i, panel) {
    if (panel["label"].toLowerCase() == rfc_match_data.toLowerCase()) {
      custom_idoc_message_list =
        "<tr>" +
        // "<td class='text-center'>"+odata_panel['label']+"</td>"+
        "<td>" +
        panel["ObjectName"] +
        "</td>" +
        "<td>" +
        panel["DevelopmentClass"] +
        "</td>" +
        "<td>" +
        panel["DevelopmentClassDescription"] +
        "</td>" +
        "<td>" +
        panel["Author"] +
        "</td>" +
        "<td>" +
        panel["DescriptionObject"] +
        "</td>" +
        "<td>" +
        panel["Message Type"] +
        "</td>" +
        "<td>" +
        panel["ShortDescription"] +
        "</td>" +
        "</tr>";
      $(custom_idoc_message_list).appendTo("#rfc_custom_idoc_table_tbody");
    }
  });
}

//RFC Function MOdule
function barRFCFunctionModule(xaxisValue, TypeName) {
  $("#rfc_function_modal").modal("show");

  document.getElementById("rfc_function_module_name").innerHTML =
    TypeName + " - " + xaxisValue;
  let rfc_match_data = TypeName + " - " + xaxisValue;

  document.getElementById("rfc_function_table_tbody").innerHTML = "";
  let rf_function_module_list = "";

  $.each(interface_data.panel_rfc_function, function (i, rfc_function_panel) {
    if (rfc_function_panel["RFC Type Description"] == rfc_match_data) {
      rf_function_module_list =
        "<tr>" +
        "<td>" +
        rfc_function_panel["RFC Destination"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Description"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Type"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Host or IP Address"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Gateway Host"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Gateway Service"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["System Number"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Client"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Username"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["RFC Logon Language"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Trusted/Non-Trusted RFC"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Unicode/ Non-Unicode"] +
        "</td>" +
        "<td>" +
        rfc_function_panel["Load Balance"] +
        "</td>" +
        "</tr>";
      $(rf_function_module_list).appendTo("#rfc_function_table_tbody");
    }
  });
}

//OData Function
function OdataFunction(TypeName) {
  $("#odata_service_modal").modal("show");

  document.getElementById("odata_module_name").innerHTML =
    TypeName + " - ODATA Service Report";

  document.getElementById("odata_service_table_tbody").innerHTML = "";
  let odata_module_list = "";

  $.each(interface_data.panel_odata, function (i, odata_panel) {
    if (odata_panel.label == TypeName) {
      odata_module_list =
        "<tr>" +
        "<td class='text-center'>" +
        odata_panel["project"] +
        "</td>" +
        "<td class='text-center'>" +
        odata_panel["description"] +
        "</td>" +
        "<td class='text-center'>" +
        odata_panel["Entity Name"] +
        "</td>" +
        "<td class='text-center'>" +
        odata_panel["Data Provider Class"] +
        "</td>" +
        "<td class='text-center'>" +
        odata_panel["External Service Name"] +
        "</td>" +
        "<td class='text-center'>" +
        odata_panel["Object Name"] +
        "</td>" +
        "<td class='text-center'>" +
        odata_panel["Gen Art Type"] +
        "</td>" +
        "<td class='text-center'>" +
        odata_panel["Package"] +
        "</td>" +
        "</tr>";
      $(odata_module_list).appendTo("#odata_service_table_tbody");
    }
  });
}

//---------------------------Interface Insight Graph Ends--------------------------------------------//

//---------------------------Usage Analysis API Starts--------------------------------------------//
var abap_usage_analysis;
$.ajax({
  type: "GET",
  url:
    url +
    `db_name=${sessionStorage.getItem(
      "DatabaseName"
    )}&collection_name=custom_developments&document_id=custom_development_abap_usage_analysis`,
  contentType: "application/json",
  dataType: "json",
  success: function (data) {
    abap_usage_analysis = data.data[0];
    if (abap_usage_analysis && abap_usage_analysis.length == 0) {
      document.getElementById("tab-custom-usage").style.display = "none";
    } else {
      document.getElementById("tab-custom-usage").style.display = "block";
      count_abap++;
    }

    if (count_abap > 0) {
      document.getElementById("tab_abap").style.display = "block";
    }
    //ARTIFACT WISE CUSTOM OBJECT USAGE
    ApexCharts.exec(
      "chart_artifacts_wise_custom_obj_usage_id",
      "updateOptions",
      {
        xaxis: {
          categories: abap_usage_analysis.chart_artifact_wise_custom.label,
        },
        series: [
          {
            name: abap_usage_analysis.chart_artifact_wise_custom.value1.label,
            data: abap_usage_analysis.chart_artifact_wise_custom.value1.value,
          },
          {
            name: abap_usage_analysis.chart_artifact_wise_custom.value2.label,
            data: abap_usage_analysis.chart_artifact_wise_custom.value2.value,
          },
        ],
      }
    );

    //TOP 20 FREQUENTLY USED CUSTOM TRANSACTIONS
    document.getElementById(
      "usage_analysis_top_custom_transactions_tbody"
    ).innerHTML = "";
    let list_data_trans = "";

    $.each(
      abap_usage_analysis.panel_frequently_custom_transaction,
      function (i, abap_usage_analysis) {
        list_data_trans =
          "<tr>" +
          "<td class='text-left' style='padding-left: 20px;'>" +
          abap_usage_analysis.label +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          abap_usage_analysis.value +
          "</td>" +
          "</tr>";
        $(list_data_trans).appendTo(
          "#usage_analysis_top_custom_transactions_tbody"
        );
      }
    );

    //STANDARD OBJECTS VS CUSTOM OBJECTS
    //ARTIFACT WISE CUSTOM OBJECT USAGE
    ApexCharts.exec("chart_standard_vs_custom_obj_id", "updateOptions", {
      xaxis: {
        categories: abap_usage_analysis.chart_standard_custom.label,
      },
      series: [
        {
          name: abap_usage_analysis.chart_standard_custom.value1.label,
          data: abap_usage_analysis.chart_standard_custom.value1.value,
        },
        {
          name: abap_usage_analysis.chart_standard_custom.value2.label,
          data: abap_usage_analysis.chart_standard_custom.value2.value,
        },
      ],
    });

    //TOP 20 FREQUENTLY USED CUSTOM Programs
    document.getElementById(
      "usage_analysis_top_custom_programs_tbody"
    ).innerHTML = "";
    let list_data_prog = "";

    $.each(
      abap_usage_analysis.panel_frequently_custom_programs,
      function (i, abap_usage_analysis) {
        list_data_prog =
          "<tr>" +
          "<td class='text-left' style='padding-left: 20px;'>" +
          abap_usage_analysis.label +
          "</td>" +
          "<td class='' style='padding-left: 20px;'>" +
          abap_usage_analysis.value +
          "</td>";
        ("</tr>");
        $(list_data_prog).appendTo("#usage_analysis_top_custom_programs_tbody");
      }
    );

    //ARTIFACTS GRAPH i icon
    document.getElementById(
      "usage_analysis_artifacts_wise_graph_icon_tbody"
    ).innerHTML = "";
    let artifacts_icon = "";

    $.each(
      abap_usage_analysis.panel_artifact_wise_custom,
      function (i, abap_usage_analysis) {
        artifacts_icon =
          "<tr>" +
          "<td class='text-left'>" +
          abap_usage_analysis.object_type +
          "</td>" +
          "<td class='text-center'>" +
          abap_usage_analysis.inventory_count +
          "</td>" +
          "<td class='text-center'>" +
          abap_usage_analysis.usage_count +
          "</td>" +
          "<td class='text-center'>" +
          abap_usage_analysis.usage_percent +
          "</td>" +
          "</tr>";
        $(artifacts_icon).appendTo(
          "#usage_analysis_artifacts_wise_graph_icon_tbody"
        );
      }
    );
  },
});

//---------------------------Usage Analysis API Ends--------------------------------------------//
//---------------------------Usage Analysis Graphs Starts--------------------------------------------//

//standard_vs_custom
var custom_standard_vs_custom_var = {
  series: [
    {
      name: "Standard",
      data: [],
    },
    {
      name: "Custom",
      data: [],
    },
  ],
  chart: {
    id: "chart_standard_vs_custom_obj_id",
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  xaxis: {
    categories: [],
  },
  legend: {
    position: "bottom",
    // offsetY: 40
  },
  fill: {
    opacity: 1,
  },
};
var custom_standard_vs_custom_chart = new ApexCharts(
  document.querySelector("#custom_standard_vs_custom"),
  custom_standard_vs_custom_var
);
custom_standard_vs_custom_chart.render();

var custom_artifacts = {
  series: [
    {
      name: "Count in Inventory",
      data: [],
    },
    {
      name: "Count in Usage Log",
      data: [],
    },
  ],
  chart: {
    id: "chart_artifacts_wise_custom_obj_usage_id",
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    // offsetX: -6,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
    },
  },
  stroke: {
    show: true,
    width: 1,
    colors: ["#fff"],
  },
  xaxis: {
    categories: [
      "Reports",
      "Conversion - BDCs",
      "Transaction Code",
      "Classes",
      "Function Modules",
      "Dialog Programs",
    ],
  },
};
var custom_artifacts_chart = new ApexCharts(
  document.querySelector("#custom_artifacts"),
  custom_artifacts
);
custom_artifacts_chart.render();

//---------------------------Usage Analysis Graphs Ends--------------------------------------------//

//---------------------------------------ABAP ENDS-----------------------------------------------//

//TR
function barTRFunction(xaxisValue, TypeName) {
  $.each(pipo_trans_req_data, function (i, info) {
    let year_dropdown_id = document.getElementById("year_dropdown_id").value;
    if (year_dropdown_id == info.year_id) {
      $("#transport_request_modal").modal("show");

      document.getElementById("transport_name").innerHTML =
        TypeName + " - " + xaxisValue;
      let trpanelname = TypeName + " - " + xaxisValue;

      document.getElementById("tr_cts_table_tbody").innerHTML = "";
      document.getElementById("tr_file_table_tbody").innerHTML = "";
      document.getElementById("tr_object_table_tbody").innerHTML = "";

      let cts_list = "";
      let file_list = "";
      let object_list = "";

      //CTS List
      $.each(info.panel_cts, function (i, cts_data) {
        if (cts_data["label"] == trpanelname) {
          cts_list =
            "<tr>" +
            "<td>" +
            cts_data["Transport_ID_CTS"] +
            "</td>" +
            "<td>" +
            cts_data["ID_CTS_DESC"] +
            "</td>";
          ("</tr>");
          $(cts_list).appendTo("#tr_cts_table_tbody");
        }
      });

      //File List
      $.each(info.panel_file, function (i, file_data) {
        if (file_data["label"] == trpanelname) {
          file_list =
            "<tr>" +
            "<td>" +
            file_data["Transport_ID_file"] +
            "</td>" +
            "<td>" +
            file_data["ID_FILE_DESC"] +
            "</td>";
          ("</tr>");
          $(file_list).appendTo("#tr_file_table_tbody");
        }
      });

      //AllObject List
      $.each(info.panel_object_type_count, function (i, object_data) {
        if (object_data["label"] == trpanelname) {
          object_list =
            "<tr>" +
            "<td>" +
            object_data["obj_type_count_name"] +
            "</td>" +
            "<td>" +
            object_data["obj_type_count"] +
            "</td>" +
            "</tr>";
          $(object_list).appendTo("#tr_object_table_tbody");
        }
      });
    }
  });
}

//-----------------Transport Req Analysis API Ends---------------------------------//

var custom_ii_idoc = {
  series: [],
  chart: {
    type: "bar",
    height: 335,
    id: "chart_custom_idoc_message_id",
    events: {
      dataPointSelection: function (event, chartContext, config) {
        let index = config.dataPointIndex;
        let seriesIndex = config.seriesIndex;
        let categoryname = config.w.config.xaxis.categories[index];
        barCustomIdoc(categoryname);
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [],

    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  },
};
var custom_ii_idoc_chart = new ApexCharts(
  document.querySelector("#custom_ii_idoc"),
  custom_ii_idoc
);
custom_ii_idoc_chart.render();

var custom_ii_inbound = {
  series: [],
  chart: {
    height: 350,
    type: "line",
    id: "chart_inbound_traffic_id",
    stacked: true,
    toolbar: {
      show: false,
    },
  },

  stroke: {
    curve: "straight",
  },
  fill: {
    type: "solid",
    opacity: [0.35, 1],
  },
  xaxis: {
    labels: {
      rotate: -45,
      rotateAlways: true,
    },
  },
  labels: [],
  markers: {
    size: 0,
  },
  legend: {
    position: "bottom",
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + " points";
        }
        return y;
      },
    },
  },
};
var custom_ii_inbound_chart = new ApexCharts(
  document.querySelector("#custom_ii_inbound"),
  custom_ii_inbound
);
custom_ii_inbound_chart.render();

var custom_ii_outbound = {
  colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
  series: [],
  chart: {
    type: "line",
    height: 350,
    stacked: true,
    id: "chart_outbound_traffic_id",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 1.9,
    },
  },
  xaxis: {
    labels: {
      rotate: -45,
      rotateAlways: true,
    },
  },
  labels: [],
  markers: {
    size: 0,
  },
  legend: {
    position: "bottom",
  },
};
var custom_ii_outbound_chart = new ApexCharts(
  document.querySelector("#custom_ii_outbound"),
  custom_ii_outbound
);
custom_ii_outbound_chart.render();

var custom_ii_total = {
  series: [],
  chart: {
    type: "bar",
    height: 315,
    stacked: true,
    id: "chart_file_interface_id",
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  xaxis: {
    categories: [],
  },
  legend: {
    position: "bottom",
  },
  fill: {
    opacity: 1,
  },
};
var custom_ii_total_chart = new ApexCharts(
  document.querySelector("#custom_ii_total"),
  custom_ii_total
);
custom_ii_total_chart.render();

function barMonthWiseFunction(xaxisValue, TypeName) {
  $("#modal_transreq_monthwise").modal("show");
  document.getElementById("modal_transreq_monthwise").style.background =
    "rgba(23, 23, 23, 0.56)";

  document.getElementById("sub_monthwise_name").innerHTML =
    TypeName + " - " + xaxisValue;
}

function closeModal() {
  document.getElementById("modal_transreq_monthwise").style.display = "none";
}

function barChannelFunction(xaxisValue, TypeName) {
  $("#modal_communication_channel").modal("show");
  document.getElementById("modal_communication_channel").style.background =
    "rgba(23, 23, 23, 0.56)";

  document.getElementById("sub_communication_channel_name").innerHTML =
    TypeName + " - " + xaxisValue;

  let channel = TypeName + " - " + xaxisValue;
  document.getElementById("communication_channel_table_tbody").innerHTML = "";
  let communication_channel_list = "";

  $.each(
    inventory_analysis.panel_comm_channel_det,
    function (i, inventory_analysis) {
      if (inventory_analysis.label == channel) {
        communication_channel_list =
          "<tr>" +
          "<td class='text-left'>" +
          inventory_analysis.value1 +
          "</td>" +
          "<td class='text-left'>" +
          inventory_analysis.value2 +
          "</td>" +
          "<td class='text-left'>" +
          inventory_analysis.value +
          "</td>" +
          "</tr>";
        $(communication_channel_list).appendTo(
          "#communication_channel_table tbody"
        );
      }
    }
  );
}

function closeModal() {
  document.getElementById("modal_communication_channel").style.display = "none";
}

function closeModal() {
  document.getElementById("modal_sender_interface").style.display = "none";
}

function barModalFunction(labelsValue) {
  $("#modal_adapter_modules").modal("show");
  document.getElementById("modal_adapter_modules").style.background =
    "rgba(23, 23, 23, 0.56)";

  document.getElementById("sub_process_name").innerHTML = labelsValue;

  document.getElementById("adapter_table_tbody").innerHTML = "";
  let adapter_module_list = "";

  $.each(
    inventory_analysis.panel_adapter_module_det,
    function (i, inventory_analysis) {
      if (inventory_analysis.label == labelsValue) {
        adapter_module_list =
          "<tr>" +
          "<td class='text-center'>" +
          inventory_analysis.value +
          "</td>" +
          "</tr>";
        $(adapter_module_list).appendTo("#adapter_table tbody");
      }
    }
  );
}

function closeModal() {
  document.getElementById("modal_adapter_modules").style.display = "none";
}

function barComponentDetFunction(xaxisValue, TypeName) {
  $("#modal_component_det_sender_receiver").modal("show");
  document.getElementById(
    "modal_component_det_sender_receiver"
  ).style.background = "rgba(23, 23, 23, 0.56)";

  document.getElementById("sub_component_det_sender_receiver_name").innerHTML =
    TypeName + " - " + xaxisValue;

  let component = TypeName + " - " + xaxisValue;
  document.getElementById(
    "component_det_sender_receiver_table_tbody"
  ).innerHTML = "";
  let comp_dropdown_id_value = document.getElementById(
    "component_dropdown_id"
  ).value;
  let sender_receiver_comp_list = "";
  $.each(pipo_comp_det_data, function (i, pipo_comp_det_data) {
    if (comp_dropdown_id_value == pipo_comp_det_data.business_component) {
      $.each(pipo_comp_det_data.panel_sen_rec_comp_det, function (i, info) {
        if (info.label == component) {
          sender_receiver_comp_list =
            "<tr>" +
            "<td class='text-left'>" +
            info.value +
            "</td>" +
            "<td class='text-left'>" +
            info.value1 +
            "</td>" +
            "<td class='text-left'>" +
            info.value2 +
            "</td>" +
            "<td class='text-left'>" +
            info.value3 +
            "</td>" +
            "<td class='text-left'>" +
            info.value4 +
            "</td>" +
            "<td class='text-left'>" +
            info.value5 +
            "</td>" +
            "<td class='text-left'>" +
            info.value6 +
            "</td>" +
            "<td class='text-left'>" +
            info.value7 +
            "</td>" +
            "</tr>";
          $(sender_receiver_comp_list).appendTo(
            "#component_det_sender_receiver_table tbody"
          );
        }
      });
    }
  });
}
function closeModal() {
  document.getElementById("modal_component_det_sender_receiver").style.display =
    "none";
}

function barComponentFunction(xaxisValue) {
  $("#modal_component_sender_receiver").modal("show");
  document.getElementById("modal_component_sender_receiver").style.background =
    "rgba(23, 23, 23, 0.56)";

  document.getElementById("sub_component_sender_receiver_name").innerHTML =
    xaxisValue;
}
function closeModal() {
  document.getElementById("modal_component_sender_receiver").style.display =
    "none";
}

function barCompChannelFunction(xaxisValue, TypeName) {
  $("#modal_comp_communication_channel").modal("show");
  document.getElementById("modal_comp_communication_channel").style.background =
    "rgba(23, 23, 23, 0.56)";

  document.getElementById("sub_comp_communication_channel_name").innerHTML =
    TypeName + " - " + xaxisValue;

  let channel = TypeName + " - " + xaxisValue;
  document.getElementById("communication_comp_channel_table_tbody").innerHTML =
    "";
  let comp_dropdown_id_value = document.getElementById(
    "component_dropdown_id"
  ).value;
  let communication_channel_list = "";
  $.each(pipo_comp_det_data, function (i, pipo_comp_det_data) {
    if (comp_dropdown_id_value == pipo_comp_det_data.business_component) {
      $.each(pipo_comp_det_data.panel_sen_rec_channel_det, function (i, info) {
        if (info.label == channel) {
          communication_channel_list =
            "<tr>" +
            "<td class='text-left'>" +
            info.value1 +
            "</td>" +
            "<td class='text-left'>" +
            info.value2 +
            "</td>" +
            "<td class='text-left'>" +
            info.value3 +
            "</td>" +
            "</tr>";
          $(communication_channel_list).appendTo(
            "#communication_comp_channel_table tbody"
          );
        }
      });
    }
  });
}
function closeModal() {
  document.getElementById("modal_comp_communication_channel").style.display =
    "none";
}

function barCompAdapterFunction(labelsValue) {
  $("#modal_comp_adapter_modules").modal("show");
  document.getElementById("modal_comp_adapter_modules").style.background =
    "rgba(23, 23, 23, 0.56)";

  document.getElementById("sub_comp_process_name").innerHTML = labelsValue;
  let comp_dropdown_id_value = document.getElementById(
    "component_dropdown_id"
  ).value;
  document.getElementById("comp_adapter_table_tbody").innerHTML = "";
  let adapter_module_list = "";
  $.each(pipo_comp_det_data, function (i, pipo_comp_det_data) {
    if (comp_dropdown_id_value == pipo_comp_det_data.business_component) {
      $.each(pipo_comp_det_data.panel_adapter_module_det, function (i, info) {
        if (info.label == labelsValue) {
          adapter_module_list =
            "<tr>" +
            "<td class='text-center'>" +
            info.value +
            "</td>" +
            "</tr>";
          $(adapter_module_list).appendTo("#comp_adapter_table tbody");
        }
      });
    }
  });
}

function closeModal() {
  document.getElementById("modal_comp_adapter_modules").style.display = "none";
}
