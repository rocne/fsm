

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
		push();
		fill(100);
		for (var i = 0; i < this.transitionValues.length; i++) {
			var transitionValue = this.transitionValues[i];
			var nextState = this.transitions[transitionValue];
			var end = states[nextState];
			this.showTransition(end);
		}
		pop();		
	}

	this.showTransition = function(end) {
		line(this.pos.x, this.pos.y, end.pos.x, end.pos.y);		
	}

	this.addTransition = function(nextState, transitionValue) {
		this.transitions[transitionValue] = nextState;
		this.transitionValues.push(transitionValue);
	}

	this.toggleIsFinal = function() {
		this.isFinal = !this.isFinal;
	}
}
