var map, marker;
var gmarkers = [];
let clientParam = "client=Profiler2-Siemens";

var indexPageData = [
  {
    client_name: "SIEMENS",
    systems: [
      {
        system: "U4Q",
        country: "Germany",
        lat: 51.1657,
        lng: 10.4515,
        cloud_url: `${fe_url}custom_developments.html?${encodeURIComponent(
          clientParam
        )}`,
        icon: "cogs",
      },
    ],
  },
];

const params = new URLSearchParams(window.location.search);
displaySystemData(params.get("client_name"));

function displaySystemData(client) {
  for (i = 0; i < gmarkers.length; i++) {
    gmarkers[i].setMap(null);
  }
  for (let clientDetail of indexPageData) {
    if (clientDetail.client_name == client) {
      document.getElementById(
        "pageTilte"
      ).innerHTML = `<span class="fa fa-desktop">&nbsp;&nbsp;</span>SAP SYSTEMS OF ${client} </i>`;
      let modalBody = "";
      for (let systemData of clientDetail.systems) {
        modalBody =
          modalBody +
          `<a
                                href=${systemData.cloud_url}>
                                <div style="cursor: pointer;">
                                    <div class="card border-primary shadow-lg mb-3 rounded">
                                        <div class="card-header" style="min-height: 100px;">
                                            <div class="card-title text-info" style="font-size: 150%; padding-top: 10%;">
                                                ${systemData.system}
                                                <h5 class="card-title">${systemData.country}</h5>
                                            </div>
                                        </div>
                                        <!--<div class="card-body text-primary"> 
                                            <i class="fa fa-${systemData.icon} fa-3x system-icon"></i>
                                        </div> -->

                                    </div>
                                </div>
                            </a>`;
        setTimeout(function () {
          SetMarker(systemData.lat, systemData.lng, systemData.country);
        }, 1500);
      }

      document.getElementById("SystemData").innerHTML = modalBody;
    }
  }
}

//---------------------------------------------------------------MAP-------------------------------------------

function SetMarker(lat, long, name) {
  var latdata = parseFloat(lat);
  var longdata = parseFloat(long);

  marker = new google.maps.Marker({
    position: { lat: latdata, lng: longdata },
    map: map,
    title: name,
  });
  gmarkers.push(marker);
}

function initMap(lattitude, longitude, name) {
  var cordinates = { lat: lattitude, lng: longitude };
  var style = [
    {
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#000000",
        },
        {
          weight: 0.5,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#53a2e6",
        },
      ],
    },
  ];

  var styledMapOptions = {
    name: "siemens",
  };

  let lattitude1 = lattitude == undefined ? 28.46393564472706 : lattitude;
  let longitude1 = longitude == undefined ? 10.282384500000052 : longitude;

  var config = {
    minZoom: 1,
    maxZoom: 9,
    center: new google.maps.LatLng(lattitude1, longitude1),
    zoom: 2,
    shapes: {
      brand: {
        strokeColor: "#ffffff",
        strokeOpacity: 1,
        strokeWeight: 0.5,
        fillColor: "#c89a94",
        fillOpacity: 1,
        zIndex: 200,
      },
      origin: {
        strokeColor: "#ffffff",
        strokeOpacity: 1,
        strokeWeight: 0.5,
        fillColor: "#9b6899",
        fillOpacity: 1,
        zIndex: 200,
      },
      init: {
        strokeColor: "#ffffff",
        strokeOpacity: 1,
        strokeWeight: 0.5,
        fillColor: "#aa9f99",
        fillOpacity: 1,
        zIndex: 200,
      },
    },
  };
  var customMapType = new google.maps.StyledMapType(style, styledMapOptions);
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: config.zoom,
    center: config.center,
    mapTypeId: "siemensmap",
    disableDefaultUI: true,
    minZoom: config.minZoom,
    maxZoom: config.maxZoom,
    disableDoubleClickZoom: false,
  });
  map.mapTypes.set("siemensmap", customMapType);
}
