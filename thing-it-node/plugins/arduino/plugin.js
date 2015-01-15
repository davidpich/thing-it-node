module.exports = {
	create : function(device) {
		return new Arduino();
	}
};

var utils = require("../../utils");
var q = require('q');

function Arduino() {
	this.plugin = "arduino";
	this.label = "Arduino Uno";
	this.manufacturer = "Arduino";
	this.connectionTypes = [ "USB", "ZigBee", "Ethernet", "Wifi" ];
	this.dataTypes = {
		digital : {
			type : "enumeration",
			values : [ {
				id : "0"
				label : "0"
			}, {
				id : "1"
				label : "1"
			}, {
				id : "2"
				label : "2"
			}, {
				id : "~3"
				label : "~3"
			}, {
				id : "4"
				label : "4"
			}, {
				id : "~5"
				label : "~5"
			}, {
				id : "~6"
				label : "~6"
			}, {
				id : "7"
				label : "7"
			}, {
				id : "8"
				label : "8"
			}, {
				id : "~9"
				label : "~9"
			}, {
				id : "~10"
				label : "~10"
			}, {
				id : "~11"
				label : "~11"
			}, {
				id : "12"
				label : "12"
			}, {
				id : "13"
				label : "13"
			} ]
		},
		analogIn : {
			type : "enumeration",
			values : [ {
				id : "A0"
				label : "A0"
			}, {
				id : "A1"
				label : "A1"
			}, {
				id : "A2"
				label : "A2"
			}, {
				id : "A3"
				label : "A3"
			}, {
				id : "A4"
				label : "A4"
			}, {
				id : "A5"
				label : "A5"
			} ]
		}
	}, this.actorTypes = [ {
		plugin : "led",
		label : "LED",
		family : "light",
		services : [ {
			id : "on",
			label : "On"
		}, {
			id : "off",
			label : "Off"
		}, {
			id : "blink",
			label : "Blink"
		} ],
		state : [ {
			id : "light",
			name : "Light"
		} ],
		configuration : [ {
			label : "Pin",
			id : "pin",
			type : "deviceDefined"
		} ]
	}, {
		plugin : "lcd",
		label : "LCD Display",
		family : "textDisplay",
		services : [ {
			id : "clear",
			label : "Clear",
			parameters : []
		}, {
			id : "print",
			label : "Print",
			parameters : [ {
				label : "Text",
				id : "text",
				type : "string"
			} ]
		}, {
			id : "cursorAt",
			label : "Cursor At",
			parameters : [ {
				label : "Row",
				id : "row",
				type : "integer"
			}, {
				label : "Column",
				id : "column",
				type : "integer"
			} ]
		} ],
		state : [ {
			id : "text",
			name : "Text"
		}, {
			id : "row",
			name : "Row"
		}, {
			id : "column",
			name : "Column"
		} ],
		configuration : [ {
			label : "RS Pin",
			id : "rsPin",
			type : "deviceDefined"
		}, {
			label : "EN Pin",
			id : "enPin",
			type : "deviceDefined"
		}, {
			label : "DB4 Pin",
			id : "db4Pin",
			type : "deviceDefined"
		}, {
			label : "DB5 Pin",
			id : "db5Pin",
			type : "deviceDefined"
		}, {
			label : "DB6 Pin",
			id : "db6Pin",
			type : "deviceDefined"
		}, {
			label : "DB7 Pin",
			id : "db7Pin",
			type : "deviceDefined"
		}, {
			label : "Bit-Mode",
			id : "bitMode",
			type : "deviceDefined"
		} ]
	}, {
		plugin : "servo",
		label : "Servo",
		family : "servo",
		services : [ {
			id : "sweep",
			label : "Sweep",
			parameters : []
		} ],
		state : [ {
			id : "position",
			name : "Position"
		} ],
		configuration : [ {
			label : "Pin",
			id : "pin",
			type : "deviceDefined"
		}, {
			label : "Is Inverted",
			id : "isInverted",
			type : "boolean"
		}, {
			label : "Start At",
			id : "startAt",
			type : "integer",
			defaultValue : 0
		}, {
			label : "Center",
			id : "center",
			type : "boolean"
		} ]
	}, {
		plugin : "relay",
		label : "Relay",
		family : "switch",
		services : [ {
			id : "open",
			label : "Open"
		}, {
			id : "close",
			label : "Close"
		} ],
		state : [ {
			id : "gate",
			name : "Switch"
		} ],
		configuration : [ {
			label : "Pin",
			id : "pin",
			type : "deviceDefined"
		}, {
			label : "Type",
			id : "type",
			type : "enumeration",
			values : [ {
				label : "Normally Open",
				id : "NO"
			}, {
				label : "Normally Close",
				id : "NC"
			} ]
		} ]
	} ];
	this.sensorTypes = [ {
		plugin : "potentiometer",
		label : "Potentiometer",
		family : "rangeSensor",
		unit : "Degrees",
		configuration : [ {
			label : "Pin",
			id : "pin",
			type : "deviceDefined"
		}, {
			label : "Rate",
			id : "rate",
			type : "integer",
			defaultValue : 1000,
			unit : "ms"
		} ]
	}, {
		plugin : "photocell",
		label : "Photocell",
		family : "rangeSensor",
		unit : "LUX",
		configuration : [ {
			label : "Pin",
			id : "pin",
			type : "deviceDefined"
		}, {
			label : "Rate",
			id : "rate",
			type : "integer",
			defaultValue : 1000,
			unit : "ms"
		} ]
	}, {
		plugin : "button",
		label : "Button",
		family : "button",
		configuration : [ {
			label : "Pin",
			id : "pin",
			type : "deviceDefined"
		}, {
			label : "Holdtime",
			id : "holdtime",
			type : "integer",
			defaultValue : 500,
			unit : "ms"
		}, {
			label : "Send Click Events",
			id : "sendClickEvents",
			type : "boolean",
			defaultValue : true
		}, , {
			label : "Send Down Events",
			id : "sendDownEvents",
			type : "boolean",
			defaultValue : false
		}, {
			label : "Send Down Events",
			id : "sendDownEvents",
			type : "boolean",
			defaultValue : false
		}, {
			label : "Send Hold Events",
			id : "sendHoldEvents",
			type : "boolean",
			defaultValue : false
		}, {
			label : "Holdtime",
			id : "holdtime",
			type : "integer",
			defaultValue : 500,
			unit : "ms"
		} ]
	} ];

	/**
	 * 
	 */
	Arduino.prototype.start = function() {
		var deferred = q.defer();
		var self = this;

		if (this.isSimulated()) {
			self.startDevice().then(function() {
				deferred.resolve();
			}).fail(function() {
				deferred.reject();
			});
		} else {
			var five = require("johnny-five");
			var board = new five.Board();

			board.on("ready", function() {
				self.startDevice().then(function() {
					deferred.resolve();
				}).fail(function(error) {
					deferred.reject(error);
				});
			});
		}

		return deferred.promise;
	};
}
