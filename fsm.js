
var HEIGHT = 350;
var WIDTH = 650;

var STATE_RADIUS = 20;

var states = [];

var tPressed = false;
var newTransitionStartState = -1;


function setup() {
	createCanvas(WIDTH, HEIGHT);
}

function draw() {
	background(200);
	for (var i = 0; i < states.length; i++) {
		states[i].show();
	}
	if (newTransitionStartState != -1)
		showNewTransition();
	
	displayEditState();
}

function showNewTransition() {
	push();
	fill (255, 0, 0);
	var start = states[newTransitionStartState];
	line (start.pos.x, start.pos.y, mouseX, mouseY);
	pop();
}

function keyPressed() {
	if (key === 'T')
		tPressed = !tPressed;
}

function mousePressed() {
	var clickedState = detectClickOnState();
	if (clickedState == -1) {
		states.push(new State(mouseX, mouseY, STATE_RADIUS));
	} else {
		if (tPressed) {
			newTransitionStartState = clickedState;
		} else {
			states[clickedState].toggleIsFinal();
		}
	}
}

function displayEditState() {
	push();
	var txt = "";
	if (tPressed) {
		txt = "click a state to toggle final state";
	} else {
		txt = "click a state and drag to anothr state to add a transition";
	}
	translate(5, 10);
	text(txt, 0, 0);
	translate(0, 10);
	text("press 't' to toggle edit mode between 'final state' and 'transition'", 0, 0);
	pop();	
}

function mouseReleased() {
	if (newTransitionStartState != -1) {
		var endState = detectClickOnState();
		if (endState != -1) {
			var transitionChar = getTransition();
			states[newTransitionStartState].addTransition(endState, transitionChar);
		}
		newTransitionStartState = -1;
	}
}

function getTransition() {
	var transitionText = prompt("Enter a transition character.", "transition character");
	console.log(transitionText);
	return transitionText;
}

function detectClickOnState() {
	for (var i = 0; i < states.length; i++) {
		var dist = states[i].pos.dist(createVector(mouseX, mouseY));
		if (dist < states[i].radius) {
			return i;
		}
	}
	return -1;
}
