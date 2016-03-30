/**
 * HTML5 打飞机游戏开发
 * Kvkens
 */

//精灵表
var SpriteSheet = new function() {
	this.map = {};
	this.load = function(spriteData, callback) {
		this.map = spriteData;
		this.image = new Image();
		this.image.onload = callback;
		this.image.src = "images/sprites.png";
	};
	this.draw = function(ctx, sprite, x, y, frame) {
		var s = this.map[sprite];
		if (!frame) frame = 0;
		ctx.drawImage(this.image,
			s.sx + frame * s.w,
			s.sy,
			s.w, s.h,
			x, y,
			s.w, s.h
		);
	}
}
var Game = new function() {
		//初始化
		this.initialize = function(canvasElementId, sprite_data, callback) {
				this.canvas = document.getElementById(canvasElementId);
				this.width = this.canvas.width;
				this.height = this.canvas.height;
				this.ctx = this.canvas.getContext && this.canvas.getContext("2d");
				if (!this.ctx) {
					return alert("浏览器不支持请升级到chrome!");
				}
				this.setupInput();
				this.loop();
				SpriteSheet.load(sprite_data, callback);
			}
			//键盘处理
		var KEY_CODES = {
			37: "left",
			39: "right",
			32: "fire"
		};
		this.keys = {};
		this.setupInput = function() {
				window.addEventListener("keydown", function(e) {
					if (KEY_CODES[e.keyCode]) {
						Game.keys[KEY_CODES[e.keyCode]] = true;
						e.preventDefault();
					}
				});
				window.addEventListener("keyup", function(e) {
					if (KEY_CODES[e.keyCode]) {
						Game.keys[KEY_CODES[e.keyCode]] = false;
						e.preventDefault();
					}
				});
			}
			//面板
		var boards = [];
		this.loop = function() {
			var dt = 30 / 1000;
			for (var i = 0, len = boards.length; i < len; i++) {
				if (boards[i]) {
					boards[i].step(dt);
					boards[i] && boards[i].draw(Game.ctx);
				}
			}
			setTimeout(Game.loop, 30);
		}
		this.setBoard = function(num, board) {
			boards[num] = board;
		}
	}
	//星星
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
	//画文字
var TitleScreen = function TitleScreen(title, subtitle, callback) {
	this.step = function(dt) {
		if (Game.keys["fire"] && callback) {
			callback();
		}
	}
	this.draw = function(ctx) {
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "bold 40px bangers";
		ctx.fillText(title, Game.width / 2, Game.height / 2);
		ctx.font = "bold 20px bangers";
		ctx.fillText(subtitle, Game.width / 2, Game.height / 2 + 40);
	}
}

//飞船
var PlayerShip = function() {
	this.w = SpriteSheet.map["ship"].w;
	this.h = SpriteSheet.map["ship"].h;
	this.x = Game.width / 2 - this.w / 2;
	this.y = Game.height - 10 - this.h;
	this.vx = 0;
	this.step = function(dt) {
		this.maxVel = 200;
		this.step = function(dt) {
			if (Game.keys["left"]) {
				this.vx = -this.maxVel;
			} else if (Game.keys["right"]) {
				this.vx = this.maxVel;
			}

			this.x += this.vx * dt;
			console.log(this.x);
			if (this.x < 0) {
				this.x = 0;
			} else if (this.x > Game.width - this.w) {
				this.x = Game.width - this.w;
			}
		}
	}
	this.draw = function(ctx) {
		SpriteSheet.draw(ctx, "ship", this.x, this.y, 0);
	}

}

var sprites = {
	ship: {
		sx: 1,
		sy: 0,
		w: 36,
		h: 42,
		frames: 3
	}
};
var startGame = function() {
	//SpriteSheet.draw(Game.ctx, "ship", 0, 0, 0);
	Game.setBoard(0, new Starfield(20, 0.4, 100, true));
	Game.setBoard(1, new Starfield(50, 0.6, 100));
	Game.setBoard(2, new Starfield(100, 1.0, 50));
	Game.setBoard(3, new TitleScreen("星球大战", "一个相当刺激的游戏", playGame));
}
var playGame = function() {
	Game.setBoard(3, new PlayerShip());
}
window.addEventListener("load", function() {
	Game.initialize("game", sprites, startGame);
});