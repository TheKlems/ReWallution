var airconsole;
var engine;
var render;
var runner;

var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies;


function init() {
	//setupAirconsole();
	setupMatter();
	states.game();
}

function setupMatter() {
	runner = Runner.create({
		delta: 1000 / 60,
		enabled: true
	});
	engine = Engine.create();
	console.log($('body'));
	render = Render.create({
		element: $('game'),
		engine: engine,
		wireframes: true
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
