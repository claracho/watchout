var play = function () {
  
  // adjustable game options
  var gameOptions = {
    height: 675,
    width: 1200,
    enemyCount: 5
  };

  // score
  var gameStats = {
    collisionCount: 0,
    score: 0,
    bestScore: 0
  };


  // boolean checker for collision
  var collisionThisRound = false;

  // create game board
  var gameBoard = d3.select(".board").append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height)
    .style("background-image", "url(\"space.jpg\")");
    // .style("background-color", "black");

  // function that drags the selection by making its x/y position equal to event x/y position
  var dragMove = function() {
    var player = d3.select(this);
    player
      .attr("x", d3.event.x - player.attr("width") / 2)
      .attr("y", d3.event.y - player.attr("height") / 2);
  };

  // create player, enable drag
  var player = gameBoard.append("image")
    .attr("class", "player")
    .attr("x", gameOptions.width / 2)
    .attr("y", gameOptions.height / 2)
    .attr("width", 100)
    .attr("height", 100)
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
      .attr("width", 50)
      .attr("height", 50)
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
      // update collision count only once per second
      if (!collisionThisRound) {
        collisionThisRound = true;
        gameStats.collisionCount++;
        d3.select(".collisions").selectAll("span").text(gameStats.collisionCount);
        if (gameStats.score > gameStats.bestScore) {
          gameStats.bestScore = gameStats.score;
          d3.select(".highscore").selectAll("span").text(gameStats.bestScore);
        }
        gameStats.score = 0;
        d3.select(".current").selectAll("span").text(gameStats.score);
      }
      
      // background change on impact
      // gameBoard.style("background-color", "red");
      // gameBoard.transition().duration(50).style("background-color", "black");
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
    collisionThisRound = false;
    gameBoard.selectAll(".enemy").transition().duration(1000)
      .tween("moveWithCollision", moveWithCollision);
  };

  // old version of move
  // var move = function () {
  //   gameBoard.selectAll(".enemy").transition().duration(1000)
  //     .attr("x", function (d) { return Math.random() * gameOptions.width; })
  //     .attr("y", function (d) { return Math.random() * gameOptions.height; });
  // };

  var increaseScore = function() {
    gameStats.score++;
    d3.select(".current").selectAll("span").text(gameStats.score);
  };

  // create enemies
  var enemiesData = createEnemies();

  // render enemies
  enemiesData.forEach(function(enemyData) {
    render(enemyData);
  });

  // move enemies to new random positions every second
  setInterval(move, 1000);

  // run score, 1 pt every 100 ms
  setInterval(increaseScore, 100);

};

play();
