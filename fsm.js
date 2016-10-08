
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
		tPressed = true;
}

function keyReleased() {
	if (key ==='T')
		tPressed = false;
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

function mouseReleased() {
	if (newTransitionStartState != -1) {
		var endState = detectClickOnState();
		if (endState != -1) {
			states[newTransitionStartState].addTransition(endState, '');
		}
		newTransitionStartState = -1;
	}
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
