var black = 0;
var white = 1;
var myEmpty = 2;

function initArray (board,value){
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      board[i][j] = value;
    }
  }
}

function serchAddress (board,fun){
  var valueArray = new Array();
  var k = 0;
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      var bl = fun(board[i][j]);
      if(bl==true){
        valueArray[k] = [i,j];
        k++
      }
    }
  }
  return valueArray;
}

function returnEnemy (c){
  if(c==black)
    return white;
  else if(c==white)
    return black;
}

var serchDirs = [
  [0,-1],//left
  [0,1],//right
  [1,0],//under
  [-1,0],//top
  [1,-1],//left under
  [1,1],//righ under
  [-1,1],//right top
  [-1,-1]//left top
];

function addArray (a,b){
  var y = a[0] + b[0];
  var x = a[1] + b[1];
  return [y,x];
}

function minusArray (a,b){
  var y = a[0] - b[0];
  var x = a[1] - b[1];
  return [y,x];
}

function arraysEqual(a,b) { return !(a<b || b<a); }

function serchEmpty (board,pos,dir,enemyColor){
  var nextPos = addArray(pos,dir);
  while(true){
    var x = nextPos[0];
    var y = nextPos[1];
    var nextColor = board[x][y];
    var flag;

    if(nextColor == enemyColor){
      nextPos = addArray(nextPos,dir);
    }else if(nextColor == myEmpty){
      //return empty position and pos of can return
      flag = 1;
      break;
    }else break;
  }
  if(flag==1) return nextPos;
}

function getPlaceable (board,myColor){
  //return myColor's address
  var posLst = serchAddress(board,function(c) {if(myColor == c) return true;});
  var posArray = new Array();
  for(var k=0;k<posLst.length;k++){
    var pos = posLst[k];
    for(var d=0;d<serchDirs.length;d++){
      var dir = serchDirs[d];
      var nextPos = addArray(dir,pos);
      var enemyColor = returnEnemy(myColor);
      var y = nextPos[0];
      var x = nextPos[1];
      //serch enemyColor
      if(board[y][x]==enemyColor){
        //serchEmpty return false or infomation map
        var value = serchEmpty(board,nextPos,dir,enemyColor);
        if(value){
          //set empty position and  enemy position of returnable
          posArray.push(value);
        }
      }
    }
  }
  return posArray;
}

function initOthelloBoard (board){
  initArray(board,myEmpty);
  board[4][4] = black;
  board[5][4] = white;
  board[4][5] = white;
  board[5][5] = black;
}

function setDots (Dboard,infoArray){
  for(var i=0;i<infoArray.length;i++){
    //infoArray is returned from getPlaceable
    var info = infoArray[i];
    //empty is empty positions
    var y = info[0];
    var x = info[1];
    //set infoArray to dot board(dot board is infomation board)
    Dboard[y][x]= true;
  }
}

function serchGoal (board,y,x,myColor){
  var enemy = returnEnemy(myColor);
  var infoArray = new Array();
  for(var i=0;i<serchDirs.length;i++){
    var dir = serchDirs[i];
    var nextPos = addArray([y,x],dir);
    var nextY = nextPos[0];
    var nextX = nextPos[1];
    //serch enemy
    if(board[nextY][nextX]==enemy){
      nextPos = addArray(nextPos,dir);
      while(true){
        var nextY = nextPos[0];
        var nextX = nextPos[1];
        //when enemy,conteniue while
        if(board[nextY][nextX]==enemy){
          nextPos = addArray(nextPos,dir);
        }
        //when mycolor,push infomation to array and while stop  else if (board[nextY][nextX]==myColor){
        else if(board[nextY][nextX]==myColor){
          infoArray.push({goalPos: nextPos,dir:dir});
          break;
        }
        //when else stop
        else break;
      }
    }
  }
  return infoArray;
}

function returnCount (a,b,dir){
  var v = a;
  var j = 0;
  while(!arraysEqual(v,b) && v[0]>=0 && v[1]>=0){
    v = minusArray(v,dir);
    j++;
  }
  if(v[0]>0&&v[1]>0)
    return j;
}

function returnChip (board,y,x,myColor){
  var goalArray = serchGoal(board,y,x,myColor);
  for(var i=0;i<goalArray.length;i++){
    var goal = goalArray[i];
    var goalPos = goal["goalPos"]
    var dir = goal["dir"]
    var pos = addArray([y,x],dir);
    var cnt = returnCount(goalPos,pos,dir);
    if(cnt){
      for(var j=0;j<cnt;j++){
        var posY = pos[0];
        var posX = pos[1];
        //return chip
        board[posY][posX] = myColor;
        pos = addArray(pos,dir);
      }
    }
  }
}

var currentColor;


//for returnMax
var pointArray1 = [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                   [-1,100,-100 ,90 ,80 ,80 ,90 ,-100, 100,-1],
                   [-1,-100 ,-100, -90, -80, -80, -90, -100, -100,-1],
                   [-1,90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,-100, -100, -90, -80, -80, -90, -100, -100,-1],
                   [-1,100, -100, 90, 80, 80, 90, -100, 100,-1],
                   [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];
//for fool
var pointArray2 = [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                   [-1,-100,100 ,90 ,80 ,80 ,90 ,100, -100,-1],
                   [-1,100 ,-100, -90, -80, -80, -90, -100, 100,-1],
                   [-1,-90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,-90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,-90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,-90, -90, 80, 80, 80, 80, -90, 90,-1],
                   [-1,100, -100, -90, -80, -80, -90, -100, 100,-1],
                   [-1,-100, 100, 90, 80, 80, 90, 100, -100,-1],
                   [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];

function filter (array,fun){
  var valueArray = new Array();
  var k = 0;
  for(var i=0;i<array.length;i++){
    var value = array[i];
    var bl = fun(value);
    if(bl==true){
      valueArray[k] = value;
      k++
    }
  }
  return valueArray;
}


function returnBad (dArray){
  var valueArray = [-100,-90,-80,80,90,100];
  for(var i=0;i<valueArray.length;i++){
    var maxArray =
        filter(dArray,
               function (v) {
                 var y = v[0];
                 var x = v[1];
                 if(valueArray[i] == pointArray1[y][x]) return true;});
    if(maxArray.length > 0){
      return maxArray;
      break;
    }
  }
}
//for level5
function getMin(array){
  var min=array[0]["placeableCnt"];
  for(var i=1;i<array.length;i++){
    map=array[i];
    if(map["placeableCnt"]<min)
      min=map["placeableCnt"];
  }
  return min;
}
//return dot position have most lot returnCnt
function getMax(array){
  var max=0;
  for(var i=0;i<array.length;i++){
    map=array[i];
    if(map["cnt"]>max)
      max=map["cnt"];
  }
  return max;
}

function returnLot (board,dArray){
  var cntLst = new Array();
  for(var d=0;d<dArray.length;d++){
    var returnCnt = 0;
    var dPos = dArray[d];
    var y = dPos[0];
    var x = dPos[1];
    var goalArray = serchGoal(board,y,x,white);
    //count chip of return
    for(var i=0;i<goalArray.length;i++){
      var goal = goalArray[i];
      var goalPos = goal["goalPos"]
      var dir = goal["dir"]
      var pos = addArray([y,x],dir);
      var cnt = returnCount(goalPos,pos,dir);
      returnCnt += cnt;
    }
    cntLst.push({cnt:returnCnt,pos:dPos});
  }
  var maxCnt= getMax(cntLst);
  var filterArray = filter(cntLst,function(v){if(v["cnt"]==maxCnt) return true;});
  var dPosArray = new Array();
  for(var j=0;j<filterArray.length;j++){
    dPosArray.push(filterArray[j]["pos"]);
  }
  return dPosArray;
}

function returnMax (dArray){
  var valueArray = [100,90,80,-80,-90,-100];
  for(var i=0;i<valueArray.length;i++){
    var maxArray =
        filter(dArray,
               function (v) {
                 var y = v[0];
                 var x = v[1];
                 if(valueArray[i] == pointArray1[y][x]) return true;});
    if(maxArray.length > 0){
      return maxArray;
      break;
    }
  }
}
//for level5
function copyArray (array){
  var newArray = new Array(10);
  for(var i=0;i<newArray.length;i++){
    newArray[i] = new Array(10);
  }
  for(var j=0;j<array.length;j++){
    for(var k=0;k<array.length;k++){
      newArray[j][k] = array[j][k];
    }
  }
  return newArray;
}
//for level5
function deprive (board,dArray){
  var infoArray = getPlaceable(board,black);
  filterFn =
    function(v){var y = v[0];
                var x = v[1];
                for(var i=0;i<dArray.length;i++){
                  dPos = dArray[i];
                  dPosY = dPos[0];
                  dPosX = dPos[1];
                  if(y==dPosY&&x==dPosX){
                    return true;
                    break;
                  }
                }
               };
  return filter(infoArray,filterFn);
}

//AI strategy for level5
function levelFive (board,dBoard,dArray){
  var collectArray = new Array();
  for(var i = 0;i<dArray.length;i++){
    //copy othello board and dotBoard
    var v_Board = copyArray(board);
    var v_dotBoard = copyArray(dBoard);
    var pos =  dArray[i];
    var posY = pos[0];
    var posX = pos[1];
    //set chip
    v_Board[posY][posX] = white;
    returnChip(v_Board,posY,posX,white);
    //init v_dotBoard
    initArray(v_dotBoard,false);
    var infoArray = getPlaceable(v_Board,black);
    setDots(v_dotBoard,infoArray);
    //vertual player turn
    var v_dotArray = serchAddress(v_dotBoard,function(x) {if(x==true) return true;});
    //collect player placeable count
    collectArray.push({pos:pos,placeableCnt:v_dotArray.length});
    // console.log(infoArray[0]["placeableCnt"])
  }
  var minCnt= getMin(collectArray);
  //filterling equal minCnt from infoArray
  var filterArray = filter(collectArray,function(v){if(v["placeableCnt"]==minCnt) return true;});
  var dPosArray = new Array();
  for(var j=0;j<filterArray.length;j++){
    dPosArray.push(filterArray[j]["pos"]);
  }
  return dPosArray;
}

function strategySelect(strategy,board,dBoard,dotArray){
  var strategyArray;
  switch (strategy){
    case 1:
      //fool
      strategyArray=returnBad(dotArray);
      break;
    case 2:
      //return lot chip
      strategyArray = returnLot(board,dotArray);
      break;
    case 3:
      //random
      strategyArray=dotArray;
      break;
    case 4:
      //returnMax
      strategyArray=returnMax(dotArray);
      break;
    case 5:
      maxArray=returnMax(dotArray);
      chipCnt = serchAddress(board,function(v){if(v!=myEmpty && v!= -1) return true;}).length;
      //desprive player high point position
      if(chipCnt >= 32)
        depriveArray = deprive(board,maxArray);
      //levelFive decrease player's placeable
      strategyArray = levelFive(board,dBoard,maxArray);
      break;
  }
  //return position
  return strategyArray[Math.floor(Math.random () * strategyArray.length)];
}

var Othello = (function (){
  var Othello = function(level){
    this.othelloBoard = [
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];

    this.dotBoard = [
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,2,2,2,2,2,2,2,2,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];

    this.currentColor = black;
    this.AiStrategy =level;
    this.passFlag = 0;
    //deligate
    this.viewGameResultFn = false;

    initArray(this.dotBoard,false)
    //set chip
    initOthelloBoard(this.othelloBoard);
    //get placeable position
    var infoArray = getPlaceable(this.othelloBoard,this.currentColor);
    setDots(this.dotBoard,infoArray);
  };

  Othello.prototype.changeColor = function (){
    if(this.currentColor==black)
      this.currentColor = white;
    else if(this.currentColor==white)
      this.currentColor = black;
  };

  Othello.prototype.setupNewTurn = function(){
    this.changeColor();
    initArray(this.dotBoard,false);
    var infoArray = getPlaceable(this.othelloBoard,this.currentColor);
    setDots(this.dotBoard,infoArray);
  };

  Othello.prototype.gameEnd = function(){
    var blackCnt = serchAddress(this.othelloBoard,function(v){if(v==black) return true;}).length;
    var whiteCnt = serchAddress(this.othelloBoard,function(v){if(v==white) return true;}).length;
    this.viewGameResultFn(blackCnt,whiteCnt);
  };

  Othello.prototype.action = function (y,x,color){
    //reflesh pass flag
    this.passFlag = 0;
    this.othelloBoard[y][x] = color;
    returnChip(this.othelloBoard,y,x,color);

    var chipCnt = serchAddress(this.othelloBoard,function(v){if(v==black||v==white) return true;}).length;
    //board full?
    if(chipCnt>=64){
      this.gameEnd();
    }else{
      //new turn
      this.setupNewTurn()
    }
    ;
  };

  Othello.prototype.pass = function(){
    this.passFlag++;
    //each others pass  is game end
    if(this.passFlag==2)
      this.gameEnd(this.othelloBoard);

    alert("pass");

    this.setupNewTurn()
  };

  Othello.prototype.cpu = function(){
    var putedChipCnt = serchAddress(this.othelloBoard,function(v){if(v==black||v==white) return true;}).length;
    if(putedChipCnt!=64){
      var dotArray = serchAddress(this.dotBoard,function(v) {if(v==true) return true;});
      //dotArray.length is number of placeable
      if(this.currentColor==white && dotArray.length>0){
        //AiStrategy
        var decidePos =strategySelect(this.AiStrategy,this.othelloBoard,this.dotBoard,dotArray);
        var y = decidePos[0];
        var x = decidePos[1];
        //refresh passFlag
        this.action(y,x,white);
      }else this.pass();
    }
  };

  Othello.prototype.player = function(e){
    var putedChipCnt = serchAddress(this.othelloBoard,function(v){if(v==black||v==white) return true;}).length;
    if(putedChipCnt!=64){
      var tx = Math.floor((e.localX-170)/60);
      var ty = Math.floor(e.localY/60);
      var putableCnt = serchAddress(this.dotBoard,function(v) {if(v==true) return true;}).length;
      //cnt is number of placeable
      if(this.currentColor==black && putableCnt>0){
        if(this.currentColor==black && this.dotBoard[ty][tx]==true){
          //refresh passFlag
          this.action(ty,tx,this.currentColor);
          //clicked illeagal
        }else return false;

      }else this.pass();

      window.setTimeout(function(obj){
        obj.cpu();},1000,this);
    };
  }

  return Othello;
})();
