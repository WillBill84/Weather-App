var APIkey = 'f9f10b2705e5382c2268b1d28a40cbdf';
var showWeatherCurrent = document.querySelector("#showWeatherCurrent");
var errorMsg = document.querySelector("#errorMsg");
var todaysDate = document.querySelector(".todaysDate");
let storeageArray = [];

// display current date and time and update every second.
var update = function() {
todaysDate.innerHTML = moment().format('dddd, Do MMMM, h:mm a');

}
setInterval(update, 1000);


// load a default location
CurrentWeather("Mornington");
WeatherForecast("Mornington");



// get UV index
var getUvIndex = function(lat,lon){
  var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`
  fetch(apiURL)
  .then(function(response){
      response.json().then(function(data){
          displayUvIndex(data)
       // console.log(data)
      });
  });

}

// UV index display function
var displayUvIndex = function(index){
  // create element and load uv value
  var uvIndexEl = document.createElement("span");

  uvIndexEl.classList = "uvList"

  uvIndexValue = document.createElement("span")

  uvIndexValue.textContent = index.value

  // add class to change colors based on number levels.
  if (index.value <=2) {
      uvIndexValue.classList = "low"
  }

  else if (index.value >2 && index.value<=8) {
      uvIndexValue.classList = "moderate "
  }

  else if (index.value >8) {
      uvIndexValue.classList = "severe"
  };

  uvIndexEl.appendChild(uvIndexValue);

// append uvindex to current weather element
  showWeatherCurrent.appendChild(uvIndexEl);
}







function CurrentWeather(city) {
// load the current weather for location on search submit


/* $(document).ready(function() {
    $("#getWeatherForcast").click(function(){
        var city = $("#city").val(); 
 */
        
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather',
            dataType: 'json',
            type: 'GET',
            data: {
              q:city, 
              appid: APIkey, 
              units: 'metric'
            },
            
            success: function(data) {

         // console.log('Received data:', data) 
            
              // getting the latitude and longitude for the UV data
              var lat = data.coord.lat;
              var lon = data.coord.lon;
              console.log(lat);
              console.log(lon);

              getUvIndex(lat,lon)

              
              
                var forcast = '';
                $.each(data.weather, function(index, val) {

                  forcast += 

                    "<img src=https://openweathermap.org/img/wn/" + val.icon + "@2x.png>"

                    +'<h3>' + data.name + "</h3>"

                    +'<span>'+ val.description + "</span>"
                    
                    +'<h2>'+ Math.round(data.main.temp) + "" + "°" + "</h2>"
                    

                    +'<div>' + "Humidity" + '<h4>'+ data.main.humidity + "</h4>" + "</div>"

                    +'<div>' + "Wind Speed" + '<h4>'+ data.wind.speed + "</h4>" + "</div>"
                    
                    +'<p>' + "UV Level" + "</p>"

                    
                });
    
                $("#showWeatherCurrent").html(forcast);
           
               
            }

          
        });

    };




// load the 5 day weather for location on search submit
function WeatherForecast(city) {

/* $(document).ready(function() {
    $("#getWeatherForcast").click(function(){

  var city = $("#city").val(); */

var urlForecast = "https://api.openweathermap.org/data/2.5/forecast";
$.ajax({

  url: urlForecast,  
  dataType: "json",
  type: "GET",
  data: {
    q: city,
    appid: APIkey,
    units: "metric",
  /*   cnt: "40" */
  },

  

  success: function(data) {

  console.log('Received data:', data) 

    var forcast = "";
  
    $.each(data.list, function(index, val) {

      if (!data.list[index].dt_txt.includes("3:00:00")) {
        return;

    }


    var forecastDate = new Date(data.list[index].dt*1000).toLocaleString("en-us", {
      weekday: "long"
  });

  forcast += "<div>" 
  forcast += "<img src='https://openweathermap.org/img/wn/" + val.weather[0].icon + "@2x.png'>" 

  forcast += "<b>" + forecastDate + "</b>" 

  forcast += "<h3>" + Math.round(val.main.temp) + "&deg" + "</h3>" 

  forcast += "<span>" + val.weather[0].description + "</span>";
  forcast += "</div>" 

  });
    
    $("#showWeatherForcast").html(forcast);
    
  }
  
});

};




// add searches to a list
$("#getWeatherForcast").click(function(list){
/* function myFunction(list){ */
    var text = "";
    var inputs = document.querySelectorAll("input[type=text]");
    for (var i = 0; i < inputs.length; i++) {
        text += inputs[i].value;
    }

  
    var li = document.createElement("li");
    var node = document.createTextNode(text);
    li.appendChild(node);
    document.querySelector(".list").appendChild(li);


});





// get weather on click
$("#getWeatherForcast").click(function(){


  try { 
  // get the input value
  var city = $("#city").val();

  storeageArray.push(city);
  storeageArray = [...new Set(storeageArray)];

  // add the input value to the functions and run
  CurrentWeather(city);
  WeatherForecast(city);

  if(city == "") throw "Please enter a location";
  if(!isNaN(city)) throw "Must be a location name!";
  
  localStorage.setItem("cities", JSON.stringify(storeageArray));

  }
  
  catch(err) {
    $("#errorMsg").fadeIn(200).fadeOut(1500);
    errorMsg.innerHTML = "" + err;
  }

});





$(document).ready(function () {
  // if localstorage has "cities" load
  if (localStorage.getItem("cities")) {
       // get items 
       storeageArray = localStorage.getItem("cities", JSON.stringify(storeageArray));
       //push to storeage array
       storeageArray = JSON.parse(storeageArray);

       for (var i = 0; i < storeageArray.length; i++) {
        
        cityListItem = $("<a>").attr({
          class: "list-group-item",
          href: "#"
      });

      // append storage to list
      cityListItem.text(storeageArray[i]);
      $(".list").append(cityListItem);

      /*  $(".list").text(storeageArray[i]); */

       }

      }

    });
       

    $(document).on("click", ".list-group-item", function (event) {
      CurrentWeather(event.currentTarget.innerText);
      WeatherForecast(event.currentTarget.innerText);
    
    })



// make list clickable and load weather functions
$(document).on("click", ".list li", function (event) {
  console.log(event.currentTarget.innerText);
  
  CurrentWeather(event.currentTarget.innerText);
  WeatherForecast(event.currentTarget.innerText);

})

// search input works if enter is pressed
$("#city").keypress(function () {
  if (event.keyCode == 13)
  $("#getWeatherForcast").click();
});


