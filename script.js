let button = null;

searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", search);
let api_Locations = [];

class Locations {
  constructor(title, type, woeid, latt_long) {
    this.title = title;
    this.type = type;
    this.woeid = woeid;
    this.latt_long = latt_long;
  }
}

function search() {
  const searchL = document.querySelector("#newLocationInput");
  findLocation(searchL.value);
}

function findLocation(element) {
  var requestOptions = {
    method: "GET",

    redirect: "follow",
  };

  fetch(
    "http://www.metaweather.com/api/location/search/?query=" + element,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      //locationStringToArray(result);
      api_Locations = JSON.parse(result);
      locationChoice();
    })
    .catch((error) => console.log("error", error));
}

function locationChoice() {
  const choiceArea = document.querySelector("#location-selection");
  api_Locations.forEach((element) => {
    let locationLine = document.createElement("li");
    locationLine.classList = "selection";

    let radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.classList = "radio-local";

    const label = document.createElement("label");
    const locationNode = element.title;
    const node = document.createTextNode(locationNode);

    label.appendChild(node);
    locationLine.appendChild(radio);
    locationLine.appendChild(label);
    choiceArea.appendChild(locationLine);
  });
}

/*forecast*/

const forecastButton = document.querySelector("#choose-button");
forecastButton.addEventListener("click", getForecastData);
console.log(forecastButton);

function getForecastLine(weatherSymbol, fcDate, min, max) {
  const forecastArea = document.querySelector("#forecast-area");

  let symbolColumn = document.createElement("div");
  let fcSymbol = document.createElement("IMG");
  fcSymbol.width = 40;
  fcSymbol.height = 40;
  fcSymbol.src = weatherSymbol;
  //let fcSymbol = document.images[weatherSymbol];
  //console.log(fcSymbol);
  //fcSymbol.appendChild(weatherSymbol);
  symbolColumn.appendChild(fcSymbol);

  let date = document.createElement("div");
  const dateNode = document.createTextNode(fcDate);
  date.appendChild(dateNode);

  let minTemp = document.createElement("div");
  const minTempNode = document.createTextNode(min);
  minTemp.appendChild(minTempNode);

  let maxTemp = document.createElement("div");
  let maxTempNode = document.createTextNode(max);
  maxTemp.appendChild(maxTempNode);

  forecastArea.appendChild(symbolColumn);
  forecastArea.appendChild(date);
  forecastArea.appendChild(minTemp);
  forecastArea.appendChild(maxTemp);

  //let weaterData = getForecastData();
  //console.log("data" + weaterData);
}

//getForecastData();

function getForecastData() {
  var raw = "";

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("https://www.metaweather.com/api/location/44418/", requestOptions)
    .then((response) => response.text())
    .then(function (result) {
      const forecast = JSON.parse(result).consolidated_weather;
      console.log(forecast[0].min_temp);
      console.log(forecast[0].max_temp);
      console.log(forecast[0].applicable_date);
      const fcSymbol =
        "https://www.metaweather.com/static/img/weather/" +
        forecast[0].weather_state_abbr +
        ".svg";
      console.log(fcSymbol);
      getForecastLine(
        fcSymbol,
        forecast[0].applicable_date,
        forecast[0].min_temp,
        forecast[0].max_temp
      );
    })
    .catch((error) => console.log("error", error));
}

function getSymbol() {}
