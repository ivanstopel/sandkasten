class Shaper{
    constructor(x,y){
        this.SHAPE_WIDTH = 200;
        this.POvar_RADIUS = 3;
        
        this.SHRINK_SPEED = 2;
        this.DRAW_SPEED = 1;
        
        this.BG = color(48,153,117);;
        this.FG = color(250,250,225);
        this.CIRCLE_PHASE = 0;
        this.RECTANGLE_PHASE = 1;
        this.TRIANGLE_PHASE = 2;
        this.LAST_PHASE = this.TRIANGLE_PHASE+1;
        
        this.shapeSize = this.SHAPE_WIDTH;
        this.halfShapeSize = this.SHAPE_WIDTH/2;
        this.angle = 0;
        
        this.newPhase = true;
        this.shapeDrawn = false;
        this.firstAngle = true;
        this.stroke = true;
        this.phase = 0; // 0 - circle, 1 - rectangle, 2 - triangle
        
        this.modifyX = true;
        this.dir = -1;
        this.edge = 0;
        this.distance = 0;
        
        this.xPos = 0;
        this.yPos = this.SHAPE_WIDTH/2;

        this.draw = function(){
            if(this.shapeDrawn || this.newPhase) background(this.BG);
            switch(this.phase){
              case 1:
                this.drawRectangle();
                break;
              case 2:
                this.drawTriangle();
                break;  
              case 3: 
                this.phase = 0;
                break;
              default:
                this.drawCircle();
            } 
        }

        this.drawCircle = function(){
            if(this.phase == this.CIRCLE_PHASE && !this.shapeDrawn){
              this.newPhase = false;
              
              push();
              rotate(radians(this.angle));
              fill(this.FG);
              noStroke();
              circle(0, this.SHAPE_WIDTH/2, this.POvar_RADIUS * 2);
              
              pop(); 
              
              this.angle += 1 * this.DRAW_SPEED;
              if(this.angle >= 360){
                 this.shapeDrawn = true;  
             }
            }else{
              this.yPos = this.SHAPE_WIDTH/2 - this.shapeSize/2;
              
              push();
              strokeWeight(this.POvar_RADIUS*2);
             
                stroke(this.FG);
                noFill();
             
              
              circle(0,this.yPos,this.shapeSize);
              pop();
              
              this.shapeSize -= this.SHRINK_SPEED;
              if(this.shapeSize <= this.POvar_RADIUS){
                
                this.reset();
              }
            }
            
        }
        
        this.drawRectangle = function(){
           if(this.phase == this.RECTANGLE_PHASE && !this.shapeDrawn){
              if(this.distance > 0 && (this.distance / this.DRAW_SPEED) % (this.SHAPE_WIDTH / (this.edge == 0 ? 2 : 1)) == 0){
                  this.edge++;
                  this.distance = 0;
              }
              this.newPhase = false;
              push();
              switch(this.edge){
                  case 1:
                    
                    this.dir = -1;
                    this.dir *= this.DRAW_SPEED;
                    this.yPos += this.dir;
                    break;
                  case 2:
                  
                    this.dir = 1; 
                    
              this.dir *= this.DRAW_SPEED;
                    this.xPos += this.dir;
                    break;
                  case 3:
                    
                    this.dir = 1;
                    
              this.dir *= this.DRAW_SPEED;
                    this.yPos += this.dir;
                    break;
                  case 4:
                    
                    this.dir = -1;
                    
              this.dir *= this.DRAW_SPEED;
                    this.xPos += this.dir;
                    break;  
                  case 0:
                  
                    this.dir = -1;
                    
              this.dir *= this.DRAW_SPEED;
                   this.xPos += this.dir;
                   break;
              }
              this.distance += abs(this.dir);
              fill(this.FG);
              noStroke();
              
              circle(this.xPos, this.yPos, this.POvar_RADIUS * 2);
              
              
              pop(); 
              
              if(this.xPos <= 0 && this.edge == 4 ){
              
                 this.shapeDrawn = true;
                 this.angle = 0;
              }
            }else{
              this.yPos = this.SHAPE_WIDTH/2 - this.shapeSize/2;
              push();
              
              strokeWeight(this.POvar_RADIUS*2);
              
                stroke(this.FG);
              
              noFill();
             
              
              rect(0,this.yPos,this.shapeSize,this.shapeSize);
              
              this.shapeSize -= this.SHRINK_SPEED;;
              if(this.shapeSize <= this.POvar_RADIUS){
                this.reset();
              }
              pop();
            }
        }
        
        this.drawTriangle = function(){
           if(this.phase == this.TRIANGLE_PHASE && !this.shapeDrawn){
              if(this.distance > 0 && (this.distance / this.DRAW_SPEED) % (this.SHAPE_WIDTH) == 0){
                  
                  this.edge++;
                  this.distance = 0;
              }
              this.newPhase = false;
              push();
              
              switch(this.edge){
                  case 1:
                    
                    
                    this.dir = -1;
                    this.dir *= this.DRAW_SPEED;
                    this.xPos -= this.dir;
                    this.yPos += this.dir;
                    break;
                  case 2:
                  
                    
                    this.dir = 1;
                    this.dir *= this.DRAW_SPEED;
                    this.xPos += this.dir;
                    this.yPos += this.dir;
                    break;
                  case 3:
                    
                    this.dir = -1;
                    this.dir *= this.DRAW_SPEED;
                    this.xPos += this.dir;
                    this.yPos += 0;
                    break;
                  case 0:
                  
                    this.dir = -1;
                    this.dir *= this.DRAW_SPEED;
                   this.xPos += this.dir;
                   this.yPos += 0;
                   break;
              }
             
              this.dir *= this.DRAW_SPEED;
               this.distance+= abs(this.dir);
              fill(this.FG);
              noStroke();
              
              circle(this.xPos, this.yPos, this.POvar_RADIUS * 2);
              
              if(this.xPos <= 0 && this.edge == 3 ){
                
                 this.shapeDrawn = true;
                 this.angle = 0;
              }
              pop(); 
            }else{
              this.yPos = 0 - this.shapeSize/2;
              push();
              
              strokeWeight(this.POvar_RADIUS*2);
              stroke(this.FG);
              
              noFill();
              
              triangle(0,this.yPos,0+this.halfShapeSize*2,0+this.SHAPE_WIDTH/2,0-this.halfShapeSize*2,0+this.SHAPE_WIDTH/2);
              
              this.shapeSize -= this.SHRINK_SPEED;
              this.halfShapeSize -= this.SHRINK_SPEED/4;
              if(this.halfShapeSize <= this.POvar_RADIUS){
          
                this.reset();
              }
              pop();
            }
        }
        
        this.reset = function(){
                this.shapeDrawn = false;
                this.phase++; 
                if(this.phase > this.LAST_PHASE) this.phase = 0;
                this.xPos = 0;
                this.yPos = this.SHAPE_WIDTH/2 ;
                this.edge = 0;
                this.distance = 0;
                this.newPhase = true;
                this.angle = 0;
                this.shapeSize = this.SHAPE_WIDTH;
                this.halfShapeSize = this.SHAPE_WIDTH / 2;
        }
    }
}

var shaper; 

var shapers = [];
var shaperIndex = 0;

var xPos = 1280/2;
var yPos = 720/2; 
var scaleFactor = 0.7;

function setup(){
    createCanvas(1280, 720);
    ellipseMode(CENTER);
    rectMode(CENTER);
    //size(1080,1080);
    background(255);
    
}

function draw(){
    init();
    
    scale(scaleFactor);
    translate(width/scaleFactor/2, height/scaleFactor/2);
    
    var shaper = shapers[shaperIndex];
    //if(shaper.shapeDrawn || shaper.newPhase) background(0);
    shaper.draw();
}

function init(){
  if(shapers.length > 0) return;
  
  for(var i = 0; i < 1; i++){
      
        shapers.push(new Shaper(0,0));
    }
}