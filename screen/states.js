var users;

var states = {
	menuStart: function () {
		// Renders view in argument
		function displayView(view) {
			$(".container").hide();
			$(".container-"+view).show();
		}

		displayView("menu");

		users = {};

		airconsole.onConnect = function(id) {
			users[id] = new User(id);
		};

		airconsole.onDisconnect = function(id) {
			users[id].hideWaiting();
		};

		airconsole.onMessage = function(id, json) {
			console.log(json);
			users[id].updateData(json);
		};

		$("#button-help").click(function(){ displayView("help") });
		$("#button-help-back").click(function() { displayView("menu") } );

		function User(id) {
			this.id = id;
			this.username = airconsole.getNickname(id);
			this.picture = airconsole.getProfilePicture(id);
			this.score = 0;
			this.isTrump = false;

			this.displayWaiting();
		}

		User.prototype.displayWaiting = function() {
			$(".message-wait").hide();

			this.div = $(".user-div-generic").clone().removeClass("user-div-generic");
			this.div.children(".user-name").text(this.username);
			this.div.children(".user-picture").attr("src", this.picture);

			this.div.appendTo(".container-menu");
		};

		User.prototype.hideWaiting = function() {
			this.div.remove();
		};

		User.prototype.updateData = function(json) {
			var action = JSON.parse(json).action;

			console.log(action);

			// user launching the game is trump
			if (action == "start-game") {
				this.isTrump = true;

				for (var id in users) {
					var actionToSend = (users[id].isTrump ? "start-trump" : "start-mexican");
					users[id].clientAction(actionToSend);
				}

				window.setTimeout(function() {
					displayView("game");
					states.game();
				}, 5000);
			}
			else {
				this.actionCallback(this.id, action);
			}
		};

		User.prototype.clientAction = function(action) {
			airconsole.message(this.id, JSON.stringify({"action" : action}));
		};

		User.prototype.onAction = function(callback) {
			this.actionCallback = callback;
		};
	},


	startTransition: function () {
		console.log("Menu");
	},
	game: function () {gameInit()},
	mexicanWins: function (user) {
		console.log(user, "mexican wins");
		user.isTrump = true;
		trump.user.isTrump = false;

		for (p in players) {
			players[p].user.score += 1;
		}

		states.menuGameOver();
	},
	trumpWins: function () {
		console.log(trump.user, "trump wins");
		trump.user.score += 3;	

		states.menuGameOver();
	},
	menuGameOver: function () {
		game.destroy();
	},
	swapTrump: function () {
		console.log("Menu");
	},

};
