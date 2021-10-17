document.getElementById("playerSubmit").addEventListener("click", function(event) {
  event.preventDefault();
  document.getElementById("playerResults").innerHTML = "";
  document.getElementById("playerInfo").innerHTML = "";
  document.getElementById("playerLogo").innerHTML = "";
  document.getElementById("playerStats").innerHTML = "";

  const name = document.getElementById("playerInput").value
  const url = `https://www.balldontlie.io/api/v1/players?per_page=100&search=${name}`

  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      if(json.meta.total_count == 1) {
        //just one result
        getPlayer(json.data[0].id);
      } else if (json.meta.total_count > 1) {
        //multiple results
        let para = document.createElement("p");
        para.innerHTML = "Looks like more than one player fits that description<br>" +
                          "Please choose one of the following:";
        document.getElementById("playerResults").appendChild(para);

        for (let i = 0; i < json.data.length; i++) {
          let btn = document.createElement("button");
          btn.innerHTML = json.data[i].first_name + " " + json.data[i].last_name;
          btn.id = "playerListItem";
          btn.type = "submit";
          btn.addEventListener("click", function () {
            getPlayer(json.data[i].id);
          });
          document.getElementById("playerResults").appendChild(btn);
        }
      } else {
        let para = document.createElement("p");
        para.innerHTML = "Looks like no players match that name<br>Please Try Again!";
        document.getElementById("playerResults").appendChild(para);
      }
    });
});

async function getPlayer(id) {
  document.getElementById("playerResults").innerHTML = "";
  const url = `https://www.balldontlie.io/api/v1/players/${id}`

  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      //Create the Player Display
      let name = document.createElement("h1");
      name.innerHTML = json.first_name + " " + json.last_name + " (" + json.position + ")";
      document.getElementById("playerInfo").appendChild(name);

      let height = document.createElement("h3");
      height.innerHTML = "Height: " + json.height_feet + "\' "+ json.height_inches + "\" " +
                         "Weight: " + json.weight_pounds + " lbs.";
      document.getElementById("playerInfo").appendChild(height);

      let team = document.createElement("h2");
      team.innerHTML = json.team.full_name;
      document.getElementById("playerInfo").appendChild(team);

      let logo = document.createElement("img");
      logo.src = "/images/" + json.team.abbreviation + ".png"
      document.getElementById("playerLogo").appendChild(logo);

      getStats(id);
  });
}

async function getStats(id) {

  const url = 'https://www.balldontlie.io/api/v1/season_averages?season=2020&player_ids[]=' + id

  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      if (!Object.keys(json.data).length) {
        let noResults = document.createElement("h3");
        noResults.innerHTML = "This player did not play any games during the 2020 Season";
        document.getElementById("playerStats").appendChild(noResults);
      } else {
        //Create the Stats Table
        let statsTitle = document.createElement("h3");
        statsTitle.innerHTML = "He played  " + json.data[0].games_played + " games during the 2020 Season";
        document.getElementById("playerStats").appendChild(statsTitle);

        let table = document.createElement("table");
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        let headers = document.createElement("tr");
        let stats = document.createElement("tr");

        for (let property in json.data[0]) {
          if (property == "games_played" || property == "player_id" || property == "season") {
            continue;
          }
          header = document.createElement("th");
          header.innerHTML = property;
          headers.appendChild(header);

          stat = document.createElement("td");
          stat.innerHTML = json.data[0][property];
          stats.appendChild(stat);
        }
        thead.appendChild(headers)
        tbody.appendChild(stats)

        table.appendChild(thead);
        table.appendChild(tbody);

        document.getElementById("playerStats").appendChild(table);
      }
  });
}
