var states = {
	menuStart: function () {
		$(".container-menu").show();

		console.log(airconsole.getDeviceId());

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
			console.log(id);
			this.username = airconsole.getNickname(id);
			console.log(this.username);
			this.picture = airconsole.getProfilePicture(id);
			this.isTrump = false;

			$("#nickname").html(this.username);
			console.log("######################################################");
		}

		User.prototype.updateData = function(json) {
			console.log(json);
			var action = JSON.parse(json).action;

			if (action == "start-trump") {
				this.isTrump = true;

				this.transitionGame("trump");
			}
			else if (action == "start-mexican") {
				this.transitionGame("mexican");
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
		};

		User.prototype.transitionGame = function(role) {
			// copy of reference
			var user = this;

			this.displayView("info");

			var actionsT = [
				function() {
					user.displayView("info-"+role);
				},
				function() {
					user.displayView("countdown");
					$("#countdown-div").text("3");
					airconsole.vibrate(1000);
				},
				function() {
					$("#countdown-div").text("2");
				},
				function() {
					$("#countdown-div").text("1");
				},
				function() {
					user.displayView(role);
				}
			]
			var i = 0;
			var interval = window.setInterval(function() {
				actionsT[i]();
				i++;

				if (i >= actionsT.length) {
					window.clearInterval(interval);
				};
			}, 1000);
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
