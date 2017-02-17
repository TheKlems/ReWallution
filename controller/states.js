var states = {
	menuStart: function () {
		$(".container-menu").show();

		var user = new User(airconsole.getDeviceId());

		// airconsole API events bindings
		airconsole.onMessage = function(id, json) {
			user.updateData(json);
		};

		// button bindings
		$("#launch-game").click(function() { user.sendAction("start-game")});
		$("#drop").click(function() { user.sendAction("drop")});
		$("#rotate").click(function() { user.sendAction("rotate")});
		$("#jump").click(function() { user.sendAction("jump")});
		$("#switch").click(function() { user.sendAction("switch")});

		function User(id) {
			this.id = id;
			this.username = airconsole.getNickname(id);
			this.picture = airconsole.getProfilePicture(id);
			this.isTrump = false;
		}

		User.prototype.updateData = function(json) {
			console.log(json);
			var action = JSON.parse(json).action;

			if (action == "start-trump") {
				this.isTrump = true;

				this.displayView("trump");
			}
			else if (action == "start-mexican") {
				this.displayView("mexican");
			}
			else if (action == "drope-false") {

			}
			else if (action == "drope-true") {

			}
		};

		User.prototype.sendAction = function(action) {
			airconsole.message(0, JSON.stringify({"action" : action}));
		};

		User.prototype.displayView = function(view) {
			$(".container").hide();
			$(".container-" + view).show();
		}
	},


	startTransition: function () {
		console.log("Menu");
	},
	game: function () {
		console.log("Menu");
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

console.log(states);
