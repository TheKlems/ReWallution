var airconsole;


function init() {
	setupConsole();
}


function setupConsole() {
	airconsole = new AirConsole();
	console.log("hi console");
	airconsole.onConnect = function(device_id) {
		console.log("connection: '" + device_id + "'");
			
	};
	console.log(airconsole);
}
