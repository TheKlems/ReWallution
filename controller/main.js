var airconsole;


function init() {
	setupAirconsole();
	states.menuStart();
}

function setupAirconsole() {
	airconsole = new AirConsole({"orientation" : "landscape"});
	console.log("hi console");
	airconsole.onConnect = function(device_id) {
		console.log("connection: '" + device_id + "'");
			
	};
	console.log(airconsole);
}
