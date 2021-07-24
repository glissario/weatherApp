const searchArea = document.querySelector("#search");
const choiceArea = document.querySelector("#choice");
const forecastArea = document.querySelector("#forecast");

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

homeButton = document.getElementById("home");
homeButton.addEventListener("click", function (e) {
  location.reload();
});

searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", search);

addInput = document.getElementById("new-location-Input");
console.log(addInput);
addInput.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    search();
  }
});

function search() {
  // visibility:
  choiceArea.style.display = "grid";
  searchArea.style.display = "none";

  const searchL = document.querySelector("#new-location-Input");

  findLocation(searchL.value);
}

function findLocation(element) {
  var requestOptions = {
    method: "GET",

    redirect: "follow",
  };

  fetch(
    "https://www.metaweather.com/api/location/search/?query=" + element,
    requestOptions
  )
    .then((response) => response.text())
    .then(function (result) {
      //locationStringToArray(result);

      if (result.length > 3) {
        api_Locations = JSON.parse(result);
        locationChoice();
      } else {
        const errorNode = document.createTextNode("no result");
        errorMessage = document.createElement("label");
        errorMessage.appendChild(errorNode);
        errorMessage.classList = "error-message";
        choiceArea.appendChild(errorMessage);
        //searchArea.style.display = "block";
        //choiceArea.style.display = "none";
      }
    })
    .catch((error) => console.log("error", error));
}

function locationChoice() {
  const choiceArea = document.querySelector("#location-table");

  api_Locations.forEach((element) => {
    let locationLabel = document.createElement("label");
    locationLabel.classList = "selection";
    locationLabel.weatherObj = element;

    let selPick = document.createElement("div");
    selPick.classList = "pick";

    let selLink = document.createElement("a");
    selLink.id = "test";
    let selSpan = document.createElement("span");
    selSpan.id = "locNode";
    selSpan.setAttribute("for", "test");

    const locationNode = element.title;

    const node = document.createTextNode(locationNode);

    selPick.appendChild(selLink);
    selLink.appendChild(selSpan);
    selSpan.appendChild(node);

    locationLabel.appendChild(selLink);
    choiceArea.appendChild(locationLabel);
  });
}

/*forecast*/

const locTable = document.querySelector("#location-table");
locTable.addEventListener("click", function (e) {
  let parentElement = e.target.parentElement.weatherObj;

  if ("locNode" === e.target.id) {
    parentElement = e.target.parentElement;
    parentElement = parentElement.parentElement.weatherObj;
  }
  getForecastData(parentElement);
});

function getForecastData(city) {
  let index = null;
  forecastArea.style.display = "grid";
  choiceArea.style.display = "none";

  const headerCity = document.querySelector("#city");
  const cityNode = document.createTextNode(city.title);
  const table = document.querySelector("#forecast-area");

  headerCity.appendChild(cityNode);
  headerCity.appendChild(table);

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
      const fcSymbol =
        "https://www.metaweather.com/static/img/weather/" +
        forecast[0].weather_state_abbr +
        ".svg";
      //console.log(fcSymbol);
      getForecastLine(
        fcSymbol,
        forecast[0].applicable_date,
        Math.round(forecast[0].min_temp),
        Math.round(forecast[0].max_temp)
      );
    })
    .catch((error) => console.log("error", error));
}

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
}
