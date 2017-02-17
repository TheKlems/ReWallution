var game,
	players,
	trump,
	walls,
	platforms;

function game_init() {
	game = new Phaser.Game(960, 880, Phaser.CANVAS,
		'game', {preload: this.preload, create: this.create,
		update: this.update, render: this.render});

	$('.container-game').show();
}

function preload() {
	game.load.image('background', 'assets/background.png');
	game.load.image('ground', 'assets/ground.png');
	game.load.image('wall', 'assets/wall.png');
	game.load.image('mexican', 'assets/mexican.png');
	//game.load.image('wall', 'assets/wall.png');
}

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	platforms = game.add.group();
	platforms.enableBody = true;

	var ground = platforms.create(0, game.world.height - 64,
		'ground');
	ground.body.immovable = true;

	walls = game.add.group();
	walls.enableBody = true;
	var wallLeft = walls.create(0, 0, 'wall');
	var wallRight = walls.create(game.world.width - 32, 0, 'wall');
	walls.setAll('body.immovable', true);

	players = [];
	players.push(game.add.sprite(32, game.world.height - 350,
		'mexican'));
	players.push(game.add.sprite(380, game.world.height - 350,
		'mexican'));
	game.physics.arcade.enable(players);

	for (var p in players) {
		player = players[p];
		player.body.gravity.y = 600;
		player.body.collideWorldBounds = true;	
		player.velocity = 150;
		player.body.velocity.x = player.velocity;
	}

}

function update() {
	var hitPlatform = game.physics.arcade.collide(players, platforms);
	updatePlayers();
}

function updatePlayers () {
	for (var p in players) {
		var player = players[p];

		if (game.input.keyboard.createCursorKeys().up.isDown
			&& player.body.touching.down) {
			player.body.velocity.y = -350;	
		}

		if (game.physics.arcade.collide(player, walls)) {
			player.velocity *= -1;
			player.body.velocity.x = player.velocity;
		}
	}
}

function render() {

}
