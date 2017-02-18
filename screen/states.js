var users;
var displayView;
var firstGameFlag = true;
var playing = false;

var states = {
	menuStart: function () {
		// Renders view in argument
		displayView = function(view) {
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
			delete users[id];
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

			if (playing) {
				this.clientAction("busy");
			}
		}

		User.prototype.displayWaiting = function() {
			$(".message-wait").hide();

			this.div = $(".user-div-generic").clone().removeClass("user-div-generic");
			this.div.children(".user-name").text(this.username);
			this.div.children(".user-picture").attr("src", this.picture);
			this.div.children().children(".span-score").text(this.score);

			this.div.appendTo("#menu-div");
		};

		User.prototype.hideWaiting = function() {
			this.div.remove();
		};

		User.prototype.updateData = function(json) {
			var action = JSON.parse(json).action;

			console.log(action);

			// user launching the game is trump
			if (action == "start-game" && !playing) {
				
				var i = 0;
				console.log(Object.keys(users).length);
				var rand = Math.floor(Math.random() * (Object.keys(users).length-1));
				console.log(rand);

				for (var id in users) {
					console.log(firstGameFlag);
					console.log(i, rand);
					users[id].isTrump = false;
					if (i == rand) {
						users[id].isTrump = true;
					}

					i++;

					var actionToSend = (users[id].isTrump ? "start-trump" : "start-mexican");
					users[id].clientAction(actionToSend);
				}

				playing = true;

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
		trump.user.clientAction("lose");

		for (p in players) {
			players[p].user.score += 1;
			players[p].user.clientAction("win");
		}

		states.menuGameOver();
	},
	trumpWins: function () {
		console.log(trump.user, "trump wins");
		trump.user.score += 3;	
		trump.user.clientAction("win-trump");

		for (p in players) {
			players[p].user.clientAction("lose");
		}

		states.menuGameOver();
	},
	menuGameOver: function () {
		game.destroy();

		playing = false;

		for (var id in users) {
			console.log("score ", users[id].score);
			users[id].div.children().children(".span-score").text(users[id].score);

			window.setTimeout(function() {
				users[id].clientAction("ready");
			}, 3000);
		}

		displayView("menu");
	},
	swapTrump: function () {
		console.log("Menu");
	},

};
