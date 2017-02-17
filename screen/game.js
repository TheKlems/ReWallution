var game,
	players,
	trump,
	blocks,
	walls,
	platforms;

function game_init() {
	game = new Phaser.Game(880, 880, Phaser.CANVAS,
		'game', {preload: this.preload, create: this.create,
		update: this.update, render: this.render});
}

function preload() {
	game.load.image('background', 'assets/background.png');
	game.load.image('ground', 'assets/ground.png');
	game.load.image('wall', 'assets/wall.png');
	game.load.image('block', 'assets/block.png');
	game.load.image('mexican', 'assets/mexican.png');
	game.load.image('trump', 'assets/trump.png');
}

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.disableVisibilityChange = true;
	platforms = game.add.group();
	platforms.enableBody = true;

	game.add.sprite(0, 0, 'background');

	var ground = platforms.create(0, game.world.height - 64,
		'ground');
	ground.body.immovable = true;

	walls = game.add.group();
	walls.enableBody = true;
	var wallLeft = walls.create(0, 0, 'wall');
	var wallRight = walls.create(game.world.width - 32, 0, 'wall');
	walls.setAll('body.immovable', true);

	trump = game.add.sprite(80, 0, 'trump');
	game.physics.arcade.enable(trump);
	trump.body.velocity.x = 250;
	trump.body.bounce.x = 1;
	trump.block = game.add.group();
	getRandomBlock(trump.block);
	trump.hasBlock = true;

	players = [];

	for (var u in users) {

		if (users[u].isTrump) {
			trump.user = users[u];
			trump.user.onAction = function(action) {
				if (action == 'drop' && trump.hasBlock) {
					trump.block.setAll('velocity.y', 200);
					trump.hasBlock = false;
				}
			};

			continue;
		}

		var player = game.add.sprite(32 + u * 160, game.world.height - 350, 'mexican');
		player.user = users[u];
		player.user.onAction = function(action) {
			if (action == 'jump' && player.body.touching.down) {
				player.body.velocity.y = -450;
			}

			else if (action == 'switch') {
				player.body.velocity.x *= -1;
			}
		}

		game.physics.arcade.enable(player);
		player.body.gravity.y = 600;
		player.body.collideWorldBounds = true;	
		player.body.velocity.x = 150;
		player.body.bounce.x = 1;
		players.push(player);
	}

	

}

function update() {
	updatePlayers();
	updateTrump();
	updateBlock();
}

function updatePlayers () {
	for (var p in players) {
		var player = players[p];
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, walls);
		game.physics.arcade.collide(player, players);
	}
}

function updateTrump () {

	game.physics.arcade.collide(trump, walls);
}

function updateBlock () {
	
	if(trump.hasBlock){
		trump.block.x = trump.body.x;
	}else{
		trump.block.y = trump.block.y+10;
	}
}

function getRandomBlock(group) {
		var bSize = 80;

		var nOfBlocks = Math.floor((Math.random()*4)+1);
		var version3 = Math.floor((Math.random()*2)+1);
		var version4 = Math.floor((Math.random()*7)+1);

		for (var i = 0; i<nOfBlocks*80; i+=80){
			group.create((i-nOfBlocks/2)*80, 60, 'block');
		}
		if(nOfBlocks == 3 && version3 == 2){
			group.xy(0,-80,60);
			group.xy(1,0,60);
			group.xy(2,0,140);
		}
		if(nOfBlocks==4){
			switch(version4){
				case 1:
					group.xy(0,-120,60);
					group.xy(1,-40,60);
					group.xy(2,40,60);
					group.xy(3,-40,140);
					break;
				case 2:
					group.xy(0,-120,60);
					group.xy(1,-40,60);
					group.xy(2,40,60);
					group.xy(3,-120,140);
					break;
				case 3:
					group.xy(0,-120,60);
					group.xy(1,-40,60);
					group.xy(2,40,60);
					group.xy(3,40,140);
					break;
				case 4:
					group.xy(0,-120,60);
					group.xy(1,-40,60);
					group.xy(2,-40,140);
					group.xy(3,40,140);
					break;
				case 5:
					group.xy(0,-120,140);
					group.xy(1,-40,140);
					group.xy(2,-40,60);
					group.xy(3,40,60);
					break;
				case 6:
					group.xy(0,-80,60);
					group.xy(1,0,60);
					group.xy(2,-80,140);
					group.xy(3,0,140);
					break;
				default:
					break;
			}
		}
		
		group.setAll('enableBody', true);
		game.physics.arcade.enable(group);

		return;
}

function render() {

}
