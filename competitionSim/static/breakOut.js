var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// var x = canvas.width/2;
// var y = canvas.height-30;
// var dx = 3;
// var dy = -3;


var backend = "http://localhost:8000"

// var vectors = {ball1: {x: canvas.width/2, y: canvas.height-75, dx: 0, dy: 0} , ball2: {x: canvas.width, y: canvas.height, dx: -20, dy: 0}, ball3: {x: canvas.width-75, y: canvas.height/2, dx: 0, dy: 0} , ball4: {x: canvas.width, y: 0, dx: 0, dy: 0}, ball5: {x: canvas.width/2, y: 0, dx: 0, dy: 0} , ball6: {x:0, y: 0, dx: 0, dy: 0}, ball7: {x: 0, y: canvas.height/2, dx: 0, dy: 0} , ball8: {x: 0, y: canvas.height, dx: 0, dy: 0}}



var vectors = {}

var gravityPoint = {x: canvas.width/2, y: canvas.height/2}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        gravityPoint.x = relativeX;
    }
    var relativeY = e.clientY - canvas.offsetTop;
    if(relativeY > 0 && relativeY < canvas.width) {
	gravityPoint.y = relativeY;
    }
}

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
initialize(10)

// function collisionDetection() {
//     for(c=0; c<brickColumnCount; c++) {
//         for(r=0; r<brickRowCount; r++) {
//             var b = bricks[c][r];
// 	    if(b.status == 1) {
// 		if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
//                     if (dy < 0) {dy = -dy + 1;}
// 		    else if (dy > 0) {dy = -dy - 1};
// 		    if (dx < 0) {dx = dx - 1;}
// 		    else if (dx > 0) {dx = dx + 1};
		    
// 		    b.status = 0;
// 		    score++;
// 		    jQuery.post(backend+"/breakOutScore?score="+score, function ( data ) { console.log ("received response"+data) })

// 		    if(score == brickRowCount*brickColumnCount) {
//                         //alert("YOU WIN, CONGRATULATIONS!");
//                         //document.location.reload();
// 			gamestatus = "Congratulations, you have won!";
// 			//document.getElementById("gameOutcome").innerHTML = gamestatus;
// 			continueGame = false;
// 		    }
// 		}
//             }
//         }
//     }
// }

function drawBall (x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function initialize(n){
    createVectors(n)
    masterDraw()
}


function masterDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var key in vectors) {
	if (vectors.hasOwnProperty(key)) {
	    draw(vectors[key])
	    //console.log(key + " -> " + vectors[key]); 
	}
    }
    requestAnimationFrame(masterDraw);
}
    
function draw(ballVector) {

    drawBall(ballVector.x, ballVector.y);
    ballVector.x += ballVector.dx;
    ballVector.y += ballVector.dy;

    // ballVector.dx += Math.min(ballVector.dx + accelerationVector(ballVector).ax, 15)

    // ballVector.dy += Math.min(ballVector.dy + accelerationVector(ballVector).ay, 15)
    
    if(Math.abs(ballVector.dx + accelerationVector(ballVector).ax) <= 15) {
    	ballVector.dx += accelerationVector(ballVector).ax
    }//else {console.log ("excessive x acceleration")}
    if(Math.abs(ballVector.dy + accelerationVector(ballVector).ay) <= 15) {
    	ballVector.dy += accelerationVector(ballVector).ay
    }//else {console.log ("excessive y acceleration")}
    
    if(ballVector.y + ballVector.dy < ballRadius || ballVector.y + ballVector.dy > canvas.height-ballRadius) {
    	ballVector.dy = -ballVector.dy;
    }
    
    if(ballVector.x + ballVector.dx > canvas.width - ballRadius || ballVector.x + ballVector.dx < ballRadius) {
    	ballVector.dx = -ballVector.dx;
    }
    
}
    
// function forceG(g,m1,m2,r){
//     return (g*m1*m2)/(Math.pow(r, 2))
// }

function forceG(g,m1,m2,r){
    return (g*m1*m2)/r
}


function accel(f, m){
    return (f/m)
}

function relAngle (x1,y1,x2,y2){
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var rad = Math.atan2(deltaY, deltaX);
    return rad
    //return rad * (180 / Math.PI) 
}
function dist(x1,y1,x2,y2){
    var a = x1 - x2
    var b = y1 - y2
    var dist = Math.sqrt( a*a + b*b );
    return dist*100
}

function forceVector(ballVector){
    var radius = dist(gravityPoint.x,gravityPoint.y,ballVector.x,ballVector.y)
    var angle = relAngle (gravityPoint.x,gravityPoint.y,ballVector.x,ballVector.y)
    var force = forceG(gravity,blackHoleMass,ballMass,radius)
    var fx = force * -Math.cos(angle)
    var fy = force * -Math.sin(angle)
    return {fx: fx, fy: fy}
}

function accelerationVector(ballVector){
    var fvector = forceVector(ballVector)
    var ax = accel(fvector.fx, ballMass)
    var ay = accel(fvector.fy, ballMass)
    return {ax: ax, ay: ay}
}

var ballMass = 1

var blackHoleMass = 10
var gravity = 700

var ballRadius = 10;

