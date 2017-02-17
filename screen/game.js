var game,
	players,
	trump,
	blocks,
	walls,
	platforms,
	fixedBlocks;

function game_init() {
	game = new Phaser.Game(960, 800, Phaser.CANVAS,
		'game', {preload: this.preload, create: this.create,
		update: this.update, render: this.render});
}

function preload() {

	var imageKeys = ['background', 'ground', 'wall', 'block', 'mexican', 'trump'];
	for (k in imageKeys) {
		var key = imageKeys[k];
		game.load.image(key, 'assets/' + key + '.png');
	}

	var mexicanSoundKeys = ['si-senor', 'mucho-pepito', 'tacos-gracias', 'ay-caramba', 'por-favor', 'jamon-pueblo', 'jajaja'];
	for (k in mexicanSoundKeys) {
		var key = mexicanSoundKeys[k];
		game.load.audio(key, 'sounds/' + key + '.mp3');
		game.sound.add(key);
	}

	game.sound.mexican = function () {
		return mexicanSoundKeys[Math.floor(Math.random() * mexicanSoundKeys.length)];
	};

	var trumpSoundKeys = ['build-a-wall'];
	for (k in trumpSoundKeys) {
		var key = trumpSoundKeys[k];
		game.load.audio(key, 'sounds/' + key + '.mp3');
		game.sound.add(key);
	}

	game.sound.trump = function () {
		return trumpSoundKeys[Math.floor(Math.random() * trumpSoundKeys.length)];
	};
}

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.disableVisibilityChange = true;

	game.add.image(0, 0, 'background');

	fixedBlocks = game.add.group();
	fixedBlocks.enableBody = true;

	platforms = game.add.group();
	platforms.enableBody = true;
	var ground = platforms.create(0, game.world.height 
		- game.cache.getImage('ground').height, 'ground');
	ground.body.immovable = true;

	walls = game.add.group();
	walls.enableBody = true;
	var wallLeft = walls.create(0, 0, 'wall');
	var wallRight = walls.create(game.world.width
		- game.cache.getImage('wall').width, 0, 'wall');
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
					trump.block.setAll('body.velocity.y', 200);
					trump.block.setAll('body.immovable', true);
					trump.hasBlock = false;
					game.sound.play(game.sound.trump());
				}
			};

			continue;
		}

		var player = game.add.sprite(32 + u * 160, game.world.height 
			- game.cache.getImage('ground').height 
			- game.cache.getImage('mexican').height, 'mexican');
		player.user = users[u];
		player.user.onAction = function(action) {
			if (action == 'jump' && player.body.touching.down) {
				player.body.velocity.y = -450;
				game.sound.play(game.sound.mexican());
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
	
	game.physics.arcade.collide(trump.block, platforms, landed);
	
	game.physics.arcade.collide(trump.block, players, playerHit);
	/*
	if(fixedBlocks.length>0){
		for(g in fixedBlocks){
			game.physics.arcade.collide(trump.block, fixedBlocks[g], landed);
		}
	}
	*/
	if(trump.hasBlock){
		trump.block.x = trump.body.x;
	}
}

function landed(){
	//console.log("start landed");
	trump.block.setAll('body.velocity.y', 0);
	fixedBlocks.add(trump.block);
	trump.block = game.add.group();
	getRandomBlock(trump.block);
	trump.hasBlock = true;
	//console.log("end landed");
}

function playerHit(){
	for(p in players){
		if(players[p].body.touching.up){
			players[p].kill();
		}
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
