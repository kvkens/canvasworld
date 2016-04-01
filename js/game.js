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

var GameBoard = function() {
	var board = this;
	this.objects = [];
	this.cnt = [];
	this.add = function(obj) {
		obj.board = this;
		this.objects.push(obj);
		this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
		return obj;
	}
	this.remove = function(obj) {
		var wasStillAlive = this.removed.indexOf(obj) != -1;
		if (wasStillAlive) {
			this.removed.push(obj);
		}
		return wasStillAlive;
	}
	this.resetRemoved = function() {
		this.removed = [];
	}
	this.finalizeRemoved = function() {
		for (var i = 0, len = this.removed.length; i < len; i++) {
			var idx = this.objects.indexOf(this.removed[i]);
			if (idx != -1) {
				this.cnt[this.removed[i].type]--;
				this.objects.splice(idx, 1);
			}
		}
	}
	this.iterate = function(funcName) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, len = this.objects.length; i < len; i++) {
			var obj = this.objects[i];
			obj[funcName].apply(obj, args);
		  //obj.step.apply();
		  //playship.step(0.03)
		}
	}
	this.detect = function(func) {
		for (var i = 0, val = null, len = this.objects.length; i < len; i++) {
			if (func.call(this.objects[i])) {
				return this.objects[i];
			}
		}
		return false;
	}
	this.step = function(dt) {
		this.resetRemoved();
		this.iterate("step", dt);
		this.finalizeRemoved();
	}
	this.draw = function(ctx) {
		this.iterate("draw", ctx);
	}
	this.overlap = function(o1, o2) {
		return !((o1.y + o1.h - 1 < o2.y) || (o1.y > o2.y + o2.h - 1) || (o1.x + o1.h - 1 < o2.x) || (o1.x > o2.x + o2.w - 1));
	}
	this.collide = function(){
		return this.detect(function(){
			if(obj!=this){
				var col = (!type || this.type & type) && board.overlap(obj,this);
				return col ? this : false;
			}
		});
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
	var board = new GameBoard();
	board.add(new PlayerShip());
	
	Game.setBoard(3, board);
	Game.setBoard(3,new PlayerShip());	
}
window.addEventListener("load", function() {
	Game.initialize("game", sprites, startGame);
});