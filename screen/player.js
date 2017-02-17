class Player {

	constructor(x, y) {
		Player.count++;
		this.id = Player.count;
		this.body = Bodies.rectangle(x, y, 20, 40);
		World.add(engine.world, [this.body]);
	}
}

Player.count = 0;
