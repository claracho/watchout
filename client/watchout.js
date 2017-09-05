var play = function () {
  
  var gameOptions = {
    height: 450,
    width: 700,
    enemyCount: 10
  };

  var gameBoard = d3.select(".board").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height);

  // create enemyData using enemyCount, assign index as id and random x/y positions
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

  // render enemy into the board
  var render = function (enemyData) {
    gameBoard.append("circle").data([enemyData.id])
      .attr("class", "enemy")
      .attr("cx", enemyData.x)
      .attr("cy", enemyData.y)
      .attr("r", 10)
      .attr("fill", "red");
  };

  // move enemies into new random x/y positions every 1 second
  var move = function () {
    gameBoard.selectAll("circle").transition().duration(1000)
      .attr("cx", function (d) { return Math.random() * gameOptions.width; })
      .attr("cy", function (d) { return Math.random() * gameOptions.height; });
  };



  var enemiesData = createEnemies();

  enemiesData.forEach(function(enemyData) {
    render(enemyData);
  });

  setInterval(move, 1000);

};

play();
