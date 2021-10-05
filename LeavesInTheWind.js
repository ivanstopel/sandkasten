var SCALE_LOWER_BOUND = 0.3; 
var SCALE_UPPER_BOUND = 0.7; 
var BACKGROUND_CLR;
var LEAF_CLR;
var LEAF_CLR_1;
var LEAF_CLR_2;
var LEAF_CLR_3;
var LEAF_CLRS;

var SHADOW_INTENSITY = 35;
var LEAF_CALM_PHASE_DURATION_MIN = 5;
var LEAF_CALM_PHASE_DURATION_MAX = 10;
var LEAF_SPEED_L_LIMIT = 0.7; 
var LEAF_SPEED_U_LIMIT = 2; 
var LEAF_MAX_I_ROTATION = 90; 
var LEAF_MIN_I_ROTATION = -90; 
var LEAF_Y_MOVEMENT_DURATION_MIN = 0.1;
var LEAF_Y_MOVEMENT_DURATION_MAX = 0.6;

var LEAF_ROTATION_DURATION_MIN = 3;
var LEAF_ROTATION_DURATION_MAX = 5;

var WIND_SPEED_MIN = 5;
var WIND_SPEED_MAX = 7;

var WIND_CALM_PHASE_DURATION_MIN = 1;
var WIND_CALM_PHASE_DURATION_MAX = 3;


var WIND_SCALE_MIN = 0.3;
var WIND_SCALE_MAX = 1;

var WIND_SHAPES_MIN = 1;
var WIND_SHAPES_MAX = 1;

var WIND_SPAWN_RATE = 2; 

var tSize = 16;
var t = "Wind has nothing to do. Click to create leaves";


class WindShape{
    constructor(x,y){
        this.currentWindSpeed = random(WIND_SPEED_MIN,WIND_SPEED_MAX);
        this.spawnedAt = 0;
        this.calmPhaseDuration = random(WIND_CALM_PHASE_DURATION_MIN,WIND_CALM_PHASE_DURATION_MAX);
        this.x;
        this.y;
        this.currentScale = 1;
        this.lowerShapeScaleModifier = 0.5;
        this.x = x;
        this.y = y;
        this.spawnedAt = millis();
        this.currentScale = random(WIND_SCALE_MIN,WIND_SCALE_MAX);
        this.draw = function(){
            push();
            if(millis() <= this.spawnedAt + (this.calmPhaseDuration * 1000)){
                translate(this.x, this.y);
            }else{
                this.x += this.currentWindSpeed;
                translate(this.x, this.y);
            }
            
            this.shape(0,0);
            pop();
        }  
        
        this.shape = function(x, y){
            let lowerShapeScale = this.currentScale * this.lowerShapeScaleModifier;
            strokeWeight(2);
            stroke(0,50);
            line(x,y,x + 150*this.currentScale, y);
            line(x + 150*this.currentScale,y,x + 180*this.currentScale, y-30*this.currentScale);
            line(x + 180*this.currentScale,y-30*this.currentScale,x + 150*this.currentScale, y-60*this.currentScale);
            
            line(x,y+50*lowerShapeScale,x + 150*lowerShapeScale, y+50*lowerShapeScale);
            line(x + 150*lowerShapeScale,y+50*lowerShapeScale,x + 180*lowerShapeScale, y+80*lowerShapeScale);
            line(x + 180*lowerShapeScale,y+80*lowerShapeScale,x + 150*lowerShapeScale, y+110*lowerShapeScale);
        }
    }
}

class Leaf{
    constructor(x, y, scale){
        this.scale = 1;
        this.shadowOffsetVerticalLowerLimit = 1;
        this.shadowOffsetVerticalUpperLimit = 2.5;
        this.shadowOffsetHorizontalLowerLimit = 1;
        this.shadowOffsetHorizontalUpperLimit = 2.5;
        this.x;
        this.y;
        this.spawnTimestamp; 
        this.xMovementSpeed = random(LEAF_SPEED_L_LIMIT,LEAF_SPEED_U_LIMIT);
        this.yMovementSpeed = random(LEAF_SPEED_L_LIMIT,LEAF_SPEED_U_LIMIT);
        this.rotation;
        this.calmPhaseDuration = random(LEAF_CALM_PHASE_DURATION_MIN,LEAF_CALM_PHASE_DURATION_MAX);
        this.modifyYMovement = true;
        this.yMovementStartedAt = 0;
        this.yMovementModifiers = [-1,1,-1,-1,-1,1,1,-1]; 
        this.currentYMovementModifier = 1;
        this.currentYMovementDuration = 0;
        this.modifyRotation = true;
        this.rotationStartedAt = 0;
        this.callIteration = 0;
        this.iterationRotationAngle =  1; 
        this.currentRotationModifier;
        this.currentRotationDuration =  1; 
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.spawnTimestamp = millis();
        this.rotation = random(LEAF_MIN_I_ROTATION,LEAF_MAX_I_ROTATION);
        this.currentColor = LEAF_CLRS[floor(random(LEAF_CLRS.length))];

        this.draw = function(){
        
        
            push();
            if(millis() <= this.spawnTimestamp + (this.calmPhaseDuration * 1000)){
              translate(this.x,this.y);
              
                rotate(radians(this.rotation));
                
              
            }else{
              if(this.modifyYMovement){
                this.yMovementStartedAt = millis();
                this.currentYMovementModifier = this.yMovementModifiers[floor(random(this.yMovementModifiers.length))];
                this.currentYMovementDuration = random(LEAF_Y_MOVEMENT_DURATION_MIN,LEAF_Y_MOVEMENT_DURATION_MAX);
                this.modifyYMovement = false;
              }
              
              if(this.modifyRotation){
                this.rotationStartedAt = millis();
                this.currentRotationModifier = this.yMovementModifiers[floor(random(this.yMovementModifiers.length))];
                this.currentRotationDuration = random(LEAF_Y_MOVEMENT_DURATION_MIN,LEAF_Y_MOVEMENT_DURATION_MAX);
                this.modifyRotation = false;
              }
              
              
              this.x += (this.xMovementSpeed);
              this.y += (this.yMovementSpeed*this.currentYMovementModifier);
              translate(this.x,this.y);
              rotate(radians(this.currentRotationModifier*this.iterationRotationAngle*this.callIteration));
              if(millis() >= this.yMovementStartedAt + (this.currentYMovementDuration * 1000) ){
                this.modifyYMovement = true;
              }
              
              if(millis() >= this.rotationStartedAt + (this.currentRotationDuration * 1000) ){
                this.modifyRotation = true;
              }
              this.callIteration++;
            }
            
            this.shadow(0,0);
            this.leaf(0,0);
            
              
            
            pop();
        }
        
        this.leaf = function(x, y){
            stroke(this.currentColor,100);
            fill(this.currentColor);
            this.shape(x,y);
        }
        
        this.shadow = function(_x, _y){
            let x = _x + random(this.shadowOffsetHorizontalLowerLimit, this.shadowOffsetHorizontalUpperLimit);
            let y = _y + random(this.shadowOffsetVerticalLowerLimit, this.shadowOffsetVerticalUpperLimit);
            strokeWeight(0);
            fill(0,this.SHADOW_INTENSITY);
            
            this.shape(x,y);
        }
        
        
        this.shape = function(x, y){
            
            beginShape();
            vertex(x, y);
            vertex(x+5*this.scale, y+20*this.scale);
            vertex(x-10*this.scale, y+50*this.scale);
            vertex(x+15*this.scale, y+70*this.scale);
            vertex(x+25*this.scale, y+35*this.scale);
            vertex(x, y);
            endShape(CLOSE);
        }
    }
}

var windShapes = [];
var windShape; 

var leafs = [];
var leaf; 
var spawn = false;

var nextWind = 0;
var currentTextClr;
function setup(){
    BACKGROUND_CLR = color(255,255,255);
    LEAF_CLR = color(156,180,102);
    LEAF_CLR_1 = color(246,213,115);
    LEAF_CLR_2 = color(226,181,83);
    LEAF_CLR_3 = color(95,111,58);
    LEAF_CLRS = [LEAF_CLR,LEAF_CLR_1,LEAF_CLR_2,LEAF_CLR_3];
    currentTextClr = LEAF_CLRS[floor(random(LEAF_CLRS.length))];

    createCanvas(1280,720);
}

function draw(){
background(BACKGROUND_CLR);
var windShapesCount = random(WIND_SHAPES_MIN, WIND_SHAPES_MAX);
textSize(tSize);
fill(currentTextClr);
text(t, width/2 - (t.length/4 * tSize), 40);
if(mouseClicked && spawn){
  let scale = random(SCALE_LOWER_BOUND,SCALE_UPPER_BOUND);
  leaf = new Leaf(mouseX,mouseY,scale);
  leafs.push(leaf);
  leaf.draw();
  spawn = false;
}

  if(millis() >= nextWind){
      for(var i = 0; i < windShapesCount; i++){
        windShapeFun();
      }
      
      nextWind = millis() +  (WIND_SPAWN_RATE * 1000);
  }
  
  animate();
}

function animate(){
  for(var i = 0; i < leafs.length; i++)
  { 
    leafs[i].draw();
  }
  
  for(var i = 0; i < windShapes.length; i++)
  { 
    windShapes[i].draw();
  }
}

function windShapeFun(){
    let y = random(150,height-150);
    let x = random(-width,-width+300);
    windShape = new WindShape(x,y);
    windShapes.push(windShape);
}

function mouseClicked(){
  if(mouseButton != LEFT && mouseButton != RIGHT){
    //saveFrame(day()+month()+hour()+second()+millis()+".png");
  }else if(mouseButton == LEFT){
    spawn = true;
  }
}