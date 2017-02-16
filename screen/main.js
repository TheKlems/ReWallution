var airconsole;
var engine;
var render;


function init() {
	setupAirconsole();
	setupMatter();
	states.menuStart();
}

function setupMatter() {
	engine = Matter.Engine.create();
	render = Matter.Engine.create({
		element: document.body,
		engine: engine
	});
}

function setupAirconsole() {
	airconsole = new AirConsole();
	console.log("hi console");
	airconsole.onConnect = function(device_id) {
		console.log("connection: '" + device_id + "'");
			
	};
	console.log(airconsole);
}
