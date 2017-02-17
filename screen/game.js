var game,
	players,
	trump,
	blocks,
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
	game.load.image('block', 'assets/block.png');
	game.load.image('mexican', 'assets/mexican.png');
	game.load.image('trump', 'assets/trump.png');
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

	trump = game.add.sprite(80, 0, 'trump');
	game.physics.arcade.enable(trump);
	trump.velocity = {x: 250, y: 0};
	trump.body.velocity.x = trump.velocity.x;
	trump.block = game.add.group();
	getRandomBlock(trump.block);
	trump.hasBlock = true;
	console.log(trump.block);

	for (var p in players) {
		var player = players[p];
		game.physics.arcade.enable(player);
		player.body.gravity.y = 600;
		player.body.collideWorldBounds = true;	
		player.velocity = {x: 150, y: 0};
		player.body.velocity.x = player.velocity.x;
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

		if (game.input.keyboard.createCursorKeys().up.isDown
			&& player.body.touching.down) {
			player.body.velocity.y = -350;	
		}

		if (game.physics.arcade.collide(player, walls)) {
			player.velocity.x *= -1;
			player.body.velocity.x = player.velocity.x;
		}
	}
}

function updateTrump () {
	if (game.physics.arcade.collide(trump, walls)) {
		trump.velocity.x *= -1;
		trump.body.velocity.x = trump.velocity.x;
	}
	if (game.input.keyboard.createCursorKeys().down.isDown
			&& trump.hasBlock) {
			trump.block.setAll('velocity.y', 200);
			trump.hasBlock = false;
	}
}

function updateBlock () {
	
	console.log(trump);
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
