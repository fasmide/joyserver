var debug = require('debug')('JoyKeyboard');

var JoyKeyboard = module.exports = function(webSocket) {
	
	$('body').on('keyup', this.up.bind(this));
	$('body').on('keydown', this.down.bind(this));

	this.view = $('#xyLabel');

	this.x = 0;
	this.y = 0;

	this.down = {};

	setInterval(this.accelerate.bind(this), 16);

	setInterval(function() {
		webSocket.send(JSON.stringify({x: this.x, y: this.y, type:'direction'}));
	}.bind(this), 50);
};

JoyKeyboard.prototype.down = function(event) {
	this.down[event.keyCode] = true;
};

JoyKeyboard.prototype.up = function(event) {
	this.down[event.keyCode] = false;
};

JoyKeyboard.prototype.accelerate = function() {

	if (this.down[JoyKeyboard.FORWARD]) {
		this.x += JoyKeyboard.DEFAULT_ACCEL*2;
	}
	if (this.down[JoyKeyboard.BACK]) {
		this.x -= JoyKeyboard.DEFAULT_ACCEL*2;
	}
	if (this.down[JoyKeyboard.LEFT]) {
		this.y -= JoyKeyboard.DEFAULT_ACCEL*2;
	}
	if (this.down[JoyKeyboard.RIGHT]) {
		this.y += JoyKeyboard.DEFAULT_ACCEL*2;
	}

	//come closer to zero...
	if(this.x !== 0) {

		this.x = this.x > 0? this.x-JoyKeyboard.DEFAULT_ACCEL : this.x+JoyKeyboard.DEFAULT_ACCEL;
	}
	if(this.y !== 0) {

		this.y = this.y > 0? this.y-JoyKeyboard.DEFAULT_ACCEL : this.y+JoyKeyboard.DEFAULT_ACCEL;
	}


	//max values....
	if(this.y >= 100) {
		this.y = 100;
	}
	if(this.y <= -100) {
		this.y = -100;
	}
	
	if(this.x >= 100) {
		this.x = 100;
	}
	if(this.x <= -100) {
		this.x = -100;
	}
	this.view.text("X: " + this.x + "Y: " + this.y);
};

JoyKeyboard.FORWARD = 73; // i
JoyKeyboard.BACK = 75; // k
JoyKeyboard.LEFT = 74; // j
JoyKeyboard.RIGHT = 76; // l

JoyKeyboard.DEFAULT_ACCEL = 10;