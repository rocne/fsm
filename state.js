

function State(x, y, r) {
	this.pos = createVector(x, y);
	this.radius = r;
	this.isFinal = false;
	this.transitions = {};
	
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
		
	}

	this.addTransition = function(nextState, transitionValue) {
		this.transitions[transitionValue] = nextState;
	}

	this.toggleIsFinal = function() {
		this.isFinal = !this.isFinal;
	}
}
