var play = function () {
  
  var gameOptions = {
    height: 450,
    width: 700,
    enemyCount: 10
  };

  var gameBoard = d3.select(".board").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height);

  // var Player = function () {
  // 	Player.prototype.path = "m 50, 50";
  // 	Player.prototype.fill = 'red';

  // 	Player.prototype.render = function(to) {
  // 	  to.append('path').attr('d', this.path).attr('fill', this.fill);
  // 	  return this;
  // 	}
  // };

  // create enemyData using enemyCount, assign id and random x and y positions
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
  }

  // render enemy into the board
  var render = function (enemyData) {
    var circle = gameBoard.append("circle").data([enemyData.id])
      .attr("class", "enemy")
      .attr("cx", enemyData.x)
      .attr("cy", enemyData.y)
      .attr("r", 10)
      .attr("fill", "red")
  }

  var enemiesData = createEnemies();

  enemiesData.forEach(function(enemyData) {
    render(enemyData);
  });

};

play();
