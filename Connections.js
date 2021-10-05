var HEARING_RADIUS = 720*0.08;
var SPEAKING_VOLUME = 50;
var VOICE_DELAY = 3;
var MAX_VOICE_CYCLES = 6;
var MOVE_DURATION; 
var HOLD_DURATION = 3;
var SPEED = 0.3;
var LABOR_DURATION = 8;
var MAX_DIST = 400;
var MAX_LINE_ALPHA = 200;
var MAX_BODY_ALPHA = 200;
var MIN_BODY_ALPHA = 20;
var SOUNDWAVE_ALPHA = 70;
var GROWTH_FACTOR = 2.5;
var MAX_FOLLOWERS = 2;
var BOUNDARY_RATIO = 0.2;

class SoundWave{    
    constructor(location, size,maxSize,growthFactor,clr){
       
      this.location = location;
      this.size = size;
      this.growthFactor = growthFactor;
      this.maxSize = maxSize;
      this.colorCopy = JSON.parse(JSON.stringify(clr)).levels;
      this.soundwaveClr = color(this.colorCopy[0],this.colorCopy[1],this.colorCopy[2]);
      this.soundwaveAlpha = SOUNDWAVE_ALPHA;

      this.show = function(){
        push();
        translate(this.location.x, this.location.y);
        this.soundwaveClr.setAlpha(this.soundwaveAlpha);
        stroke(this.soundwaveClr, this.soundwaveAlpha);
        noFill();
        strokeWeight(1);
        ellipse(0,0, this.size,this.size);
        pop();
        this.size += this.growthFactor;
        this.soundwaveAlpha -= 1;
      }

      this.finish = function(){
        return this.size >= this.maxSize;
      }
    }
}
//import processing.sound.*;
//import ddf.minim.*;

class Bug{
    constructor(location, clr, caller){
        this.moving = floor(random(0,6)) == 2;
        this.soundWaves = [];
    
        this.followers = 0;
    
        this.location = new p5.Vector(0,0);
        this.acceleration = new p5.Vector(0,0);
        this.velocity = new p5.Vector(random(-1, 1), random(-1,1)).mult(this.SPEED);
        
        this.type = "A"; // A || B A is ally to A, A is enemy to B, etc.
        this.life = 3; 
        this.size = 5;
        this.maxSize = random(5,15);
        this.vocal = false; 
        this.lineAlpha = MAX_LINE_ALPHA;
        this.bodyAlpha = MIN_BODY_ALPHA;
        this.inLabor = false;
        this.readyToGiveBirth = false;
        this.voice;
        
        this.startedSpeaking = 0;
        this.voiceCycles = 0;
        this.lastCycleStarted = 0;
        this.cycleInitiated = false;
        this.toSpeak = floor(random(0,6)) == 0;
        this.target = null;
        this.partner = null;
        this.location.x = location.x; 
        this.location.y = location.y; 
        this.colorCopy = JSON.parse(JSON.stringify(clr)).levels;
        this.bugClr = color(this.colorCopy[0],this.colorCopy[1],this.colorCopy[2]);
        this.lineClr = color(this.colorCopy[0],this.colorCopy[1],this.colorCopy[2]);
      //this.voice = new SoundFile(caller, "voice1.mp3");

      this.show = function(){
        var wave;
        for(var i = 0; i < this.soundWaves.length; i++){
          wave = this.soundWaves[i];
          if(wave == null) continue;
          wave.show();
          if(wave.finish()){
            this.soundWaves[i] == null;
            //i--;
          } 
        }
        if(this.size < this.maxSize) this.size += 0.09;
        if(this.target != null){
          strokeWeight(3);
          this.lineClr.setAlpha(this.lineAlpha);
          stroke(this.lineClr, this.lineAlpha);
          
          line(this.location.x, this.location.y, this.target.location.x, this.target.location.y);
          if(this.bodyAlpha < MAX_BODY_ALPHA){
              this.bodyAlpha = this.bodyAlpha + 5;
            }
        }else{
            if(this.bodyAlpha > MIN_BODY_ALPHA){
              this.bodyAlpha = this.bodyAlpha - 5;
            }
        }
        this.bugClr.setAlpha(this.bodyAlpha);
        fill(this.bugClr, this.bodyAlpha);
        noStroke();
        circle(this.location.x, this.location.y, this.size);
        
        this.lineAlpha-=0.8;
        if(this.lineAlpha <= 0){
          if(this.target != null) this.target.followers--;
          this.target = null;
          this.lineAlpha = MAX_LINE_ALPHA;
        }
      }
      
      this.dead = function(){
        return this.life <= 0 || this.life >= 7;
      }
      
      this.update = function(){
          if(!this.cycleInitiated){
            this.lastCycleStarted = millis();
            this.cycleInitiated = true;
          }
        
          if((millis() - this.lastCycleStarted) / 1000 >= this.MOVE_DURATION){
            this.cycleInitiated = false; 
            this.toSpeak = floor(random(0,6)) == 0;
          }
        
          this.move();
          this.hold();
      }
     
      
      
      this.move = function(){
          this.checkBoundaries();
          this.velocity.add(this.acceleration);
          this.location.add(this.velocity);
          this.acceleration.mult(0);
      }
      
      this.hold = function(){
          if(this.toSpeak){
            this.vocal = true;
            this.speak();
            }else{
                this.vocal = false;
            }
      }
      
      this.hear = function(other){
          this.target = other;
      }
      
      
      this.applyForce = function(force){
        this.acceleration.add(force);
      }
      
      this.speak = function(){
        if((millis() - this.startedSpeaking) / 1000 >= VOICE_DELAY && this.vocal == true){
            this.startedSpeaking = millis();
          if(this.voiceCycles < MAX_VOICE_CYCLES){
            this.soundWaves.push(new SoundWave(this.location, this.size/2,SPEAKING_VOLUME, GROWTH_FACTOR, this.bugClr));
            this.voiceCycles++;
          }else{
            this.vocal = false; 
            this.voiceCycles = 0;
          }
        }
        
          
      }
      
      this.checkBoundaries = function(){
        if(this.location.x - this.size/2 < width*BOUNDARY_RATIO || this.location.x + this.size/2 > width - (width*BOUNDARY_RATIO)){
            this.velocity.x  *= -1;
        } 
        
        if(this.location.y - this.size/2 < height*BOUNDARY_RATIO|| this.location.y + this.size/2 > height - (height*BOUNDARY_RATIO)){
            this.velocity.y  *= -1;
        } 
      }
      
      this.distance = function(b){
        return dist(this.location.x, this.location.y, b.location.x, b.location.y);
      }
    }
}


//import com.hamoid.*;

var BUGS = 150;
var MAX_BUGS = 80;
var SPAWN_DELAY = 1.2;
var  BOUNDARY_RATIO = 0.2;
var lastSpawned = -1;
var spawned = false;
var bugs = [];
var clrs;

function setup(){
    MOVE_DURATION = floor(random(3,6))
  createCanvas(1280, 720);
  //fullScreen();
  frameRate(60);
  ellipseMode(CENTER);
  clrs = clrs = [
  

    color(255,150,113),
    
    color(255,199,95),
    color(255,111,145),
    
    color(214,93,177),
    
    //color(132,94,194),
    
    /*
    color(153,216,208),
    color(183,239,205),
    color(255,188,188),
    color(182,151,78),
    color(126,195,186)*/
    ];
}

function draw(){
  //background(color(255,199,95));
  background(color(132,94,194));
  for(var i = 0; i < bugs.length;i++){
    var b = bugs[i];
    if(b == null) continue;
    b.show();
    b.update();
    if(b.vocal) communicate(b);
    if(b.readyToGiveBirth) spawnChildren(b);
    if(b.dead()){
      if(b.inLabor){
          // spawn children
          spawnChildren(b);
      }
      bugs[i] == null;
    }
  }
    
  
  spawn();
 textSize(25);
 fill(0);
 //text(bugs.length,50,50);

}

function spawn(){
   if((millis() - lastSpawned) / 1000.0 >= SPAWN_DELAY && bugs.length < BUGS && spawned == false){
       newBug(new p5.Vector(random((width*BOUNDARY_RATIO),width-(width*BOUNDARY_RATIO)), random((height*BOUNDARY_RATIO),height-(height*BOUNDARY_RATIO))));
        //newBug(new p5.Vector(random(0,width-0), random(0,height-0)));
   }else{
       if(bugs.length >= BUGS) spawned = true;
   }
}

function spawnChildren(b){
var children = floor(random(1,4));
          println(children);
          if(bugs.length + children < MAX_BUGS){
            for(var j = 0; j < children; j++){
              newBug(b.location);
            }
          }
          b.partner = null;
          b.inLabor = false;
          b.readyToGiveBirth = false;
}

function newBug(location){
    var b1;
    b1 = new Bug(location, clrs[floor(random(clrs.length))], this);
    b1.size = random(2,7);
    
    bugs.push(b1);
}

function communicate(b){
    for(var i = 0; i < bugs.length; i++){
      var b1 = bugs[i];
      if(b1 != b &&
      b1.vocal &&
      b1.target == null &&
      b1.target != b &&
      b.target != b1 &&
      b1.distance(b) < HEARING_RADIUS 
         ) {
           if(b1.followers < MAX_FOLLOWERS){
             b1.hear(b);
             b1.followers++;
           }
             
               }
             
         
         }
    }
    