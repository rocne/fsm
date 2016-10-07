
var HEIGHT = 350;
var WIDTH = 650;

var STATE_RADIUS = 20;

var states = [];

function setup() {
	createCanvas(WIDTH, HEIGHT);
	for (var i = 0; i < 10; i++) {
		states.push(new State(50 + i * 2.5 * STATE_RADIUS, HEIGHT / 2, STATE_RADIUS));
	}
}

function draw() {
	background(200);
	for (var i = 0; i < states.length; i++) {
		states[i].show();
	}
}

function mousePressed() {
	var clickedState = detectClickOnState();
	if (clickedState == -1) {
		console.log("you missed");
	} else {
		console.log("got it! State #" + clickedState);
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
