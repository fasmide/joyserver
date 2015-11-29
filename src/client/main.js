var Chair = require('./chair'),
	JoyKeyboard = require('./joykeyboard'),
	Debug = require('debug');
	
Debug.enable('*');
var debug = Debug('chair:main');


debug('Creating chair... ');
var chair = new Chair();

var keyboard = new JoyKeyboard(chair.socket);