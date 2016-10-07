
var HEIGHT = 350;
var WIDTH = 650;

var states = [];

function setup() {
	createCanvas(WIDTH, HEIGHT);
	states.push(new State(WIDTH / 2, HEIGHT / 2, 50));
}

function draw() {
	background(200);
	for (var i = 0; i < states.length; i++) {
		states[i].show();
	}
}
