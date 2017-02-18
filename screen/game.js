var game,
	players,
	trump,
	blocks,
	items,
	walls,
	platforms,
	fixedBlocks;

var BLOCK_LENGTH = 50;
var MEXICAN_LENGTH = 45;

var ITEM_KEYS = ['chili', 'tacos', 'burger'];

var userToPlayer = {};

var TOP_Y = 100;

var blockCollisionFlag = false;

function gameInit() {
	game = new Phaser.Game(960, 800, Phaser.CANVAS,
		'game', {preload: this.preload, create: this.create,
		update: this.update, render: this.render});
}

function preload() {

	var imageKeys = ['background', 'ground', 'wall', 'trump'];
	for (k in imageKeys) {
		var key = imageKeys[k];
		game.load.image(key, 'assets/' + key + '.png');
	}
	game.load.image("block", "assets/block_" + BLOCK_LENGTH + ".png");
	game.load.image("mexican", "assets/mexican_" + MEXICAN_LENGTH + ".png");

	var mexicanSoundKeys = ['si-senor', 'mucho-pepito', 'tacos-gracias',
		'ay-caramba', 'por-favor', 'jamon-pueblo', 'jajaja'];
	for (k in mexicanSoundKeys) {
		var key = mexicanSoundKeys[k];
		game.load.audio(key, 'sounds/' + key + '.mp3');
		game.sound.add(key);
	}

	game.sound.mexican = function () {
		return mexicanSoundKeys[Math.floor(Math.random() * mexicanSoundKeys.length)];
	};

	var trumpSoundKeys = ['build-a-wall', 'america-great-again',
		'kill-terrorist', 'mexico-pay', 'really-rich'];
	for (k in trumpSoundKeys) {
		var key = trumpSoundKeys[k];
		game.load.audio(key, 'sounds/' + key + '.mp3');
		game.sound.add(key);
	}

	game.sound.trump = function () {
		return trumpSoundKeys[Math.floor(Math.random() * trumpSoundKeys.length)];
	};

	var miscSoundKeys = ['jump', 'brick-landed', 'brick-drop'];
	for (k in miscSoundKeys) {
		var key = miscSoundKeys[k];
		game.load.audio(key, 'sounds/' + key + '.mp3');
		game.sound.add(key);
	}

	game.load.audio('game-music', 'sounds/game-music.mp3');
	game.sound.add('game-music');
}

function create() {

	game.sound.play('game-music', 0.1);
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.disableVisibilityChange = true;

	game.add.image(0, 0, 'background');

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

	// Fixed blocks after walls 
	fixedBlocks = game.add.group();
	fixedBlocks.enableBody = true;

	items = game.add.group();
	items.keys = ITEM_KEYS;
	items.timer = game.time.add(new Phaser.Timer(game));
	items.timer.loop(5 * Phaser.Timer.SECOND, function () {
		console.log("loop");
		console.log(items);
		if (items.children.length < 3 && Math.random() < 0.66) {
			var key = items.keys[Math.floor(Math.random() * items.keys.length)];
			console.log("lucky");
			item = items.create(Math.random() * game.world.width,
				Math.random() * game.world.height, key);
			item.destroyEvent = items.timer.add(10 * Phaser.Timer.SECOND,
				function () {
					items.remove(item);
					item.destroy();
			}, this);
		} 
	}, this);
	items.timer.start();

	trump = game.add.sprite(80, 0, 'trump');
	game.physics.arcade.enable(trump);
	trump.body.velocity.x = 250;
	trump.body.bounce.x = 1;
	trump.block = game.add.group();
	getRandomBlock(trump.block);
	trump.hasBlock = true;

	players = [];
	var iPlayer = 0;

	// Heyyyyyyy...
	for (var u in users) {

		if (users[u].isTrump) {
			trump.user = users[u];
			trump.user.onAction(function(id, action) {
				if (action == 'drop' && trump.hasBlock) {
					var isOver = false;
					trump.block.enableBody = true;
					trump.block.setAll('enableBody', true);
					game.physics.arcade.enable(trump.block);

					trump.block.setAll('body.velocity.y', 400);
					trump.block.setAll('body.immovable', true);
					trump.hasBlock = false;
					game.sound.play(game.sound.trump());
					game.sound.play('brick-drop', 0.7);

				}else if(action == 'rotate' && trump.hasBlock) {
					for (b in trump.block.children) {
						// It just works.
						var block = trump.block.children[b];
						var tmp = block.x;
						block.x = block.y;
						block.y = -tmp;
					}
				}
			});

			continue;
		}

		var player = game.add.sprite(32 + u * 160, game.world.height 
			- game.cache.getImage('ground').height 
			- game.cache.getImage('mexican').height, 'mexican');
		player.alive = true;
		player.user = users[u];

		player.user.onAction(function(id, action) {
			var playerSafe = players[userToPlayer[id]];

			if (action == 'jump' && playerSafe.body.touching.down) {
				console.log(playerSafe);
				playerSafe.body.velocity.y = -650;
				game.sound.play(game.sound.mexican());
				game.sound.play('jump', 0.2);
			}

			else if (action == 'switch') {
				playerSafe.body.velocity.x *= -1;
			}
		});

		game.physics.arcade.enable(player);
		player.body.gravity.y = 900;
		player.body.collideWorldBounds = true;	
		player.body.velocity.x = 250;
		player.body.bounce.x = 1;
		players.push(player);

		userToPlayer[player.user.id] = iPlayer;

		iPlayer++;
	} // ...yyyy! Howdy!

	

}

function update() {
	updateBlock();
	updateTrump();
	updatePlayers();
	updateItems();
}

function updatePlayers () {
	var alivePlayers = 0;

	for (var p in players) {
		var player = players[p];
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, walls);
		game.physics.arcade.collide(player, players);

		if (player.body.y < trump.body.height) {
			states.mexicanWins(player.user);
		}
		alivePlayers += player.alive;
	}

	if (alivePlayers == 0) {
		states.trumpWins();
	}
}

function updateItems () {
	for (p in players) {
		game.physics.arcade.overlap(players[p], items, powerup);
	}	
}

function updateTrump () {

	game.physics.arcade.collide(trump, walls);
}

function updateBlock () {
	blockCollisionFlag = false;
	
	game.physics.arcade.collide(trump.block, platforms, landed);

	for (p in players) {
		game.physics.arcade.collide(trump.block, players[p], playerHit);
	}
	
	if(fixedBlocks.length>0){
		fixedBlocks.forEach(game.physics.arcade.collide, game.physics.arcade, this, trump.block, landed);
		fixedBlocks.forEach(game.physics.arcade.collide, game.physics.arcade, this, players);
	}
	

	if(trump.hasBlock){
		trump.block.x = trump.body.x+trump.body.width/2-trump.block.width/2;
		trump.block.y = 100;
	}
}

function landed(){
	if (!blockCollisionFlag && !trump.hasBlock) {
		trump.block.setAll('body.velocity.y', 0);
		fixedBlocks.add(trump.block);
		trump.block = game.add.group();
		getRandomBlock(trump.block);
		trump.hasBlock = true;
		blockCollisionFlag = true;
		game.sound.play('brick-landed', 0.2);
	}
	
}

function playerHit(player){
	if(player.body.touching.up){
		player.user.clientAction("dead");
		player.kill();
	}
}

function getRandomBlock(group) {
		var s = BLOCK_LENGTH;

		var nOfBlocks = Math.floor((Math.random()*4)+1); // 1 - 4 number of blocks
		var version3 = Math.floor((Math.random()*2)+1); // 1 - 2 type of group with 3 blocks
		var version4 = Math.floor((Math.random()*7)+1); // 1 - 7 type of group with 4 blocks

		// creates sprite for each block
		for (var i = 0; i<nOfBlocks; i++){
			group.create(i*s, 0, 'block'); //
		}

		// piece of 3 blocks - 
		if(nOfBlocks == 3 && version3 == 2){
			group.xy(0, 0, 0);
			group.xy(1, s, 0);
			group.xy(2, 0, s);
		}

		if(nOfBlocks==4){
			switch(version4){
				case 1:
					// ###
					//  #
					group.xy(0, 0, 0);
					group.xy(1, s, 0);
					group.xy(2, 2*s, 0);
					group.xy(3, s, s);
					break;
				case 2:
					// ###
					// #
					group.xy(0, 0, 0);
					group.xy(1, s, 0);
					group.xy(2, 2*s, 0);
					group.xy(3, 0, s);
					break;
				case 3:
					// ###
					//   #
					group.xy(0, 0, 0);
					group.xy(1, s, 0);
					group.xy(2, 2*s, 0);
					group.xy(3, 2*s, s);
					break;
				case 4:
					// ##
					//  ##
					group.xy(0, 0, 0);
					group.xy(1, s, 0);
					group.xy(2, s, s);
					group.xy(3, 2*s, s);
					break;
				case 5:
					//  ##
					// ##
					group.xy(0, s, 0);
					group.xy(1, 2*s, 0);
					group.xy(2, 0, s);
					group.xy(3, s, s);
					break;
				case 6:
					// ##
					// ##
					group.xy(0,0,0);
					group.xy(1,s,0);
					group.xy(2,0,s);
					group.xy(3,s,s);
					break;
				default:
					break;
			}
		}
		group.setAll('enableBody', false);
		group.enableBody = false;

		return;
}

function powerup (player, item) {
	items.timer.remove(item.destroyEvent);

	switch (item.key) {}

	items.timer.add(5 * Phaser.Timer.SECOND, powerdown, this, player, item);
}

function powerdown (player, item) {
	// item-key logic	
	items.remove(item);
	item.destroy();
}

function render() {

}
