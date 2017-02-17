var game,
	players,
	trump,
	blocks,
	walls,
	platforms,
	fixedBlocks;

var flag = false;

var TOP_Y = 100;

function game_init() {
	game = new Phaser.Game(960, 800, Phaser.CANVAS,
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

	console.log(game.load);
	game.load.audio('si-senor', 'sounds/si-senor.ogg');
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
				}
			};

			continue;
		}

		var player = game.add.sprite(32 + u * 160, game.world.height - 350, 'mexican');
		player.user = users[u];
		player.user.onAction = function(action) {
			if (action == 'jump' && player.body.touching.down) {
				player.body.velocity.y = -450;
				//game.sound.add('si-senor');
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
	flag = false;
	
	game.physics.arcade.collide(trump.block, platforms, landed);

	
	game.physics.arcade.collide(trump.block, players, playerHit);
	
	if(fixedBlocks.length>0){
		fixedBlocks.forEach(game.physics.arcade.collide, game.physics.arcade, this, trump.block, landed);
		fixedBlocks.forEach(game.physics.arcade.collide, game.physics.arcade, this, players);
	}
	

	if(trump.hasBlock){
		trump.block.x = trump.body.x;
	}
}

function landed(){
	if (!flag) {
		console.log("collision sol ou autre bloc");
		trump.block.setAll('body.velocity.y', 0);
		fixedBlocks.add(trump.block);
		trump.block = game.add.group();
		getRandomBlock(trump.block);
		trump.hasBlock = true;
		//console.log("end landed");

		flag = true;
	}
	
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

		var nOfBlocks = Math.floor((Math.random()*4)+1); // 1 - 4 number of blocks
		var version3 = Math.floor((Math.random()*2)+1); // 1 - 2 type of group with 3 blocks
		var version4 = Math.floor((Math.random()*7)+1); // 1 - 7 type of group with 3 blocks

		console.log("nblocks : ", nOfBlocks);
		console.log("v3 : ", version3);
		console.log("v4 : ", version4);
		console.log((new Date).getTime());

		// creates sprite for each block
		for (var i = 0; i<nOfBlocks; i++){
			group.create((nOfBlocks-i)*80, TOP_Y, 'block'); //
		}

		// piece of 3 blocks - 
		if(nOfBlocks == 3 && version3 == 2){
			group.xy(0,-80, TOP_Y);
			group.xy(1,0, TOP_Y);
			group.xy(2,0,TOP_Y+80);
		}

		if(nOfBlocks==4){
			switch(version4){
				case 1:
					// ###
					//  #
					group.xy(0,-120,TOP_Y);
					group.xy(1,-40,TOP_Y);
					group.xy(2,40,TOP_Y);
					group.xy(3,-40,TOP_Y+80);
					break;
				case 2:
					// ###
					// #
					group.xy(0,-120,TOP_Y);
					group.xy(1,-40,TOP_Y);
					group.xy(2,40,TOP_Y);
					group.xy(3,-120,TOP_Y+80);
					break;
				case 3:
					// ###
					//   #
					group.xy(0,-120,TOP_Y);
					group.xy(1,-40,TOP_Y);
					group.xy(2,40,TOP_Y);
					group.xy(3,40,TOP_Y+80);
					break;
				case 4:
					// ##
					//  ##
					group.xy(0,-120,TOP_Y);
					group.xy(1,-40,TOP_Y);
					group.xy(2,-40,TOP_Y+80);
					group.xy(3,40,TOP_Y+80);
					break;
				case 5:
					//  ##
					// ##
					group.xy(0,-120,TOP_Y+80);
					group.xy(1,-40,TOP_Y+80);
					group.xy(2,-40,TOP_Y);
					group.xy(3,40,TOP_Y);
					break;
				case 6:
					// ##
					// ##
					group.xy(0,-80,TOP_Y);
					group.xy(1,0,TOP_Y);
					group.xy(2,-80,TOP_Y+80);
					group.xy(3,0,TOP_Y+80);
					break;
				default:
					break;
			}
		}

		for(var j = 0 ; j < nOfBlocks ; ++j){
			group.xy(j, group.getChildAt(j).x + trump.body.x, group.getChildAt(j).y + trump.body.y);
		}
		
		group.setAll('enableBody', true);
		game.physics.arcade.enable(group);

		return;
}

function render() {

}
