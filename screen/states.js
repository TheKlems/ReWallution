var states = {
	menuStart: function () {
		console.log("Menu");
	},
	startTransition: function () {
		console.log("Menu");
	},
	game: function () {

		player = new Player(10, 10);

		Engine.run(engine);
		Render.run(render);
	},
	mexicanWins: function () {
		console.log("Menu");
	},
	trumpWins: function () {
		console.log("Menu");
	},
	menuGameOver: function () {
		console.log("Menu");
	},
	swapTrump: function () {
		console.log("Menu");
	},

};
