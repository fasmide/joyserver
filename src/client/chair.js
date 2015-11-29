var debug = require('debug')('Chair');

var Chair = module.exports = function() {
	this.lastImageStamp = Date.now();
	this.connect();
	this.startImageAgeUpdate();
};

Chair.prototype.connect = function() {
	var loc = window.location, new_uri;
	if (loc.protocol === "https:") {
	    new_uri = "wss:";
	} else {
	    new_uri = "ws:";
	}
	new_uri += "//" + loc.host;
	new_uri += loc.pathname ;

	this.socket = new WebSocket(new_uri);
	this.socket.onmessage = this.onMessage.bind(this);
	this.socket.onopen = this.onOpen.bind(this);

};
Chair.prototype.startImageAgeUpdate = function() {
	this.imageAgeUpdateInterval = setInterval(function() {
		var ms = Date.now() - this.lastImageStamp;
		if (ms > 500) {
			$("#imageAge").addClass("text-danger");
			$("#imageAge").removeClass("text-success");

		} else {
			$("#imageAge").addClass("text-success");
			$("#imageAge").removeClass("text-danger");
		}
		$('#imageAge').text(Date.now() - this.lastImageStamp + "ms");

	}.bind(this), 20);
};

Chair.prototype.onMessage = function(data) {

	data = JSON.parse(data.data);

	if(data.type == 'image') {
		this.onImage(data.data);
		return;
	} 

	if (data.type == 'control') {
		this.onControl(data.data);
		return;
	}

	debug("had unknown data: %s", data.type);

};

Chair.prototype.onControl = function(data) {
	$('#batteryLevel').text(data.battery);
	$('#speedLevel').text(data.speed);
};

Chair.prototype.onImage = function(img) {
	this.lastImageStamp = Date.now();
	document.getElementById('viewFinder').setAttribute( 'src', 'data:image/jpg;base64,' + img );	
};

Chair.prototype.onOpen = function() {
	debug("We are connected to the server!");
};