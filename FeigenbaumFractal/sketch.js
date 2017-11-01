let start = 2.5;
let end = 4;
let smoothness;
let cutoff = 512;
let maxFrame;

let frame = 0;
let drawing = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	smoothness = width*3;
	maxFrame = (end-start)*smoothness;
	stroke(255, 30);
	background(0);
	strokeWeight(1);
}

function draw() {
	if (mouseIsPressed || touches.length>0 || drawing) {
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

function removeControlDiv() {
	document.getElementById('controlswrapper').style = "display:none";
}

function keyPressed() {
	if (key == ' ') {
		drawing = !drawing;
	} else if (key == 's') {
		saveCanvas("Feigenbaum","png");
	}
	removeControlDiv();
}

function mousePressed() {
	removeControlDiv();
}