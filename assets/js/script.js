//create variable for API key for weather API
var APIkey = "929102aeeecc47cdcf4b64fb757bbffc";
var city = "Yakima"

//Grabs the current date and time
var date = moment().format('dddd, MMMM Do YYYY');
var currentDateandTime = moment().format('YYYY-MM-DD HH:MM:SS')

//array for previously searched cities
var searchCity = [];
//save the search and add to array
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.searchBtnPar').siblings('.searchText').val().trim();
	if (city === "") {
		return;
	};
	searchCity.push(city);

	localStorage.setItem('city', JSON.stringify(searchCity));
	fiveDayForcastEl.empty();
    //call search history function
	searchHistory();
    //call current weather function
	currentWeather();
});

//Will create buttons based on search history 
var searchCityEl = $('.searchCity');
function searchHistory() {
	searchCityEl.empty();

	for (let i = 0; i < searchCity.length; i++) {

		//variables for creating new rows/buttons for city search
        var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${searchCity[i]}`)
        //add styling/class to new rows/buttons

		rowEl.addClass('row searchBtnRow');
		btnEl.addClass('btn btn-outline-secondary searchBtn');
		btnEl.attr('type', 'button');

		searchCityEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	//Past search buttons return results
	$('.searchBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveDayForcastEl.empty();
		currentWeather();
	});
};

var currentDay = $('.currentDay')
//Applies the weather data to the current day card and then shows the five day forecast
function currentWeather() {
	var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`;

	$(currentDay).empty();

	$.ajax({
		url: currentURL,
		method: 'GET',
	}).then(function (response) {
		$('.currentCityName').text(response.name);
		$('.currentDate').text(date);
		//put icon images on page
		$('.images').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// create p element for Temperature and append info on page
		var tempEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		currentDay.append(tempEl);
		//Humidity
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		currentDay.append(pElHumid);
		//Wind Speed
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		currentDay.append(pElWind);
		//Set the lat and long from the searched city
		var lon = response.coord.lon;
		console.log(lon);
		var lat = response.coord.lat;
		console.log(lat);

	});
	getFiveDayForecast();
};

var fiveDayForcastEl = $('.fiveDayForecast');

function getFiveDayForecast() {
	var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIkey}`;

	$.ajax({
		url: fiveDayURL,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var userWeather = [];
		//Made a object that would allow for easier data read
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				icon: value.weather[0].icon,
				humidity: value.main.humidity,
                wind_speed: value.wind.speed
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				userWeather.push(testObj);
			}
		})
		//Inject the cards to the screen 
		for (let i = 0; i < userWeather.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveDayForcastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${userWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${userWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Temp
			var pElTemp = $('<p>').text(`Temperature: ${userWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			//Humidity
			var pElHumid = $('<p>').text(`Humidity: ${userWeather[i].humidity} %`);
			divElBody.append(pElHumid);
            //Wind Speed
			var pElWind = $('<p>').text(`Wind Speed: ${userWeather[i].wind_speed} MPH`);
			divElBody.append(pElWind);

		}
	});
};

//Start page with information from Yakima
function firstLoad() {

	var searchCityStore = JSON.parse(localStorage.getItem('city'));

	if (searchCityStore !== null) {
		searchCity = searchCityStore
	}
	searchHistory();
	currentWeather();
};
// Call first load function
firstLoad();