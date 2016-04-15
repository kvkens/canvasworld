/**
 * HTML5 打飞机游戏开发
 * Kvkens
 */

/*
 * 游戏主程序
 */
var Game = new function() {
<<<<<<< HEAD
=======
	var boards = [];
>>>>>>> refs/remotes/origin/master
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

/*
 * 精灵表
 */
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

/*
 * 标题文字
 */
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

/*
 * 游戏队列盘
 */
<<<<<<< HEAD
var GameBoard = function() {
	var board = this;
	this.objects = [];
	this.cnt = [];
=======

var GameBoard = function() {
	var board = this;

	// The current list of objects
	this.objects = [];
	this.cnt = {};
	// Add a new object to the object list
>>>>>>> refs/remotes/origin/master
	this.add = function(obj) {
		obj.board = this;
		this.objects.push(obj);
		this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
		return obj;
<<<<<<< HEAD
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
=======
	};

	// Mark an object for removal
	this.remove = function(obj) {
		this.removed.push(obj);
	};

	// Reset the list of removed objects
	this.resetRemoved = function() {
		this.removed = [];
	}

	// Removed an objects marked for removal from the list
>>>>>>> refs/remotes/origin/master
	this.finalizeRemoved = function() {
		for (var i = 0, len = this.removed.length; i < len; i++) {
			var idx = this.objects.indexOf(this.removed[i]);
			if (idx != -1) {
<<<<<<< HEAD
				this.cnt[this.removed[i].type]--;
				this.objects.splice(idx, 1);
			}
		}
	}
=======
				this.objects.splice(idx, 1);
				this.cnt[this.removed[i].type]--;
			}
		}
	}

	// Call the same method on all current objects 
>>>>>>> refs/remotes/origin/master
	this.iterate = function(funcName) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, len = this.objects.length; i < len; i++) {
			var obj = this.objects[i];
<<<<<<< HEAD
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
	this.collide = function() {
		return this.detect(function() {
			if (obj != this) {
				var col = (!type || this.type & type) && board.overlap(obj, this);
				return col ? this : false;
			}
		});
	}
}
=======
			obj[funcName].apply(obj, args)
		}
	};

	// Find the first object for which func is true
	this.detect = function(func) {
		for (var i = 0, val = null, len = this.objects.length; i < len; i++) {
			if (func.call(this.objects[i])) return this.objects[i];
		}
		return false;
	};

	// Call step on all objects and them delete
	// any object that have been marked for removal
	this.step = function(dt) {
		this.resetRemoved();
		this.iterate('step', dt);
		this.finalizeRemoved();
	};

	// Draw all the objects
	this.draw = function(ctx) {
		this.iterate('draw', ctx);
	};

	// Check for a collision between the 
	// bounding rects of two objects
	this.overlap = function(o1, o2) {
		return !((o1.y + o1.h - 1 < o2.y) || (o1.y > o2.y + o2.h - 1) ||
			(o1.x + o1.w - 1 < o2.x) || (o1.x > o2.x + o2.w - 1));
	};

	// Find the first object that collides with obj
	// match against an optional type
	this.collide = function(obj, type) {
		return this.detect(function() {
			if (obj != this) {
				var col = (!type || this.type & type) && board.overlap(obj, this)
				return col ? this : false;
			}
		});
	};

};

/*
 * 精灵类
 */
var Sprite = function() {

}
Sprite.prototype.setup = function(sprite, props) {
	this.sprite = sprite;
	this.merge(props);
	this.frame = this.frame || 0;
	this.w = SpriteSheet.map[sprite].w;
	this.h = SpriteSheet.map[sprite].h;
}
Sprite.prototype.merge = function(props) {
	if (props) {
		for (var prop in props) {
			this[prop] = props[prop];
		}
	}
}
Sprite.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
}
Sprite.prototype.hit = function(damage) {
	this.board.remove(this);
}

/*
 * 等级关卡
 */
var Level = function(levelData, callback) {
	this.levelData = [];
	for (var i = 0; i < levelData.length; i++) {
		this.levelData.push(Object.create(levelData[i]));
	}
	this.t = 0;
	this.callback = callback;
}
Level.prototype.step = function(dt) {
	var idx = 0,
		remove = [],
		curShip = null;

	// Update the current time offset
	this.t += dt * 1000;
	//   Start, End,  Gap, Type,   Override
	// [ 0,     4000, 500, 'step', { x: 100 } ]
	while ((curShip = this.levelData[idx]) &&
		(curShip[0] < this.t + 2000)) {
		// Check if we've passed the end time 
		if (this.t > curShip[1]) {
			remove.push(curShip);
		} else if (curShip[0] < this.t) {
			// Get the enemy definition blueprint
			var enemy = enemies[curShip[3]],
				override = curShip[4];

			// Add a new enemy with the blueprint and override
			this.board.add(new Enemy(enemy, override));

			// Increment the start time by the gap
			curShip[0] += curShip[2];
		}
		idx++;
	}

	// Remove any objects from the levelData that have passed
	for (var i = 0, len = remove.length; i < len; i++) {
		var remIdx = this.levelData.indexOf(remove[i]);
		if (remIdx != -1) this.levelData.splice(remIdx, 1);
	}
	// If there are no more enemies on the board or in 
	// levelData, this level is done
	if (this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
		if (this.callback) this.callback();
	}

};

Level.prototype.draw = function(ctx) {};
>>>>>>> refs/remotes/origin/master
