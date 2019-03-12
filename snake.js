var FIELD_WIDTH = 500;
var FIELD_HEIGHT = 500;
var BOX_WIDTH = 10;
var BOX_HEIGHT = 10;

var SPEED = 100;

var currentX;
var currentY;

var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 3;
var DIRECTION_LEFT=4;

var direction = DIRECTION_RIGHT;

var interval;

var foodX=[];
var foodY=[];
var snakeX=[];
var snakeY=[];

var best;
var foodEaten = 0;

var start;
var resume;

function clearRect(x, y) {
	var c=document.getElementById("gameField");
	var ctx=c.getContext("2d");
	ctx.clearRect(x,y,BOX_WIDTH,BOX_WIDTH);
}

function fillRect(x, y, color) {
	var c=document.getElementById("gameField");
	var ctx=c.getContext("2d");
	ctx.fillStyle=color;
	ctx.fillRect(x,y,BOX_WIDTH,BOX_HEIGHT);
}
function checkStart(){
	if (start != 'running') {
		startGame();
	} else {
		return;
	}
}

function checkResume(){
	if (resume != 'running') {
		resumeGame();
	} else {
		return;
	}
}

function startGame() {
	start = 'running';
	var c=document.getElementById("gameField");
	var ctx=c.getContext("2d");
	ctx.clearRect(0,0,FIELD_WIDTH,FIELD_HEIGHT);
	showEatenFood(foodEaten);
	drawFood(10);
	currentX = FIELD_WIDTH / 2;
	currentY = FIELD_HEIGHT / 2;
	clearRect(currentX,currentY);
	
	resumeGame();
}

function resumeGame() {
	interval = setInterval("animate()", SPEED);
	resume = 'running';
}

function pauseGame() {
	clearInterval(interval);
	resume = 'stopped';
}

function animate() {
	switch (direction) {
	case DIRECTION_UP:
		currentY-=BOX_WIDTH;
		break;
	case DIRECTION_RIGHT:
		currentX+=BOX_WIDTH;
		break;
	case DIRECTION_DOWN:
		currentY+=BOX_WIDTH;
		break;
	case DIRECTION_LEFT:
		currentX-=BOX_WIDTH;
		break;	
	}
	
	var foodPosition = checkForFood(currentX, currentY);
	if (foodPosition == -1) {
		//we didn't hit food
		//since we are not deleting tail box the snake will grow at the head
		clearTail();
	} else {
		//we hit food
		foodEaten++;
		showEatenFood(foodEaten);
		removeFood(foodPosition);
		addOneFood();
	}
	
	draw(currentX,currentY);
	if (checkForBody(currentX, currentY, false)) {
		end();
	}
	checkForBoundary();
	
}

//checks if the snake has a box with coordinates x,y
function checkForBody(x, y, includeHead){
	var limit = (includeHead) ? snakeX.length : snakeX.length-1;
	for (var i=0; i<limit; i++){
		if (x==snakeX[i] && y==snakeY[i]) {
			return true;
		}
	}
	return false;
}

function end(){
	start = 'stopped';
	pauseGame();
	alert('Game Over.');
	bestScore();
	direction = DIRECTION_RIGHT;
	foodX=[];
	foodY=[];
	snakeX=[];
	snakeY=[];
	foodEaten=0;
}

function bestScore(){
	var bestScore1 = read('bestScore1');
	var bestScore2 = read('bestScore2');
	var bestScore3 = read('bestScore3');
	
	var bestScore1P = read('bestScore1P');
	var bestScore2P = read('bestScore2P');
	var bestScore3P = read('bestScore3P');
	
	if (bestScore3 == 'null'){
		bestScore3 = 0;
	}
	
	console.log('best score 1= '+bestScore1 +', best score 2= '+ bestScore2+', best score 3= '+bestScore3);
	if (foodEaten>bestScore3){
		var choice = confirm("Congratulations!\nYou have beaten one of our best score!\nWould you like your score to be displayed in the Leaderboard?");
		if (choice){
			var person = prompt("Please enter your name","Enter Name Here");
			if (foodEaten>bestScore3 && foodEaten<=bestScore2){
				store('bestScore3',foodEaten);
				store('bestScore3P',person);
			} else if (foodEaten>bestScore2 && foodEaten<=bestScore1){
				store('bestScore3',bestScore2);
				store('bestScore3P',bestScore2P);
				
				store('bestScore2',foodEaten);
				store('bestScore2P',person);
			} else if (foodEaten>bestScore1){
				store('bestScore3',bestScore2);
				store('bestScore3P',bestScore2P);
				
				store('bestScore2',bestScore1);
				store('bestScore2P',bestScore1P);
				
				store('bestScore1',foodEaten);
				store('bestScore1P',person);
			}
		}
	}
}

//this function checks if a box at x,y coordinates
//matches with any food boxes
//if it does it returns true, if not then false
function checkForFood(x, y){
	for (var i=0; i<foodX.length; i++){
		if (x==foodX[i] && y==foodY[i]) {
			return i;
		}
	}
	return -1;

}

function removeFood(position) {
	foodX.splice(position,1);
	foodY.splice(position,1);
}

function checkForBoundary() {
	if (currentX<0 || currentY<0 || currentX > FIELD_WIDTH-BOX_WIDTH || currentY > FIELD_HEIGHT-BOX_HEIGHT) {
		end();
	}
}

document.onkeypress=keyWasPressed;  //I tell JS to call my function whenever a key is pressed

function keyWasPressed(e){
	var keyCode = e.charCode; //this tells me what button was clicked
	
	switch (keyCode) {
	case 119:
		//go up since w was pressed
		if (direction !== DIRECTION_DOWN || snakeX.length == 1) {
			direction = DIRECTION_UP;
		}
		break;
	case 115:
		//go down since s was pressed
		if (direction !== DIRECTION_UP || snakeX.length == 1) {
			direction = DIRECTION_DOWN;
		}
		break;
	case 97:
		//go left since a was pressed
		if (direction !== DIRECTION_RIGHT || snakeX.length == 1) {	
			direction = DIRECTION_LEFT;
		}
		break;
	case 100:
		//go right since d was pressed
		if (direction !== DIRECTION_LEFT || snakeX.length == 1) {		
			direction = DIRECTION_RIGHT;
		}
		break;
		
	}
}

//this function clears the tail of the snake
function clearTail() {
	clearRect(snakeX[0],snakeY[0]);
	snakeX.splice(0,1);
	snakeY.splice(0,1);
}

function draw(x,y) {
	snakeX.push(x);
	snakeY.push(y);
	fillRect(x,y,"#FF0000");
}

//this function creates an array with numOfFood food boxes
//with random coordinates and draws them on the field
function drawFood(numOfFood){
	for (var i=0; i<numOfFood; i++) {
		addOneFood();
	}
	console.log("total food: " + foodX.length);
}

function addOneFood() {
	var foodx = Math.floor(Math.floor((Math.random()*490)+1)/10)*10;
	var foody = Math.floor(Math.floor((Math.random()*490)+1)/10)*10;
		
	if (checkForFood(foodx, foody) == -1 && checkForBody(foodx, foody, true) == false) {
		foodX.push(foodx);
		foodY.push(foody);
		fillRect(foodx,foody,"#000000");
	} else {
		addOneFood();
	}
}

function showEatenFood(foodCount) {
	findBest();
	var e = document.getElementById("snake");
	e.innerHTML = "You ate " + foodCount + " pieces of food.";
	var e = document.getElementById("best");
	e.innerHTML = "Your best score is " + best + " pieces.";
}

function findBest() {
	best = read('best');
	if (best == 'null'){
		best=0;
	}
	if (best < foodEaten) {
		best = foodEaten;
	}
	store('best',best);
}
