var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// var x = canvas.width/2;
// var y = canvas.height-30;
// var dx = 3;
// var dy = -3;

var ballMass = 1;

var blackHoleMass = 10;
var gravity = 700;

//var ballRadius = 10;

var fcoeff = 0.9;


var backend = "http://localhost:8000";

var vectors = {ball1: {s: 1, m: 1, x: canvas.width/4, y: canvas.height/2, dx: 0, dy: 0, maxS: 5} , ball2: {s: 1, m: 10, x: canvas.width*(.75), y: canvas.height/2, dx: 0, dy: 0, maxS: 5}, ball3: {s: 1, m: 20, x: canvas.width*(.75), y: canvas.height/3, dx: 0, dy: 0, maxS: 5}};
	       // ball3: {s: 1, m: 1, x: canvas.width-75, y: canvas.height/2, dx: 0, dy: 0, maxS: 10} , ball4: {s: 1, m: 1, x: canvas.width, y: 0, dx: 0, dy: 0, maxS: 10}, ball5: {s: 1, m: 1, x: canvas.width/2, y: 0, dx: 0, dy: 0, maxS: 10} , ball6: {s: 1, m: 1, x:0, y: 0, dx: 0, dy: 0, maxS: 10}, ball7: {s: 1, m: 1, x: 0, y: canvas.height/2, dx: 0, dy: 0, maxS: 10} , ball8: {s: 1, m: 1, x: 0, y: canvas.height, dx: 0, dy: 0, maxS: 10}};



//var vectors = {};


//document.addEventListener("mousemove", mouseMoveHandler, false);

// function mouseMoveHandler(e) {
//     var relativeX = e.clientX - canvas.offsetLeft;
//     if(relativeX > 0 && relativeX < canvas.width) {
//         gravityPoint.x = relativeX;
//     }
//     var relativeY = e.clientY - canvas.offsetTop;
//     if(relativeY > 0 && relativeY < canvas.width) {
// 	gravityPoint.y = relativeY;
//     }
// }

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createVectors(n){
    for (var i = 1; i <= n; i++){
	//console.log("hello");
	//vectors.i = {x: canvas.width/2, y: canvas.height-30, dx: 3, dy: -3} ;
	vectors[("ball"+String(i))] = {x: canvas.width/2, y: canvas.height-30, dx: getRandomArbitrary(-5,5), dy: getRandomArbitrary(-5,5)}
    }
}

//masterDraw();
//initialize(10)

//function collisionDetection() {

function drawBall (x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius(r), 0, Math.PI*2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function initialize(n){
    createVectors(n);
    masterDraw();
}


function masterDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var key in vectors) {
	if (vectors.hasOwnProperty(key)) {
	    draw(vectors[key], vectors);
	    //console.log(key + " -> " + vectors[key]); 
	}
    }
    requestAnimationFrame(masterDraw);
}
    
function draw(ballVector,allVectors) {

    targetFinding(ballVector,allVectors);
    drawBall(ballVector.x, ballVector.y, ballVector.m);

    if(ballVector.y + ballVector.dy < ballRadius(ballVector.m) || ballVector.y + ballVector.dy > canvas.height-ballRadius(ballVector.m)) {
    	ballVector.dy = -ballVector.dy;
    }
    
    if(ballVector.x + ballVector.dx > canvas.width - ballRadius(ballVector.m) || ballVector.x + ballVector.dx < ballRadius(ballVector.m)) {
    	ballVector.dx = -ballVector.dx;
    }
    ballVector.x += ballVector.dx;
    ballVector.y += ballVector.dy;
}


function targetFinding(ballVector, allVectors){
    var target = "none";
    if (nearestPredator(ballVector, allVectors) != "none" && vectorDist(ballVector, allVectors[nearestPredator(ballVector, allVectors)]) < 100) {
	target = allVectors[nearestPredator(ballVector, allVectors)];
	if (Math.abs(ballVector.dx + accelerationVector(ballVector, target).ax) <= ballVector.maxS){
	    ballVector.dx += accelerationVector(ballVector, target).ax;
	}
	if (Math.abs(ballVector.dy + accelerationVector(ballVector, target).ay) <= ballVector.maxS){
	    ballVector.dy += accelerationVector(ballVector, target).ay;
	}
    }
    else if (nearestPrey(ballVector, allVectors) != "none"){
	target = allVectors[nearestPrey(ballVector, allVectors)];
    	if (Math.abs(ballVector.dx - accelerationVector(ballVector, target).ax) <= ballVector.maxS){
	    ballVector.dx -= accelerationVector(ballVector, target).ax;
	}
	if (Math.abs(ballVector.dy - accelerationVector(ballVector, target).ay) <= ballVector.maxS){
	    ballVector.dy -= accelerationVector(ballVector, target).ay;
	}
    }
}

	    

function nearestPrey(ballVector, allVectors){
    var closestPrey = "none";
    var closestDist = Infinity;
    for (var key in allVectors) {
	if (allVectors.hasOwnProperty(key) && allVectors[key] != ballVector && massCheckGreater(ballVector, allVectors[key])) {
	    if (vectorDist(ballVector, allVectors[key]) < closestDist) {
		closestDist = vectorDist(ballVector, key);
		closestPrey = key;   }
	       }
    }
    return(closestPrey);
    }

function nearestPredator(ballVector, allVectors){
    var closestPredator = "none";
    var closestDist = Infinity;
    for (var key in allVectors) {
	if (allVectors.hasOwnProperty(key) && allVectors[key] != ballVector && massCheckLesser(ballVector, allVectors[key])) {
	    if (vectorDist(ballVector, allVectors[key]) < closestDist) {
		closestDist = vectorDist(ballVector, allVectors[key]);
		closestPredator = key;   }
	       }
    }
    return(closestPredator);
    }

function massCheckGreater(vector1, vector2){
    if (vector1.m > vector2.m){
	return true;}
    else return false;
}

function massCheckLesser(vector1, vector2){
    if (vector1.m < vector2.m){
	return true;}
    else return false;
}
function ballRadius(m){
    return (10 * Math.sqrt(m/Math.PI));
}
function forceForMass(m){
    return (Math.log(m)+1);
}

function accel(f, m){
    return (f/m);
}

function relAngle (x1,y1,x2,y2){
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var rad = Math.atan2(deltaY, deltaX);
    return rad;
    //return rad * (180 / Math.PI) 
}
function dist(x1,y1,x2,y2){
    var a = x1 - x2;
    var b = y1 - y2;
    var dist = Math.sqrt( a*a + b*b );
    return dist;
}

function vectorDist(vector1, vector2){
    // console.log(vector1);
    // console.log(vector2);
    var a = (vector1.x - vector2.x);
    var b = (vector2.y - vector2.y);
    var dist = Math.sqrt( a*a + b*b );
    return dist;
}
		    
function forceVector(hunterVector, targetVector){
    // console.log(hunterVector);
    // console.log(targetVector);
    var radius = dist(hunterVector.x,hunterVector.y,targetVector.x,targetVector.y);
    var angle = relAngle (hunterVector.x,hunterVector.y,targetVector.x,targetVector.y);
    var force = forceForMass(hunterVector.m);
    var fx = force * -Math.cos(angle);
    var fy = force * -Math.sin(angle);
    return {fx: fx, fy: fy};
}

function accelerationVector(hunterVector, targetVector){
    var fvector = forceVector(hunterVector, targetVector);
    var ax = accel(fvector.fx, hunterVector.m);
    var ay = accel(fvector.fy, hunterVector.m);
    return {ax: ax, ay: ay};
}

