var play = function () {
  
  // adjustable game options
  var gameOptions = {
    height: 450,
    width: 700,
    enemyCount: 10
  };

  // create game board
  var gameBoard = d3.select(".board").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height);

  // function that drags the selection by making its x/y position equal to event x/y position
  var dragMove = function() {
    d3.select(this)
      .attr("cx", d3.event.x)
      .attr("cy", d3.event.y);
  };

  // create player, enable drag
  var player = gameBoard.append("circle")
    .attr("class", "player")
    .attr("cx", gameOptions.width / 2)
    .attr("cy", gameOptions.height / 2)
    .attr("r", 10)
    .attr("fill", "blue")
    .call(d3.behavior.drag().on("drag", dragMove));

  // function that creates enemies using enemyCount, assign index as id and random x/y positions
  var createEnemies = function () {
    var enemiesData = [];
    for (var i = 0; i < gameOptions.enemyCount; i++) {
      enemiesData.push({
        id: i,
        x: Math.random() * gameOptions.width,
        y: Math.random() * gameOptions.height
      });
    }
    return enemiesData;
  };

  // function that renders enemy into the board
  var render = function (enemyData) {
    gameBoard.append("circle").data([enemyData.id])
      .attr("class", "enemy")
      .attr("cx", enemyData.x)
      .attr("cy", enemyData.y)
      .attr("r", 10)
      .attr("fill", "red");
  };

  // function that moves enemies into new random x/y positions every 1 second
  var move = function () {
    gameBoard.selectAll(".enemy").transition().duration(1000)
      .attr("cx", function (d) { return Math.random() * gameOptions.width; })
      .attr("cy", function (d) { return Math.random() * gameOptions.height; });
  };

  // create enemies
  var enemiesData = createEnemies();

  // render enemies
  enemiesData.forEach(function(enemyData) {
    render(enemyData);
  });

  // move enemies to new random positions every second
  setInterval(move, 1000);

};

play();
