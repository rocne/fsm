// View Variables
var HEIGHT = 350;
var WIDTH = 650;

var STATE_RADIUS = 20;

var START_STATE_HIGHLIGHT_DR = -2;
var CURR_STATE_HIGHLIGHT_DR = -5;
var currentStateHighlightOffset;

//Control Variables
var editTransitions = false;
var newTransitionStartState = -1;
var stepRate = 1.5;
var isRunning = false;
var timer = -1;

// Model Variables
var states = [];

var startState = -1;
var currentState = -1;

var fsmInput = "";
var fsmInputIndex = 0;

window.onload = function() {
	// disable right click from opening menu
	document.body.oncontextmenu = function() {
		return false;
	}
}

/****************************************************
*			top level control functions				*
****************************************************/
function setup() {
	var canv = createCanvas(WIDTH, HEIGHT);
	createInputs();
	currentStateHighlightOffset = createVector(0, 0);
}

function draw() {
	background(200);
	showFSMInput();

	if (currentState == -1 && startState != -1)
		currentState = startState;

	lerpCurrentStateHighlightOffset();

	highlightStartState();
	highlightCurrentState();
	for (var i = 0; i < states.length; i++) {
		states[i].show();
	}
	if (newTransitionStartState != -1)
		showNewTransition();
	
	displayControlText();
}

/****************************************************
*			input callback functions				*
****************************************************/
function tickButtonClick_cb() {
	if (!isRunning) {
		tick();
	}
}

function stopButtonClick_cb() {
	isRunning = false;
	currentState = startState;
	fsmInputIndex = 0;
	currentStateHighlightOffset = createVector(0, 0);
	clearTimeout(timer);
}

function pauseButtonClick_cb() {
	isRunning = false;
	clearTimeout(timer);
}

function startButtonClick_cb() {
	if (startState != -1 && !isRunning) {
		if (currentState == -1)
			currentState = startState;

		isRunning = true;
		clearTimeout(timer);
		timer = setTimeout(tick, 0);
	}
}

function fsmInputChange_cb() {
	if (!isRunning) {
		fsmInput = this.value;
		fsmInputIndex = 0;
	}	
}

function stepRateInputChange_cb(input) {
	stepRate = input.value;
}

function getIntervalDelay() {
	return 1000 / stepRate;
}


/****************************************************
*				UI creation functions				*
****************************************************/
function createInputs() {
	createLineBreak();	

	createButton("tick", tickButtonClick_cb);
	createButton("start", startButtonClick_cb);
	createButton("pause", pauseButtonClick_cb);
	createButton("stop", stopButtonClick_cb);
	createLineBreak();
	
	createSlider("step rate", stepRateInputChange_cb, 1, 10, 0.05, stepRate);
	createLineBreak();
	
	createTextInput("fsm input: ", fsmInputChange_cb);
}

function createSlider(labelText, callback, min, max, step, defaultValue) {
	var slider = document.createElement("INPUT");
	slider.type = "range";
	slider.step = step;
	slider.min = min;
	slider.max = max;
	slider.defaultValue = defaultValue;
	
	var label = document.createElement("SPAN");
	label.innerHTML = labelText;

	var readout = document.createElement("SPAN");
	readout.innerHTML = defaultValue;
	slider.readout = readout;
	slider.onchange = function() {
		callback(this);
		this.readout.innerHTML = this.value;
	};
	document.body.appendChild(label);
	document.body.appendChild(slider);
	document.body.appendChild(readout);
}

function createTextInput(label, callback) {
	var txt = document.createElement("INPUT");
	txt.type = "text";
	txt.onchange = callback;
	txt.size = 100;
		
	var labl = document.createElement("SPAN");
	labl.innerHTML = label;
	
	document.body.appendChild(labl);
	document.body.appendChild(txt);
}

function createLineBreak() {
	document.body.appendChild(document.createElement("BR"));
}

function createButton(label, callback) {
	var button = document.createElement("BUTTON");
	button.onclick = callback;
	button.innerHTML = label;
	document.body.appendChild(button);
}

/****************************************************
*				drawing functions					*
****************************************************/
function highlightCurrentState() {
	if (currentState != -1) {
		var onFinal = states[currentState].isFinal && currentStateHighlightOffset.mag() < 2 * STATE_RADIUS;
		var c = {
			r: onFinal ? 0 : 200,
			g: onFinal ? 200 : 0,
			b: 0,
			a: 0.5
		};
		highlightState(currentState, c, CURR_STATE_HIGHLIGHT_DR, currentStateHighlightOffset);
	}
}

function highlightStartState() {
	if (startState != -1) {
		var c = {
			r: 50,
			g: 50,
			b: 50,
			a: 0.5
		};
		highlightState(startState, c, START_STATE_HIGHLIGHT_DR);
	}
}

function highlightState(stateIndex, c, deltaRadius, offset) {
	offset = offset || createVector(0, 0);
	var state = states[stateIndex];
	push();
	var col = "rgba(" + c.r +","+c.g+","+c.b+","+c.a+")";
	fill(color(col));
	noStroke();
	translate(state.pos.x + offset.x, state.pos.y + offset.y);
	ellipse(0, 0, 2 * (state.radius + deltaRadius));
	pop();	
}

function displayControlText() {
	push();
	scale(0.8);
	var txt = "Click mode (press 't' to toggle):           ";
	txt += editTransitions ? "TRANSITIONS" : "FINAL STATES";

	var shift = 13;

	translate(5, shift);
	text(txt, 0, 0);

	translate(0, shift);

	txt = "Description:                                         ";
	txt += editTransitions ? "Click and drag from one state to another state to add a transition." : "Click on a state to toggle between final and normal.";
	text(txt, 0, 0);

	translate(0, 2 * shift);
	text("Right-click a state to designate it as the start state", 0, 0);
	pop();	
}

function showNewTransition() {
	push();
	fill (255, 0, 0);
	var start = states[newTransitionStartState];
	line (start.pos.x, start.pos.y, mouseX, mouseY);
	pop();
}

function showFSMInput() {
	var letterWidth = 10;
	push();
	translate (10, HEIGHT - 10);
	for (var i = 0; i < fsmInput.length; i++) {
		if (i == fsmInputIndex)
			stroke(255, 0, 0);
		else if (i < fsmInputIndex)
			stroke(175);
		else
			stroke(0);

		text(fsmInput.charAt(i), 0, 0);
		translate(letterWidth, 0);
	}
	pop();
}


function tick() {
	if (fsmInputIndex < fsmInput.length) {
		var curr = fsmInput.charAt(fsmInputIndex);
		var next = states[currentState].getNextState(curr);
		if (next == undefined)
			console.log ("Something must have cone wrong!");
		else {
			currentStateHighlightOffset = p5.Vector.sub(states[currentState].pos, states[next].pos);
			currentState = next;
		}
		fsmInputIndex++;
		
		if (isRunning)
			timer = setTimeout(tick, getIntervalDelay());
	}
}

function lerpCurrentStateHighlightOffset() {
	if (currentState != -1) {
		// TODO: calculate decay such that we will be ~95% of the way there in the available time
		//	 getIntervalDelay() -> time (ms)
		//	 frameRate() / 1000 -> ms per frame
		//	 timeToNextTick (ms) / msPerFrame = framesToNextTick
		//	 dacay ^ famesToNextTick = 0.95
		var decay = 0.25;
		currentStateHighlightOffset.x = lerp(currentStateHighlightOffset.x, 0, decay);
		currentStateHighlightOffset.y = lerp(currentStateHighlightOffset.y, 0, decay);
	}
}

/****************************************************
*					keypress events					*
****************************************************/
function keyPressed() {
	switch(key) {
		case 'T':
			tPressed();
			break;
		default:
			break;
	}
}


function tPressed() {
	editTransitions = !editTransitions;
}

/****************************************************
*					mouse events					*
****************************************************/
function mousePressed() {
	switch(mouseButton) {
		case LEFT:
			leftMouseClick();
			break;
		case RIGHT:
			rightMouseClick();
			break;
		case CENTER:
			centerMouseClick();
			break;
		default:
			break;
	}
}


function rightMouseClick() {
	var clickedState = detectClickOnState();
	startState = clickedState;
}


function centerMouseClick() {
	console.log("I don't even know what I'd do with the center mouse click yet");
}

function leftMouseClick() {
	if (mouseX > 0 && mouseX < WIDTH && mouseY > 0 && mouseY < HEIGHT) {
		var clickedState = detectClickOnState();
		if (clickedState == -1) {
			states.push(new State(mouseX, mouseY, STATE_RADIUS));
		} else {
			if (editTransitions) {
				newTransitionStartState = clickedState;
			} else {
				states[clickedState].toggleIsFinal();
			}
		}
	}
}

function mouseReleased() {
	if (newTransitionStartState != -1) {
		var endState = detectClickOnState();
		if (endState != -1 && endState != newTransitionStartState) {
			var transitionChar = getTransition();
			states[newTransitionStartState].addTransition(endState, transitionChar);
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

function getTransition() {
	var transitionText = prompt("Enter a transition character.", "transition character");
	return transitionText;
}

/****************************************************
*				Test functions						*
****************************************************/
function ADD_TEST_SETUP(num) {
	num = num || 0;
	switch (num) {
		case 0:
			// four corner, all a, cycle
			var tl = new State(100, 100, STATE_RADIUS);
			var tr = new State(300, 100, STATE_RADIUS);
			var bl = new State(100, 200, STATE_RADIUS);
			var br = new State(300, 200, STATE_RADIUS);
			states.push(tl);
			states.push(tr);
			states.push(br);
			states.push(bl);
			for (var i = 0; i < states.length; i++)
				states[i].addTransition((i + 1) % states.length, "a");
			startState = 0;
			states[2].isFinal = true;
			fsmInput = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
			break;
		default:
			break;
	}
}