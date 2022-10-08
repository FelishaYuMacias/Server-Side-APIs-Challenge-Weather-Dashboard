console.log ("linked")
//create variable for API key for weather API
var APIKey = "929102aeeecc47cdcf4b64fb757bbffc"

//create variables for lat and lon so we can search for those cities
var lat;
var lon;

//create a Query URL to make the API call - 
var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

//make the API call using fetch

// fetch(queryURL)

// when city is entered and button is pushed
    //city info is saved in local storage
    //a button is created and put in a list with city info attached
    //city can be removed with 