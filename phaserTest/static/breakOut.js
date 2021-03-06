var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;

var dx = 1;
var dy = -1;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var lives = 3;

var bricks = [];

var backend = "http://localhost:8000"

var gamestatus = ""

var continueGame = true


for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
	bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler,false);

document.addEventListener("mousemove", mouseMoveHandler, false);

console.log ("load breakOut.js")

draw();

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    //console.log("key down: " + e.keyCode)
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    } 
    //console.log("key up: " + e.keyCode)
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
	    if(b.status == 1) {
		if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    if (dy < 0) {dy = -dy + 1;}
		    else if (dy > 0) {dy = -dy - 1};
		    if (dx < 0) {dx = dx - 1;}
		    else if (dx > 0) {dx = dx + 1};
		    
		    b.status = 0;
		    score++;
		    jQuery.post(backend+"/breakOutScore?score="+score, function ( data ) { console.log ("received response"+data) })

		    if(score == brickRowCount*brickColumnCount) {
                        //alert("YOU WIN, CONGRATULATIONS!");
                        //document.location.reload();
			gamestatus = "Congratulations, you have won!";
			//document.getElementById("gameOutcome").innerHTML = gamestatus;
			continueGame = false;
		    }
		}
            }
        }
    }
}

function drawBall () {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
	    if(bricks[c][r].status == 1) {
		var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
		var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
		bricks[c][r].x = brickX;
		bricks[c][r].y = brickY;
		ctx.beginPath();
		ctx.rect(brickX, brickY, brickWidth, brickHeight);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	    }
        }
    } 
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function draw() {
    if (continueGame) { 

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	collisionDetection();
	drawScore();
	drawLives();
	x += dx;
	y += dy;
	
	if(y + dy < ballRadius) {
	    dy = -dy;
	} else if(y + dy > canvas.height-ballRadius) {
	    if(x > paddleX && x < paddleX + paddleWidth) { dy = -dy; }
	    else {		      
		lives--;
		if(lives < 1) {
		    //alert("GAME OVER");
		    //document.location.reload();
		    gamestatus = "Congratulations, you have lost!";
		    //document.getElementById("gameOutcome").innerHTML = gamestatus;
		    continueGame = false;
		}
		else {
		    x = canvas.width/2;
		    y = canvas.height-30;
		    dx = 3;
		    dy = -3;
		    paddleX = (canvas.width-paddleWidth)/2;
		}
		
	    }
	}

	if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
	    dx = -dx;
	}

	if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
	}

	else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
	}
	
	requestAnimationFrame(draw);
    }
    else { document.getElementById("gameOutcome").innerHTML = gamestatus; }
    
}



//setInterval(draw, 10);


var ballRadius = 10;

