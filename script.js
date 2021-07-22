let button = null;

searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", search);
let api_Locations = [];
locList = document.querySelector("#location-table");
let city = null;

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
      if (result.length > 2) {
        api_Locations = JSON.parse(result);
        locationChoice();
      } else {
        const headerCity = document.querySelector("#city");
        const errorNode = document.createTextNode("no result");

        headerCity.appendChild(errorNode);
      }
    })
    .catch((error) => console.log("error", error));
}

function locationChoice() {
  const choiceArea = document.querySelector("#location-table");

  api_Locations.forEach((element) => {
    let locationLine = document.createElement("li");
    locationLine.classList = "selection";
    locationLine.weatherObj = element;

    let radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "locSelection");
    radio.classList = "radio-local";

    const label = document.createElement("label");
    label.id = "selectLocation";
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
  fcSymbol.width = 60;
  fcSymbol.height = 60;
  fcSymbol.src = weatherSymbol;
  symbolColumn.appendChild(fcSymbol);

  let date = document.createElement("div");
  const dateNode = document.createTextNode(fcDate);
  date.appendChild(dateNode);

  let minTemp = document.createElement("div");
  minTemp.classList = "temp";
  const minTempNode = document.createTextNode(min);
  minTemp.appendChild(minTempNode);

  let maxTemp = document.createElement("div");
  maxTemp.classList = "temp";
  let maxTempNode = document.createTextNode(max);
  maxTemp.appendChild(maxTempNode);

  forecastArea.appendChild(symbolColumn);
  forecastArea.appendChild(date);
  forecastArea.appendChild(minTemp);
  forecastArea.appendChild(maxTemp);

  //let weaterData = getForecastData();
  //console.log("data" + weaterData);
}

locList.addEventListener("change", function (e) {
  const newChoice = e.target.checked;
  console.log(newChoice);
  city = e.target.parentElement.weatherObj;
  console.log(city);
});

function getForecastData(e) {
  let index = null;

  const headerCity = document.querySelector("#city");
  const cityNode = document.createTextNode(city.title);
  const table = document.querySelector("#forecast-area");

  headerCity.appendChild(cityNode);
  headerCity.appendChild(table);

  console.log(city.woeid);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://www.metaweather.com/api/location/" + city.woeid,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      const forecast = JSON.parse(result).consolidated_weather;
      console.log(Math.round(forecast[0].min_temp));
      console.log(Math.round(forecast[0].max_temp));
      console.log(forecast[0].applicable_date);
      const fcSymbol =
        "https://www.metaweather.com/static/img/weather/" +
        forecast[0].weather_state_abbr +
        ".svg";
      console.log(fcSymbol);
      getForecastLine(
        fcSymbol,
        forecast[0].applicable_date,
        Math.round(forecast[0].min_temp),
        Math.round(forecast[0].max_temp)
      );
    })
    .catch((error) => console.log("error", error));
}
