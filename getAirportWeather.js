"use strict";

// Please enter your API key within the parenthesis in line 4 to see the weather 
const weatherAPIKey = "API Key";
const displayBlock = document.querySelector(".weather-info");

//use hard-coded longitude and latitude as weather-api does not return
//the exact weather for specific locations like airport or zoo, etc...,
const NZMajorAirports = [
    { name: "Auckland Airport", longitude: 174.7824361, latitude: -37.0057104 },
    { name: "Wellington Airport", longitude: 174.8140358, latitude: -41.3301637 },
    { name: "Christchurch Airport", longitude: 172.5352139, latitude: -43.48763 },
    { name: "Queenstown Airport", longitude: 168.8148721, latitude: -44.8740507 },
];

const display = (result) => {
    // if the is any issue with the api call, the returned object will contain
    // the error property. In that case we will display the err message to the screen.
    // the return keyword here is to tell JS that if there is an error dont execute the code
    //below the if statement
    if (result.hasOwnProperty("error")) {
        return (displayBlock.textContent = result.error.message);
    }

    // destruct the variables from the returned object
    const {
        airport_name,
        current: {
            condition: { text: conditionStatus, icon },
            temp_c: celsiusTemp,
            wind_kph,
        },
        location: { country, name },
    } = result;

    //create HTML markup with weather info from API
    const newElem = Object.assign(document.createElement(`div`), {
        className: "wrapper",
        innerHTML: `
    <h1 class="airport-name">${airport_name}</h1>
    <h2 class="region">${name}, ${country}</h2>
    <div class="weather-info-wrapper">
        <div class="condition">
            <div class="status">${conditionStatus}</div>
            <img src="${icon}"/>
        <div>
        <div class="temperature"><span>Temperature: </span>${celsiusTemp} &deg;C</div>
        <div class="wind"><span>Wind Speed: </span>${wind_kph} kph</div>
    </div>
    `,
    });

    //append the markup to the html document
    displayBlock.appendChild(newElem);
};

//Get weather for given airport
const getWeatherByAirport = async (airport) => {
    //object destructure
    const { name, longitude, latitude } = airport;

    const result = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=${latitude},${longitude}`
    ).then((response) => {
        return response.json();
    });

    // this will show the result that we are being returned by the weather api call
    console.log(result);

    //add the airport property to the result, as the api only returns the city name
    result.airport_name = name;
    display(result);


};

//dynamic render
const printWeather = async (airports) => {
    airports.map((airport) => {
        getWeatherByAirport(airport);
    });
};

printWeather(NZMajorAirports);
