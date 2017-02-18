var airconsole;

function init() {
	setupAirconsole();
	states.menuStart();
}

function setupAirconsole() {
	airconsole = new AirConsole();
	airconsole.onConnect = function(device_id) {
		i//console.log("connection: '" + device_id + "'");
	};
}
