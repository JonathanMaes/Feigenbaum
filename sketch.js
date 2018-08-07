let start = 2.5;      // the x coordinate corresponding to the left of the screen
let end = 4;         // the x coordinate corresponding to the right of the screen
let smoothness;     // the number of positions on the x-axis for which the diagram will be calculated
let detail = 3;    // the number of x-axis poins calculated, per pixel.
let cutoff = 512; // the maximum number of pixels displayed at every calculated x-coordinate
let maxFrame;    // something

let frame = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	smoothness = width*detail;
	maxFrame = (end-start)*smoothness;
	stroke(255, 100/detail);
	background(0);
	strokeWeight(1);
}

function draw() {
	if (!mouseIsPressed && !touches.length>0) {
		m = millis();
		while (millis() - m < 17) { // 17 = 1000/60 = millis per frame
			doIteration();
		}
	}
}

function iterate(l, x, n) {
	let list = [x];
	for (let i = 0; i < n; i++) {
		let y = list[i];
		list.push(l*y*(1-y));
	}
	return list
}

function convergence(l, x=0.5, n=10000, b=0.0001) {
	l = iterate(l, x, n);
	let v = l[l.length-1];
	for (let i = l.length-2; i > l.length-n/10; i--) {
		if (Math.abs(l[i] - v) < b) {
			return l.slice(i, l.length-1);
		}
	}
	return l
}

function doIteration() {
	if (frame < maxFrame) {
		let i = frame/smoothness+start;
		points = convergence(i, x=0.5, n=10000, b=0.0001);
		for (let j = 0; j < Math.min(points.length, cutoff); j++) {
			point((i-start)*width/(end-start),height-points[j]*height)
		}
	}
	frame++;
}

function keyPressed() {
	if (key == 's') {
		saveCanvas("Feigenbaum","png");
	}
}