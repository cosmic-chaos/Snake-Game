var FIELD_WIDTH = 500;
var FIELD_HEIGHT = 500;
var BOX_WIDTH = 10;
var BOX_HEIGHT = 10;

var SPEED = 100;

var currentX;
var currentY;
var enemyX;
var enemyY;

var eatenFood = false;
var eatenFoodX;
var eatenFoodY;

var firstRound = getDirection('upLeft','downLeft');
var secondRound = getDirection('upRight','downRight');
var directionE = getDirection(firstRound,secondRound);

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

var start, resume;

var enemyImage, foodImage, snakeImage, snakebImage;

var FOOD_IMAGE = 1;
var ENEMY_IMAGE = 2;
var SNAKE_IMAGE = 3;
var SNAKEB_IMAGE = 4;

function clearRect(x, y) {
	var c=document.getElementById("gameField");
	var ctx=c.getContext("2d");
	ctx.clearRect(x,y,BOX_WIDTH,BOX_WIDTH);
}

function fillRect(x, y, imageType) {
	var c=document.getElementById("gameField");
	var ctx=c.getContext("2d");
	var imageObj;
	switch (imageType) {
	case FOOD_IMAGE:
		imageObj = foodImage;
		break;
	case ENEMY_IMAGE:
		imageObj = enemyImage;
		break;
	case SNAKE_IMAGE:
		imageObj = snakeImage;
		break;
	case SNAKEB_IMAGE:
		imageObj = snakebImage;
		break;
	}
	ctx.drawImage(imageObj,x,y,BOX_WIDTH,BOX_HEIGHT);
	//console.log(imageType+' drawn');
}

function onLoad() {
	enemyImage = new Image();
	enemyImage.src = "steveFace.PNG";
	foodImage = new Image();
	foodImage.src = "pigFace.PNG";
	snakeImage = new Image();
	snakeImage.src = "nagaFace.PNG";
	snakebImage = new Image();
	snakebImage.src = "nagaBody.PNG";
	
	//console.log("images loaded");
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

function getRandomNumber() {
	return Math.floor(Math.floor((Math.random()*490)+1)/10)*10;
}

function startGame() {
	start = 'running';
	var c=document.getElementById("gameField");
	var ctx=c.getContext("2d");
	ctx.clearRect(0,0,FIELD_WIDTH,FIELD_HEIGHT);
	drawFood(10);
	currentX = FIELD_WIDTH / 2;
	currentY = FIELD_HEIGHT / 2;
	enemyX = getRandomNumber();
	enemyY = getRandomNumber();
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
		removeFood(foodPosition);
		addOneFood(0,0,false);
	}
	
	drawHead(currentX,currentY);
	
	
	if (eatenFood){
		console.log('fill food ' + eatenFoodX +' '+ eatenFoodY);
		fillRect(eatenFoodX,eatenFoodY,FOOD_IMAGE);
		eatenFood = false;
	}
	enemy();
	
	for (var i=0; i<snakeX.length; i++){
		if (checkForEnemy(snakeX[i],snakeY[i])){
			end();
		}
	}
	
	//drawHead(currentX,currentY);
	
	if (checkForBody(currentX, currentY, false)) {
		end();
	}
	checkForBoundary();
}

function checkForEnemy(x,y){
	if (x == enemyX && y == enemyY){
		return true;
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

function end(){
	start = 'stopped';
	pauseGame();
	alert('Game Over.');
	direction = DIRECTION_RIGHT;
	foodX=[];
	foodY=[];
	snakeX=[];
	snakeY=[];
	foodEaten=0;
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

document.onkeypress = keyWasPressed;  //I tell JS to call my function whenever a key is pressed

function keyWasPressed(e){
	var keyCode = e.charCode; //this tells me what button was clicked
	//console.log(keyCode);
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
	if (snakeX.length>0){
		clearRect(snakeX[0],snakeY[0]);
		//console.log('x= '+snakeX[0]+', y= '+snakeY[0]+', length= '+snakeX.length);
		snakeX.splice(0,1);
		snakeY.splice(0,1);
	}
}

function drawHead(x,y) {
	snakeX.push(x);
	snakeY.push(y);
	if (snakeX.length>1){
		var body = snakeX.length-2;
		fillRect(snakeX[body],snakeY[body],SNAKEB_IMAGE);
	}
	fillRect(x,y,SNAKE_IMAGE);
}

//this function creates an array with numOfFood food boxes
//with random coordinates and draws them on the field
function drawFood(numOfFood){
	for (var i=0; i<numOfFood; i++) {
		addOneFood(0,0,false);
	}
	console.log("total food: " + foodX.length);
}

function addOneFood(x,y,condit) {
	if (condit){
		eatenFoodX = x;
		eatenFoodY = y;
		eatenFood = true;
	} else {
		var foodx = getRandomNumber();
		var foody = getRandomNumber();
			
		if (checkForFood(foodx, foody) == -1 && checkForBody(foodx, foody, true) == false && checkForEnemy(foodx,foody) == false) {
			foodX.push(foodx);
			foodY.push(foody);
			fillRect(foodx,foody,FOOD_IMAGE);
		} else {
			addOneFood();
		}
	}
}

function enemy(){	
	//console.log('x = '+ enemyX +', y= '+ enemyY +', direction= '+ directionE);
	for (var i=0; i<foodX.length; i++) {
		if (enemyX == foodX[i] && enemyY == foodY[i]){
			addOneFood(foodX[i],foodY[i],true);
		}
	}
	
	if (enemyX == 0 || enemyX == 490 || enemyY == 0 || enemyY == 490){
		if (enemyX == 0){
			if (enemyX == 0 && enemyY == 490){
				directionE = 'upRight';
			} else if (enemyX == 0 && enemyY == 0){
				directionE = 'downRight';
			} else {
				directionE = getDirection('downRight','upRight');
			}
		} else if (enemyX == 490){
			if (enemyY == 0 && enemyX == 490){
				directionE = 'downLeft';
			} else if (enemyX == 490 && enemyY == 490){
				directionE = 'upRight';
			} else {
				directionE = getDirection('downLeft','upLeft');
			}
		} else if (enemyY == 0){
			if (enemyY == 0 && enemyX == 490){
				directionE = 'downLeft';
			} else if (enemyX == 0 && enemyY == 0){
				directionE = 'upLeft';
			} else {
				directionE = getDirection('downRight','downLeft');
			}
		} else if (enemyY == 490){
			if (enemyX == 0 && enemyY == 490){
				directionE = 'downRight';
			} else if (enemyX == 490 && enemyY == 490){
				directionE = 'upRight';
			} else {
				directionE = getDirection('upRight','upLeft');
			}
		}
	}
	
	clearRect(enemyX,enemyY);
	
	if (directionE == 'downRight'){
		enemyX += BOX_WIDTH;
		enemyY += BOX_WIDTH;
	} else if (directionE == 'downLeft'){
		enemyX -= BOX_WIDTH;
		enemyY += BOX_WIDTH;
	} else if (directionE == 'upRight'){
		enemyX += BOX_WIDTH;
		enemyY -= BOX_WIDTH;
	} else if (directionE == 'upLeft'){
		enemyX -= BOX_WIDTH;
		enemyY -= BOX_WIDTH;
	}
	
	fillRect(enemyX,enemyY,ENEMY_IMAGE);
}

function getDirection(choice1,choice2){
	var e = Math.round(Math.random());
	//console.log('choice= '+e);
	if (e == 0){
		return choice1;
	} else {
		return choice2;
	}
}
