var e;

var bestScore1 = read('bestScore1');
var bestScore2 = read('bestScore2');
var bestScore3 = read('bestScore3');

var bestScore1P = read('bestScore1P');
var bestScore2P = read('bestScore2P');
var bestScore3P = read('bestScore3P');

var level1 = read('level1');
var level2 = read('level2');
var level3 = read('level3');

var level1P = read('level1P');
var level2P = read('level2P');
var level3P = read('level3P');

var block1 = read('block1');
var block2 = read('block2');
var block3 = read('block3');

var block1P = read('block1P');
var block2P = read('block2P');
var block3P = read('block3P');

if (bestScore1P != null) { bestScore1P = bestScore1P.trim(); }
if (bestScore2P != null) { bestScore2P = bestScore2P.trim(); }
if (bestScore3P != null) { bestScore3P = bestScore3P.trim(); }
if (block1P != null) { block1P = block1P.trim(); }
if (block2P != null) { block2P = block2P.trim(); }
if (block3P != null) { block3P = block3P.trim(); }
if (level1P != null) { level1P = level1P.trim(); }
if (level2P != null) { level2P = level2P.trim(); }
if (level3P != null) { level3P = level3P.trim(); }

console.log('food; 1. ' + bestScore1P + ', 2. '+ bestScore2P + ', 3. ' + bestScore3P);
console.log('level; 1. ' + level1P + ', 2. '+ level2P + ', 3. ' + level3P);
console.log('blocks; 1. ' + block1P + ', 2. '+ block2P + ', 3. ' + block3P);

if (bestScore1P == null || bestScore1P == '') { bestScore1P = 'Anonymous'; }
if (bestScore2P == null || bestScore2P == '') { bestScore2P = 'Anonymous'; }
if (bestScore3P == null || bestScore3P == '') { bestScore3P = 'Anonymous'; }
if (level1P == null || level1P == '') { level1P = 'Anonymous'; }
if (level2P == null || level2P == '') { level2P = 'Anonymous'; }
if (level3P == null || level3P == '') { level3P = 'Anonymous'; }
if (block1P == null || block1P == '') { block1P = 'Anonymous'; }
if (block2P == null || block2P == ''){ block2P = 'Anonymous'; }
if (block3P == null || block3P == '') { block3P = 'Anonymous'; }

function callOut(){
	food();
	level();
	block();
}

function food(){
	console.log('food; 1. ' + bestScore1P + ', 2. '+ bestScore2P + ', 3. ' + bestScore3P);
	
	if (bestScore1 !== null & bestScore1 !== 'null'){
		e = document.getElementById("bestScore1");
		e.innerHTML = "#1. "+bestScore1+' pieces of food by '+bestScore1P;
	}
	
	if (bestScore2 !== null & bestScore2 !== 'null'){
		e = document.getElementById("bestScore2");
		e.innerHTML = "#2. "+bestScore2+' pieces of food by '+bestScore2P;
	}
	
	if (bestScore3 !== null & bestScore3 !== 'null'){
		e = document.getElementById("bestScore3");
		e.innerHTML = "#3. "+bestScore3+' pieces of food by '+bestScore3P;
	}
}

function level(){
	console.log('level; 1. ' + level1P + ', 2. '+ level2P + ', 3. ' + level3P);
	
	if (level1 !== null & level1 !== 'null'){
	e = document.getElementById("level1");
	e.innerHTML = "#1. "+level1+' levels passed by '+level1P;
	}
	
	if (level2 !== null & level2 !== 'null'){
		e = document.getElementById("level2");
		e.innerHTML = "#2. "+level2+' levels passed by '+level2P;
	}
	
	if (level3 !== null & level3 !== 'null'){
		e = document.getElementById("level3");
		e.innerHTML = "#3. "+level3+' levels passed by '+level3P;
	}
}

function block(){
	console.log('blocks; 1. ' + block1P + ', 2. '+ block2P + ', 3. ' + block3P);
	
	if (block1 !== null & block1 !== 'null'){
		e = document.getElementById("block1");
		e.innerHTML = "#1. "+block1+' blocks beaten game with by '+block1P;
	}
	
	if (block2 !== null & block2 !== 'null'){
		e = document.getElementById("block2");
		e.innerHTML = "#2. "+block2+' blocks beaten game with by '+block2P;
	}
	
	if (block3 !== null & block3 !== 'null'){
		e = document.getElementById("block3");
		e.innerHTML = "#3. "+block3+' blocks beaten game with by '+block3P;
	}
}
