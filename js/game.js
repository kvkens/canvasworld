/**
 * HTML5 打飞机游戏开发
 * Kvkens
 */

/*
 * 精灵表
 */
var sprites = {
	ship: {
		sx: 1,
		sy: 0,
		w: 36,
		h: 42,
		frames: 1
	},
	missile: {
		sx: 0,
		sy: 30,
		w: 2,
		h: 10,
		frames: 1
	},
	enemy_purple: {
		sx: 37,
		sy: 0,
		w: 42,
		h: 42,
		frames: 1
	},
	enemy_bee: {
		sx: 79,
		sy: 0,
		w: 42,
		h: 43,
		frames: 1
	},
	enemy_ship: {
		sx: 116,
		sy: 0,
		w: 42,
		h: 43,
		frames: 1
	},
	enemy_circle: {
		sx: 158,
		sy: 0,
		w: 32,
		h: 33,
		frames: 1
	}
};

var enemies = {
	basic: {
		x: 0,
		y: -50,
		sprite: "enemy_purple",
		B: 100,
		C: 2,
		E: 100
	}
};

/*
 * 准备游戏
 */
var startGame = function() {
		//SpriteSheet.draw(Game.ctx, "ship", 0, 0, 0);
		Game.setBoard(0, new Starfield(20, 0.4, 100, true));
		Game.setBoard(1, new Starfield(50, 0.6, 100));
		Game.setBoard(2, new Starfield(100, 1.0, 50));
		Game.setBoard(3, new TitleScreen("星球飞机大战", "按空格键开始游戏！", playGame));
	}
	/*
	 * 玩游戏
	 */
var playGame = function() {
		var board = new GameBoard();
		board.add(new Enemy(enemies.basic));
		board.add(new Enemy(enemies.basic, {
			x: 160
		}));
		board.add(new PlayerShip());
		Game.setBoard(3, board);
	}
	/*
	 * 监听事件
	 */
window.addEventListener("load", function() {
	Game.initialize("game", sprites, startGame);
});

/*
 * 背景星星
 */
var Starfield = function(speed, opacity, numStars, clear) {
		var stars = document.createElement("canvas");
		stars.width = Game.width;
		stars.height = Game.height;
		var starCtx = stars.getContext("2d");
		var offset = 0;
		if (clear) {
			starCtx.fillStyle = "#000";
			starCtx.fillRect(0, 0, stars.width, stars.height);
		}
		starCtx.fillStyle = "#FFF";
		starCtx.globalAlpha = opacity;
		for (var i = 0; i < numStars; i++) {
			starCtx.fillRect(Math.floor(Math.random() * stars.width), Math.floor(Math.random() * stars.height), 2, 2);
		}
		this.draw = function(ctx) {
			var intOffset = Math.floor(offset);
			var remaining = stars.height - intOffset;

			if (intOffset > 0) {
				ctx.drawImage(stars, 0, remaining, stars.width, intOffset, 0, 0, stars.width, intOffset);
				//console.log("ctx.drawImage(stars, 0, %s, %s, %s, 0, 0, %s, %s);",remaining,stars.width,intOffset,stars.width,intOffset);			
			}
			if (remaining > 0) {
				ctx.drawImage(stars, 0, 0, stars.width, remaining, 0, intOffset, stars.width, remaining);
				//console.log("ctx.drawImage(stars, 0, 0, %s, %s, 0, %s, %s, %s)",stars.width,remaining,intOffset,stars.width,remaining);
			}
		}
		this.step = function(dt) {
			offset += dt * speed;
			offset = offset % stars.height;
		}
	}
	//飞船
var PlayerShip = function() {
		this.w = SpriteSheet.map["ship"].w;
		this.h = SpriteSheet.map["ship"].h;
		this.x = Game.width / 2 - this.w / 2;
		this.y = Game.height - 10 - this.h;
		this.vx = 0;
		this.reloadTime = 0.25;
		this.reload = this.reloadTime;
		this.step = function(dt) {
			this.maxVel = 200;
			this.step = function(dt) {
				if (Game.keys["left"]) {
					this.vx = -this.maxVel;
				} else if (Game.keys["right"]) {
					this.vx = this.maxVel;
				} else {
					this.vx = 0;
				}

				this.x += this.vx * dt;
				if (this.x < 0) {
					this.x = 0;
				} else if (this.x > Game.width - this.w) {
					this.x = Game.width - this.w;
				}

				this.reload -= dt;
				if (Game.keys['fire'] && this.reload < 0) {
					Game.keys['fire'] = false;
					this.reload = this.reloadTime;

					this.board.add(new PlayerMissile(this.x, this.y + this.h / 2));
					this.board.add(new PlayerMissile(this.x + this.w, this.y + this.h / 2));
				}
			}
		}
		this.draw = function(ctx) {
			SpriteSheet.draw(ctx, "ship", this.x, this.y, 0);
		}

	}
	/*
	 * 飞船导弹
	 */
var PlayerMissile = function(x, y) {
	this.w = SpriteSheet.map['missile'].w;
	this.h = SpriteSheet.map['missile'].h;
	this.x = x - this.w / 2;
	// Use the passed in y as the bottom of the missile
	this.y = y - this.h;
	this.vy = -700;
};

PlayerMissile.prototype.step = function(dt) {
	this.y += this.vy * dt;
	if (this.y < -this.h) {
		this.board.remove(this);
	}
};

PlayerMissile.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx, 'missile', this.x, this.y);
};

/*
 * 敌机飞船
 */
var Enemy = function(blueprint, override) {
	var baseParameters = {
		A: 0,
		B: 0,
		C: 0,
		D: 0,
		E: 0,
		F: 0,
		G: 0,
		H: 0
	};
	for (var prop in baseParameters) {
		this[prop] = baseParameters[prop];
	}
	for (var prop in blueprint) {
		this[prop] = blueprint[prop];
	}
	if (override) {
		for (var prop in override) {
			this[prop] = override[prop];
		}
	}
	this.w = SpriteSheet.map[this.sprite].w;
	this.h = SpriteSheet.map[this.sprite].h;
	this.t = 0;
}
Enemy.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
	this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
	this.x += this.vx * dt;
	this.y += this.vy * dt;
	if (this.y > Game.height || this.x < -this.w || this.x > Game.width) {
		this.board.remove(this);
	}
}
Enemy.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx, this.sprite, this.x, this.y);
}