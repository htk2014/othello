enchant();

window.onload = function() {
  var width = 1000;
  var height = 600;
  var game = new Game(width, height);
  game.fps = 37;
  //game.fps = 5;

  game.preload
  (
    './img/othello.png');


  game.onload = function() {

    var selectLevelScene = function() {
      var scene = new Scene();
      scene.backgroundColor = '#fc800';
      var arr = new Array(5);
      //make buttons
      for (i = 0;i<=4;i++){
        eval('var button'+i+' = new Button("level"+('+i+'+1),"blue");\n'
             +'button'+i+'.scaleX = 2.5;\n'
             +'button'+i+'.scaleY = 2.0;\n'
             +'button'+i+'.moveTo(380,90+('+i+'*80));\n'
             +'button'+i+'.ontouchend = function(){\n'
             +'game.replaceScene(othelloScene('+(i+1)+'));\n'
             +'};\n'
             +'scene.addChild(button'+i+');\n'
            );
      }
      return scene;
    };

    var othelloScene = function(level) {
      var scene = new Scene();
      scene.backgroundColor = '#555';
      var sprite = new Array();
      //set image
      for(var i=1; i<=8; i++){
        sprite[i] = new Array();
        for(var j=1; j<=8; j++){
          sprite[i][j] = new Sprite(32,32);
          sprite[i][j].image = game.assets['./img/othello.png'];
          sprite[i][j].frame = 0;
          sprite[i][j].y = i*63.9;
          sprite[i][j].x = 170+j*63.9;
          sprite[i][j].scaleY = 2;
          sprite[i][j].scaleX = 2;
          scene.addChild(sprite[i][j]);
        }
      }

      //game result label(win or lose)
      var gameResult = new Label();
      gameResult.textAlign = 'left';
      gameResult.color = '#ffffff';
      gameResult.moveTo(400,5);
      gameResult.width = 800;
      gameResult.font = '40px sans-serif';
      gameResult.color = "#ff7f50";


      var othello = new Othello(level);
      othello.viewGameResultFn = function(blackCnt,whiteCnt){
        window.setTimeout(
          function(){
            scene.addChild(gameResult);
            //win
            if(blackCnt>whiteCnt){
              gameResult.text = "You win";
            }
            //lose
            else if(whiteCnt>blackCnt){
              gameResult.text = "You lose";
            }

              //back to select scene
            window.setTimeout(function(){

              game.replaceScene(selectLevelScene());},3000 );
          }
          ,1000);
      };

      //player action
      scene.addEventListener('touchend',function(e) {
          othello.player(e);
      });

      scene.addEventListener('enterframe', function(e) {
        //cpu action
        /*
        if(othello.currentColor = white){
          othello.cpu();
        }
        */
        //GUI update
        for(var i=1; i<=8; i++){
          for(var j=1; j<=8; j++){
            sprite[i][j].frame = othello.othelloBoard[i][j];
          }
        }
      });

      return scene;
    };

    //go to title scene
    game.replaceScene(selectLevelScene());
  }

  game.start();

};
