

function State(x, y, r) {
	this.pos = createVector(x, y);
	this.radius = r;
	this.isFinal = false;

	this.show = function() {
		push();
		noFill();
		translate(this.pos.x, this.pos.y);
		ellipse(0, 0, 2 * this.radius);
		pop();
	}
}
