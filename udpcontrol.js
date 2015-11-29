var dgram = require("dgram");

var server = dgram.createSocket("udp4");
var debug = require('debug')('udpcontrol');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var UdpControl = module.exports = function() {
	this.start();
	this.lastPort = null;
	this.lastAddress = null;
};

util.inherits(UdpControl, EventEmitter);

UdpControl.prototype.start = function() {
	debug("Starting control");
	this.server = dgram.createSocket("udp4");

	this.server.on("error", function (err) {
		debug("control server error:\n" + err.stack);
		this.server.close();
	}.bind(this));

	this.server.on("message", function (msg, rinfo) {

		var data = {
			typ: msg.readUInt8(0),
			error: msg.readUInt8(1),
			unknown2: msg.readUInt8(2),
			battery: msg.readUInt8(3),
			speed: msg.readUInt8(4),
			crc: msg.readUInt8(5),
		}

		debug("control server got: " + data + " from " +
			rinfo.address + ":" + rinfo.port);

		this.lastAddress = rinfo.address;
		this.lastPort = rinfo.port;
		
		this.emit('control', data);

	}.bind(this));

	this.server.on("listening", function () {
		var address = this.server.address();
		debug("control server listening " +
			address.address + ":" + address.port);
	}.bind(this));

	this.server.bind(3001);
};

UdpControl.prototype.send = function(e) {
	if (!this.lastPort || !this.lastAddress) {
		return;
	}

	//socket.send(buf, offset, length, port, address[, callback])
	var buf = new Buffer(2);
	buf.writeInt8(e.x, 0);
	buf.writeInt8(e.y, 1);

	this.server.send(buf, 0, buf.length, this.lastPort, this.lastAddress);
};