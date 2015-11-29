var dgram = require("dgram");

var server = dgram.createSocket("udp4");
var debug = require('debug')('udp');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var UdpImages = module.exports = function() {
	this.lastImage = null;
	this.start();
};

util.inherits(UdpImages, EventEmitter);

UdpImages.prototype.start = function() {
	debug("Starting");
	this.server = dgram.createSocket("udp4");

	this.server.on("error", function (err) {
		debug("server error:\n" + err.stack);
		this.server.close();
	}.bind(this));

	this.server.on("message", function (msg, rinfo) {
		debug("server got: " + msg.length + " from " +
			rinfo.address + ":" + rinfo.port);
		
		this.lastImage = this;
		this.emit('image', msg);
	}.bind(this));

	this.server.on("listening", function () {
		var address = this.server.address();
		debug("server listening " +
			address.address + ":" + address.port);
	}.bind(this));

	this.server.bind(3000);
};

UdpImages.prototype.getLastImage = function() {
	return this.lastImage;
}