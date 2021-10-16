document.getElementById("weatherSubmit").addEventListener("click", function(event) {
  event.preventDefault();

  const value = document.getElementById("cityInput").value

  const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value
    + ",US&units=imperial" + "&APPID=bf298f44ca4cb41a30b03f0d85ff9fa3";

  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      let results = "";
      results += '<h2>Today\'s Weather in ' + json.name + "</h2>";
      for (let i=0; i < json.weather.length; i++) {
	       results += '<img src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
      }
      results += '<h2>' + json.main.temp + " &deg;F</h2>"
      results += '<p>High: ' + json.main.temp_max + ' &deg;F</p>'
      results += '<p>Low: ' + json.wind.temp_min + ' &deg;F</p>'
      results += '<p>Wind Speed: ' + json.wind.speed + ' mph</p>'
      results += "<p>"
      for (let i=0; i < json.weather.length; i++) {
	       results += json.weather[i].description
	       if (i !== json.weather.length - 1)
	       results += ", "
      }
      results += "</p>";
      document.getElementById("weatherResults").innerHTML = results;
    });
});

document.getElementById("forecastSubmit").addEventListener("click", function(event) {
  event.preventDefault();

  const value = document.getElementById("cityInput").value

  const url2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + value
    + ", US&units=imperial" + "&APPID=bf298f44ca4cb41a30b03f0d85ff9fa3";

  fetch(url2)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      var container = document.getElementById("grid");

      for (let i=0; i < json.list.length; i++) {
        var cell = document.createElement("div");
        cell.setAttribute("id", "child");
        let forecast = "";
        forecast += "<h2>" + moment(json.list[i].dt_txt).format('MMMM Do YYYY, h:mm:ss a') + "</h2>";
        forecast += '<p>Temperature: ' + json.list[i].main.temp + " &deg;F</p>";
        forecast += '<p>Cloudiness: ' + json.list[i].clouds.all + " %</p>";
        forecast += '<img src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>'
        cell.innerHTML = forecast;
        container.appendChild(cell);
      }
    });
});
