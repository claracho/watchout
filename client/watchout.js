var play = function () {
  
  // adjustable game options
  var gameOptions = {
    height: 675,
    width: 1200,
    enemyCount: 10
  };

  // create game board
  var gameBoard = d3.select(".board").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height)
    .style("background-image", "url(\"space.jpg\")");

  // function that drags the selection by making its x/y position equal to event x/y position
  var dragMove = function() {
    d3.select(this)
      .attr("x", d3.event.x)
      .attr("y", d3.event.y);
  };

  // create player, enable drag
  var player = gameBoard.append("image")
    .attr("class", "player")
    .attr("x", gameOptions.width / 2)
    .attr("y", gameOptions.height / 2)
    .attr("width", 60)
    .attr("height", 60)
    .attr("href", "kitten.png")
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
    gameBoard.append("image").data([enemyData.id])
      .attr("class", "enemy")
      .attr("x", enemyData.x)
      .attr("y", enemyData.y)
      .attr("width", 20)
      .attr("height", 20)
      .attr("href", "asteroid.png");
  };

  // check for collision
  // heavily adopted from reference implementation at http://latentflip.com/LearningD3/collider/
  var checkCollision = function (enemy) {
    // assume circular shape of player & enemy
    // radiusSum is sum of player radius and enemy radius
    // for convenience sake, we assume radius of width / 2
    var player = d3.select(".player");
    var radiusSum = player.attr("width") / 2 + enemy.attr("width") / 2;
    var xDiff = parseFloat(enemy.attr("x")) - parseFloat(player.attr("x"));
    var yDiff = parseFloat(enemy.attr("y")) - parseFloat(player.attr("y"));
    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (separation < radiusSum) {
      console.log('collision');
      // on collision
      // update score
      // gameBoard.transition().duration(50).style("background-color", "red");
      // gameBoard.transition().duration(50).style("background-image", "url(\"space.jpg\")");
    }
  };


  // function that moves enemies into new random x/y positions over t interval
  // in addition, at each interval, check collision
  // heavily adopted from reference implementation at http://latentflip.com/LearningD3/collider/
  var moveWithCollision = function () {
    var enemy = d3.select(this);
    
    var start = {
      x: parseFloat(enemy.attr("x")),
      y: parseFloat(enemy.attr("y"))
    };
    var end = {
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height
    };

    return function(t) {
      enemy.attr("x", start.x + t * (end.x - start.x))
        .attr("y", start.y + t * (end.y - start.y));
      // check for collision 
      checkCollision(enemy);
    };
  };


  // function that moves enemies into new random x/y positions every 1 second
  var move = function () {
    gameBoard.selectAll(".enemy").transition().duration(1000)
      .tween("moveWithCollision", moveWithCollision);
  };

  // old version of move
  // var move = function () {
  //   gameBoard.selectAll(".enemy").transition().duration(1000)
  //     .attr("x", function (d) { return Math.random() * gameOptions.width; })
  //     .attr("y", function (d) { return Math.random() * gameOptions.height; });
  // };


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
