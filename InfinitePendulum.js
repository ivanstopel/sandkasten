var startingScale = 50;
var iterations = 500;
var padding = 20;
var scaleModifier = 0.75;
var maxRotationFactor = 300;
var maxXMovementFactor = 60;
var bottomPadding = 100;
var maxYMovementFactor = 30;
var tSize = 16;
var t = "click to cause chaos";
var t1 = "click to restore order";

var bColor;
var fColor;
var rand = false;

function setup() {
  createCanvas(1280, 720);
  noStroke();
  //noCursor();
  bColor = color(255,251,244);
  fColor = color(0,0,0);
}

function draw() {
  var scale = startingScale;
  var xPos = (width / 2);
  var yPos =  height - bottomPadding - scale;
  background(bColor);
  textSize(tSize);
  fill(fColor);
  var tD = rand ? t1 : t;
  text(tD, width/2 - (tD.length/4 * tSize), 40);
  randomSeed(0);
  for(var i = 1;i <= iterations; i++){
    createCircle(xPos,yPos, scale,i);
    scale *= scaleModifier;
    yPos -= (scale + padding);
  }
}


function createCircle(x,y,scale,iteration){
      var xModifier = (sin(0.003*millis())*(maxXMovementFactor/0.5));
      var yModifier = map(xModifier,-1,1,-maxYMovementFactor,maxYMovementFactor);
      var yMultiplicator = 1;
      var randomXMovement = random(-4,7);
      var randomYMovement = random(-3,5);
      if(yModifier < 0) yMultiplicator = -1;
      push();
      if(!rand){
          
          translate(x+(sin(0.003*millis())*(maxXMovementFactor/(iteration*0.5))),y-(yModifier*yMultiplicator*0.003));
      }else{
          
      translate(x+(sin(0.003*millis())*(maxXMovementFactor/(iteration*0.5))*randomXMovement),y-(yModifier*yMultiplicator*0.003)*randomYMovement);
      }
       fill(fColor,255-(20*iteration));
      circle(0,0,scale);
      pop();
}

function mouseClicked(){
  
    if(mouseClicked && mouseButton == LEFT && rand){
      rand = false;
    }else if(mouseClicked && mouseButton == LEFT && !rand){
      rand = true;
    }else if(mouseClicked && mouseButton != LEFT && mouseButton != RIGHT){
      //saveFrame(day()+month()+hour()+second()+millis()+".png");
    }
}