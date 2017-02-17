var states = {
	menuStart: function () {
		$(".container-menu").show();

		var user = new User(airconsole.getDeviceId());

		airconsole.onMessage = function(id, json) {
			user.updateData(json);
		};

		$("#launch-game").click(function() {
			user.sendAction("start-game");
		});

		function User(id) {
			this.id = id;
			this.username = airconsole.getNickname(id);
			this.picture = airconsole.getProfilePicture(id);
			this.isTrump = false;
		}

		User.prototype.updateData = function(json) {
			console.log(json);
			var action = JSON.parse(json).action;
			console.log(action);

			$("body").append(action);

			if (action == "start-trump") {
				this.isTrump = true;

				console.log("yohouhouo");
			}
			else if (action == "start-mexican") {

			}
			else if (action == "drope-false") {

			}
			else if (action == "drope-true") {

			}
		};

		User.prototype.sendAction = function(action) {
			airconsole.message(0, JSON.stringify({"action" : action}));
		};
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
