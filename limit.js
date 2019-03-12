var fieldWidth;
var fieldHeight;

function canvasSize() {
	fieldWidth = read('width');
	fieldHeight = read('height');
	var canvas = document.getElementById('gameField');
	canvas.width = fieldWidth;
	canvas.height = fieldHeight;
}

var BOX_WIDTH = 10;
var BOX_HEIGHT = 10;

var SPEED = Number(read('speed'));
var ESPEED = Number(read('enemySpeed'));

var currentX;
var currentY;
var enemyX=[];
var enemyY=[];

var eatenFoodX;
var eatenFoodY;
var eatenFood = false;
var eatenBlockX;
var eatenBlockY;
var eatenBlock = false;

var firstRound;
var secondRound;
var directionE = [];

var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 3;
var DIRECTION_LEFT=4;

var direction = DIRECTION_RIGHT;

var interval;
var intervalE=[];

var blockX=[];
var blockY=[];
var foodX=[];
var foodY=[];
var snakeX=[];
var snakeY=[];
var numOfFood= read('food');
var numOfBlocks= read("blockAmount");
var numOfEnemy= read("enemyAmount");

for (var i=0; i<numOfEnemy; i++){
	firstRound = getDirection('upLeft','downLeft');
	secondRound = getDirection('upRight','downRight');
	directionE[i] = getDirection(firstRound,secondRound);
	console.log('direction= '+directionE[i]);
}

var start, resume;

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
	ctx.clearRect(0,0,fieldWidth,fieldHeight);
	currentX = fieldWidth / 2;
	currentY = fieldHeight / 2;
	for (var i=0; i<numOfEnemy; i++){
		enemyX[i] = Math.floor(Math.floor((Math.random()*(fieldWidth-10))+1)/10)*10;
		enemyY[i] = Math.floor(Math.floor((Math.random()*(fieldHeight-10))+1)/10)*10;
	}
	draw(currentX,currentY);
	drawFood();
	drawBlock();
	
	resumeGame();
}

function resumeGame() {
	if (read('enemy')){
		for (var i=0; i<numOfEnemy; i++){
			console.log('setting interval ' + i +', x= '+enemyX[i]+' ,y= '+enemyY[i]);
			intervalE[i] = setInterval("enemy(" + i + ")", ESPEED);
			console.log('done setting interval ' + i);
		}
	}
	interval = setInterval("animate()", SPEED);
	resume = 'running';
}

function pauseGame() {
	clearInterval(interval);
	if (read('enemy')){
		for (var i=0; i<numOfEnemy; i++){
			console.log('clearing interval ' + i);
			clearInterval(intervalE[i]);
			console.log('done clearing interval ' + i);
		}
	}
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
	
	if (eatenFood){
		fillRect(eatenFoodX,eatenFoodY,"#000000");
		eatenFood = false;
	}
	
	if (eatenBlock){
		fillRect(eatenBlockX,eatenBlockY,"#aaa");
		eatenBlock = false;
	}
	
	var foodPosition = checkForFood(currentX, currentY);
	if (foodPosition == -1) {
		//we didn't hit food
		//since we are not deleting tail box the snake will grow at the head
		clearTail();
	} else {
		//we hit food
		removeFood(foodPosition);
	}
	draw(currentX,currentY);
	if (foodX.length == 0){
		end('win');
	}
	
	if (checkForBlock(currentX, currentY) == -1){
	} else {
		end('lose');
	}
	
	if (checkForBody(currentX, currentY, false)) {
		end('lose');
	}
	checkForBoundary();
	
	for (var i=0; i<snakeX.length; i++){
		if (checkForEnemy(snakeX[i],snakeY[i])){
			end('lose');
		}
	}
}

function checkForEnemy(x,y){
	for (var i=0; i<numOfEnemy; i++){
		if (x == enemyX[i] && y == enemyY[i]){
			return true;
		}
	}
	return false;
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

function end(x){
	if (x=='lose'){
		alert('Game Over');
	} else {
		alert('You win.');
		if (read('block')){
			bestScore();
		}
	}
	start = 'stopped';
	pauseGame();
	direction = DIRECTION_RIGHT;
	blockX=[];
	blockY=[];
	foodX=[];
	foodY=[];
	snakeX=[];
	snakeY=[];

}

function bestScore(){
	var bestScore1 = read('block1');
	var bestScore2 = read('block2');
	var bestScore3 = read('block3');
	
	var bestScore1P = read('block1P');
	var bestScore2P = read('block2P');
	var bestScore3P = read('block3P	');
	
	if (bestScore3 == 'null'){
		bestScore3 = 0;
	}
	
	console.log('best score 1= '+bestScore1 +', best score 2= '+ bestScore2+', best score 3= '+bestScore3);
	if (numOfBlocks>bestScore3){
		var choice = confirm("Congratulations!\nYou have beaten one of our best score!\nWould you like your score to be displayed in the Leaderboard?");
		if (choice){
			var person = prompt("Please enter your name","Enter Name Here");
			if (numOfBlocks>bestScore3 && numOfBlocks<bestScore2){
				store('block3',numOfBlocks);
				store('block3P',person);
			} else if (numOfBlocks>bestScore2 && numOfBlocks<bestScore1){
				store('block3',bestScore2);
				store('block3P',bestScore2P);
				
				store('block2',numOfBlocks);
				store('block2P',person);
			} else if (numOfBlocks>bestScore1){
				store('block3',bestScore2);
				store('block3P',bestScore2P);
				
				store('block2',bestScore1);
				store('block2P',bestScore1P);
				
				store('block1',numOfBlocks);
				store('block1P',person);
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
		//console.log('hi: ' + hi +', new x: '+ x +', old x: '+ foodX[i] +', new y: '+ y +', old y: '+ foodY[i]);
	}
	//console.log("return: -1");
	return -1;

}

function checkForBlock(x, y){
	for (var i=0; i<blockX.length; i++){
		if (x==blockX[i] && y==blockY[i]) {
			return i;
		}
	//	console.log('hi: ' + hi +', new x: '+ x +', old x: '+ foodX[i] +', new y: '+ y +', old y: '+ foodY[i]);
	}
	//console.log("return: -1");
	return -1;

}

function removeFood(position) {
	foodX.splice(position,1);
	foodY.splice(position,1);
}

function checkForBoundary() {
	if (currentX<0 || currentY<0 || currentX > fieldWidth-BOX_WIDTH || currentY > fieldHeight-BOX_HEIGHT) {
		end('lose');
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
function drawFood(){
	for (var i=0; i<numOfFood; i++) {
		addOneFood();
	}
	console.log("total food: " + foodX.length);
}

function addOneFood(x,y,condit) {
	if (condit){
		eatenFoodX = x;
		eatenFoodY = y;
		eatenFood = true;
	} else {
		var foodx = Math.floor(Math.floor((Math.random()*(fieldWidth-10))+1)/10)*10;
		var foody = Math.floor(Math.floor((Math.random()*(fieldHeight-10))+1)/10)*10;
			
		if (checkForBlock(foodx, foody) == -1 && checkForFood(foodx, foody) == -1 && checkForBody(foodx, foody, true) == false && checkForEnemy(foodx,foody) == false) {
			foodX.push(foodx);
			foodY.push(foody);
			fillRect(foodx,foody,"#000000");
		} else {
			addOneFood();
		}
	}
}

function drawBlock(x,y,condit){
	if (read('block')){
		for (var i=0; i<numOfBlocks; i++) {
			addOneBlock();
		}
	}
}

function addOneBlock(x,y,condit) {
	if (condit){
		eatenBlockX = x;
		eatenBlockY = y;
		eatenBlock = true;
	} else {
		var blockx = Math.floor(Math.floor((Math.random()*(fieldWidth-10))+1)/10)*10;
		var blocky = Math.floor(Math.floor((Math.random()*(fieldHeight-10))+1)/10)*10;
			
		if (checkForBlock(blockx, blocky) == -1 && checkForFood(blockx, blocky) == -1 && checkForBody(blockx, blocky, true) == false) {
			blockX.push(blockx);
			blockY.push(blocky);
			fillRect(blockx,blocky,'#aaa');
		} else {
			addOneBlock();
		}
	}
}

function enemy(place){
	var x = enemyX[place];
	var y = enemyY[place];
	
	console.log('x = '+ x +', y= '+ y +', direction= '+ directionE[place]);
	
	for (var i=0; i<foodX.length; i++) {
		if (x == foodX[i] && y == foodY[i]){
			addOneFood(foodX[i],foodY[i],true);
		}
	}
	
	for (var i=0; i<blockX.length; i++) {
		if (x == blockX[i] && y == blockY[i]){
			addOneBlock(blockX[i],blockY[i],true);
		}
	}
	
	for (var i=0; i<snakeX.length; i++){
		if (checkForEnemy(snakeX[i],snakeY[i])){
			end();
		}
	}
	
	if (x == 0 || x == fieldWidth || y == 0 || y == fieldHeight){
		if (x == 0){
			if (x == 0 && y == fieldHeight){
				directionE[place] = 'upRight';
			} else if (x == 0 && y == 0){
				directionE[place] = 'downRight';
			} else {
				directionE[place] = getDirection('downRight','upRight');
			}
		} else if (x == fieldWidth){
			if (y == 0 && x == fieldWidth){
				directionE[place] = 'downLeft';
			} else if (x == fieldWidth && y == fieldHeight){
				directionE[place] = 'upRight';
			} else {
				directionE[place] = getDirection('downLeft','upLeft');
			}
		} else if (y == 0){
			if (y == 0 && x == fieldWidth){
				directionE[place] = 'downLeft';
			} else if (x == 0 && y == 0){
				directionE[place] = 'upLeft';
			} else {
				directionE[place] = getDirection('downRight','downLeft');
			}
		} else if (y == fieldHeight){
			if (x == 0 && y == fieldHeight){
				directionE[place] = 'downRight';
			} else if (x == fieldWidth && y == fieldHeight){
				directionE[place] = 'upRight';
			} else {
				directionE[place] = getDirection('upRight','upLeft');
			}
		}
	}
	
	clearRect(x,y);
	
	if (directionE[place] == 'downRight'){
		console.log('directionE[place] is downRight. x= '+x+', y= '+y);
		x += BOX_WIDTH;
		y += BOX_WIDTH;
		console.log('changed coords. x= '+x+', y= '+y);
	} else if (directionE[place] == 'downLeft'){
		console.log('directionE[place] is downLeft');
		x -= BOX_WIDTH;
		y += BOX_WIDTH;	
		console.log('changed coords. x= '+x+', y= '+y);
	} else if (directionE[place] == 'upRight'){
		console.log('directionE[place] is upRight');
		x += BOX_WIDTH;
		y -= BOX_WIDTH;
		console.log('changed coords. x= '+x+', y= '+y);
	} else if (directionE[place] == 'upLeft'){
		console.log('directionE[place] is upLeft');
		x -= BOX_WIDTH;
		y -= BOX_WIDTH;
		console.log('changed coords. x= '+x+', y= '+y);
	}
	console.log('enemyX= '+enemyX[place] +', enemyY= '+ enemyY[place]);
	enemyX[place] = x;
	enemyY[place] = y;
	console.log('enemyX= '+enemyX[place] +', enemyY= '+ enemyY[place]);
	
	console.log('1. x= '+x+', y= '+y);
	fillRect(x,y,"#FF0000");
	console.log('2. x= '+x+', y= '+y);
}

function getDirection(choice1,choice2){
	var e = Math.round(Math.random());
	////console.log('choice= '+e);
	if (e == 0){
		return choice1;
	} else {
		return choice2;
	}
}
