

function State(x, y, r) {
	this.pos = createVector(x, y);
	this.radius = r;
	this.isFinal = false;
	this.transitions = {};
	this.transitionValues = [];	

	this.show = function() {
		this.showState();
		this.showTransitions();
	}

	this.showState = function() {
		push();
		noFill();
		translate(this.pos.x, this.pos.y);
		ellipse(0, 0, 2 * this.radius);
		if (this.isFinal) {
			ellipse(0, 0, 1.8 * this.radius)
		}
		pop();
	}
	
	this.showTransitions = function() {
		for (var i = 0; i < this.transitionValues.length; i++) {
			var transitionValue = this.transitionValues[i];
			this.showTransition(transitionValue);
		}
	}

	this.showTransition = function(transitionValue) {
		push();
		fill(200);
		var nextState = this.transitions[transitionValue];
		var endState = states[nextState];
		
		var start = this.pos.copy();
		var end = endState.pos.copy();
		var direction = p5.Vector.sub(end, start);
		var angle = p5.Vector.angleBetween(direction, createVector(1, 0));
		console.log(angle);
		var dx = STATE_RADIUS * cos(angle);
		var dy = STATE_RADIUS * sin(angle);
		
		line(start.x + dx, start.y - dy, end.x - dx, end.y + dy);
		pop();

		this.drawTransitionArrow(end, direction);
		this.drawTransitionText(start, end, transitionValue);
	}
	
	this.drawTransitionText = function(start, end, txt) {
		var mid = p5.Vector.add(start, end).mult(0.5);
		push();
		fill(0);
		translate(mid.x, mid.y);
		text(txt, 10, -10);
		pop();
	}

	this.drawTransitionArrow = function (endPoint, transitionDirection) {
		
	}

	this.addTransition = function(nextState, transitionValue) {
		this.transitions[transitionValue] = nextState;
		this.transitionValues.push(transitionValue);
	}

	this.toggleIsFinal = function() {
		this.isFinal = !this.isFinal;
	}
}
