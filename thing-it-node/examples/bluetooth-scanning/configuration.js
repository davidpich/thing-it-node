module.exports = {
	label : "Home",
	id : "home",
	devices : [ {
		label : "Bluetooth",
		id : "bluetooth",
		plugin : "bluetooth",
		actors : [],
		sensors : [ {
			id : "genericDeviceDetector1",
			label : "Generic Detector 1",
			"type" : "genericDeviceDetector",
			"configuration" : {
				"deviceName" : "ZorgPhone",
				"interval" : 10000
			}
		} ]
	} ],
	services : [],
	eventProcessors : []
};
