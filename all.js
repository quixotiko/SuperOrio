var Sprite = function(type,behaviors,src,cells,cellWidth,cellHeight){
	var default_width = 32;
	    default_height = 32;
	this.image = new Image();
	this.image.src = src;
	this.cells = cells;
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	this.cellTop = 0;
	this.cellLeft = 0;
	this.cellIndex = 0;
	this.lastCellMoveTime = 0;
	this.type = type;
	this.behaviors = behaviors || [];
	this.width = default_width;
	this.height = default_height;
	this.top = 0;
	this.left = 0;
	this.velocityX = 0;
	this.velocityY = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.minLeftDistance = 0;
	this.maxLeftDistance = 0;
	this.minTopDistance =0;
	this.maxTopDistance = 0;
};

Sprite.prototype = {
	draw: function(now,lastAnimationFrameTime,context) {
		if(this.cells < 2){
			context.drawImage(this.image,this.left,this.top);
		}
		else
		{
		if(this.lastCellMoveTime === 0){
			this.lastCellMoveTime = now;
		}
		else {
			if(now - this.lastCellMoveTime > 100){//这里不加if判断条件orio跑得太快了，必须间隔一段时间再更新动画帧
				this.cellLeft = this.cellIndex*this.cellWidth;
				context.drawImage(this.image,this.cellLeft,this.cellTop,
					                         this.cellWidth,this.cellHeight,
					                         this.left,this.top,this.cellWidth,this.cellHeight);
				if(this.cellIndex === this.cells - 1)
				{
					this.cellIndex = 0;
				}
				else
				{
					this.cellIndex++;
				}
				this.lastCellMoveTime = now;
		    //不跟新动画帧的时候也要绘制orio，否则orio会一闪一闪的显示
             }else{
             	context.drawImage(this.image,this.cellLeft,this.cellTop,
					                         this.cellWidth,this.cellHeight,
					                         this.left,this.top,this.cellWidth,this.cellHeight);
             }
         }

	}
}
};

var SuperOrio = function(){
	this.canvas = document.getElementById("game-canvas");
	this.context = this.canvas.getContext("2d");
	this.canvasWidth = 400;
	this.canvasHeight = 600;

	this.backgroundImage = new Image();

	this.lastAnimationFrameTime = 0;
	this.bg_v = 10;
	this.bg_offset = 0;


	this.bichos = [];
	this.ducks = [];
	this.plant = [];
	this.mushrooms = [];
	this.platforms = [];
	this.coins = [];
	this.spritesArray = [];

	this.orio_walk_left = false;
	this.orio_walk_right = false;
	this.orio_jump = false;


	this.platform_height = 32;
	this.platformData = [
	{
		type:"3rocks",
		src:"images/3rocks.png",
		left: 100,
		top: 500,
		height: this.platform_height,
		width: 96,
	},

	{
		
		type:"3rocks",
		src:"images/3rocks.png",
		left: 200,
		top: 400,
		height: this.platform_height,
		width: 96,
	},
	{
		
	    type:"3rocks",
		src:"images/3rocks.png",
		left: 300,
		top: 300,
		height: this.platform_height,
		width: 96,
	}
	,
	{
		
		type:"platform01",
		src:"images/platform01.png",
		left: 0,
		top: 200,
		height: 48,
		width: 16,
		velocityX: 100,
		minLeftDistance:0,
		maxLeftDistance:300, 
	}
	];
};
SuperOrio.prototype = {
	initialize: function(){
		// this.initializeBackground();
		// this.initializePlatforms();
		this.startGame();
	},
	// initializeBackground: function(){
	// 	this.backgroundImage.src = "images/background.png";
	// 	this.backgroundImage.onload = function(e){
	// 		superOrio.drawBackground();
	// 	};
	// },
	// initializePlatforms: function(){
	// 	for(var i = 0;i < this.platformData.length; i++){
	// 		(function(platform){
	// 			platform.platformImage = new Image();
	// 			platform.platformImage.src = "images/4rocks.png";
	// 			platform.platformImage.onload = function(e){
	// 			    // superOrio.drawPlatform(platform);
	// 			};
	// 		})(this.platformData[i]);
	// 	}
	// },
	// drawPlatform: function(platform){
	// 	    this.context.drawImage(platform.platformImage,platform.left,platform.top);
	// },
	
	animate: function(now){
		superOrio.checkIfOnPlatform();
		superOrio.setOffset(now);
		superOrio.checkCollision();
		superOrio.draw(now);
		superOrio.lastAnimationFrameTime = now;
		requestNextAnimationFrame(superOrio.animate);
	},

	setOffset: function(now){
		// this.setBackgroundOffset(now);
		this.setVelocityY();
		this.setOrioJumpOffset(now);
		this.setOrioFallOffset(now);
		this.setSpritesOffset(now);
		
	},
	setVelocityY: function() {
		for(var i =0; i < this.spritesArray.length; i++){
			var sprite = this.spritesArray[i];
			if(sprite.type === "orio"&&sprite.jumpping){
				sprite.velocityY = 0;
			}
			else{
				sprite.velocityY = 0;
			}
		}
	},
	// setBackgroundOffset: function(now){
	// 	this.bg_offset = this.bg_v*(now-this.lastAnimationFrameTime)/1000;
	// },
	setSpritesOffset: function(now) {
		for(var i = 0; i < this.spritesArray.length; i++){
			var sprite = this.spritesArray[i];
			if(sprite.left>sprite.maxLeftDistance || sprite.left<sprite.minLeftDistance){
				sprite.velocityX = -sprite.velocityX;
			}
			sprite.offsetX = sprite.velocityX*(now-this.lastAnimationFrameTime)/1000;
			sprite.offsetY = sprite.velocityY*(now-this.lastAnimationFrameTime)/1000;
		}
	},
	setOrioJumpOffset: function(now) {
		for(var i = 0; i < this.spritesArray.length; i++){
			if(this.spritesArray[i].type === "orio"){
				var orio = this.spritesArray[i];
				if(!orio.jumpping){
					return;
				}
				if(orio.isGoingUp()){
					if(!orio.isDoneGoingUp()){
						var time = orio.upTimer.getElapsedTime();
						var offsetY = (time /(orio.jumpDuration/2)) * orio.jumpHeight;
						orio.top = orio.beforeJumpPosition - offsetY;

					}
					else{
						orio.jumpClimax = orio.top;
						orio.upTimer.stop();
						orio.upTimer.reset();
						orio.downTimer.start();
					}
				}
				else if(orio.isGoingDown()){
					if(!orio.isDoneGoingDown()){
						var time = orio.downTimer.getElapsedTime();
						var offsetY = (time /(orio.jumpDuration/2)) * orio.jumpHeight;
							orio.top = orio.jumpClimax + offsetY;
						
					}
					else{
						var time = orio.downTimer.getElapsedTime()/1000;
						// var offsetY = (time /(orio.jumpDuration/2)) * orio.jumpHeight;
						var offsetY = 0.5*9.81*time*time*1;//模拟重力效应
						orio.top += offsetY;
					}
				}
			}
		}
	},
	setOrioFallOffset: function(now){
		if(!this.orio.falling) return;
		if(this.orio.falling){
			        // var time = this.orio.fallTimer.getElapsedTime()/1000;
			    	// this.orio.top += time*time*0.5*9.8*4;
			    	this.orio.top += 4;//这里不知道为什么fallTimer不工作TAT
			    	// console.log(this.orio.fallTimer.isRunning());
			    	// console.log(this.orio.top);
			    	// console.log(this.orio.fallTimer.getElapsedTime()/1000);
	     }
	},
	checkCollision: function() {
		for(var i = 0; i < this.spritesArray.length; i++){
			var sprite = this.spritesArray[i];
			if(this.isSpriteInView(sprite)){
				rec = this.calculateCollisionRec(sprite);
				orioRec = this.calculateCollisionRec(this.orio);
				if(this.didCollide(sprite,rec,orioRec,this.context)){
					this.processCollision(sprite);
				}

			}
		}
	},
	isSpriteInView: function(sprite) {
		if(sprite.top < this.canvasHeight&&sprite.top + sprite.height> 0)
			return true;
	},
	calculateCollisionRec: function(sprite) {
		return {
			left: sprite.left,
			right: sprite.left + sprite.width,
			top: sprite.top,
			bottom: sprite.top + sprite.height,
			centerX: sprite.left + sprite.width/2,
			centerY: sprite.top + sprite.height/2,
		}
	},
	didCollide: function(sprite,rec,orioRec,context) {
		context.beginPath();
		context.rect(rec.left+1,rec.top,rec.right-rec.left-1,(rec.bottom-rec.top)/2);//这里检测碰撞的时候要注意每个sprite每个动画帧都会被重绘，如果sprite的
		//offset过大，就会出现遗漏碰撞的情况,最后一个参数的设置，也不能让orio矩形的下边刚好碰到platform的下边就确认发生碰撞
		// return context.isPointInPath(orioRec.left,orioRec.top) || context.isPointInPath(orioRec.right,orioRec.top)
		//        || context.isPointInPath(orioRec.right,orioRec.bottom) || context.isPointInPath(orioRec.left,orioRec.bottom);
		return context.isPointInPath(orioRec.right-1,orioRec.bottom) || context.isPointInPath(orioRec.left+1,orioRec.bottom);
	},
	processCollision: function(sprite) {
		var o = this.orio;
		if(sprite.type === "3rocks"){
			if(o.isGoingDown()){
				o.stopJump();
				o.downTimer.stop();
				o.top = sprite.top - o.height;
				o.platformOn = sprite;
				if(o.pre_left){o.image.src = "images/orio-left-standing.gif"};
				if(o.pre_right){o.image.src = "images/orio-right-standing.gif"};
			}
			if(o.falling){
				o.stopFalling();
				o.fallTimer.stop();
				o.fallTimer.reset();
				o.top = sprite.top - o.height;
				o.platformOn = sprite;
				if(o.pre_left){o.image.src = "images/orio-left-standing.gif"};
				if(o.pre_right){o.image.src = "images/orio-right-standing.gif"};
			}
		}
	},
	checkIfOnPlatform: function(){
		var o = this.orio;
		if(o.platformOn){
			if(o.left + o.width < o.platformOn.left || o.left > o.platformOn.left + o.platformOn.width){
				o.fall(0);
			}
	    }
	},
	draw: function(now){
		// this.drawBackground();
		// for(var i = 0; i < this.platformData.length; i++){
		// 	this.drawPlatform(this.platformData[i]);
		// }
		this.drawSprites(now);

	},

	// drawBackground: function(){
	// 	this.context.translate(0,this.bg_offset);
	// 	this.context.drawImage(this.backgroundImage,0,-1400);
	// 	this.context.translate(0,-this.bg_offset);
	// },
	//根据每个sprite对象里面不同的offset绘画sprite对象，实现移动效果
	drawSprites: function(now) {
		var sprites = this.spritesArray;
		for(var i = 0; i < sprites.length; i++){
			var sprite = sprites[i];
			sprite.left += sprite.offsetX;
			// sprite.top += sprite.offsetY;
			sprite.draw(now,this.lastAnimationFrameTime,this.context);
			
		}
	},


	startGame: function(){
		requestNextAnimationFrame(superOrio.animate);
	},
	

// 创建sprite对象
	createSprites: function(){
		this.createBackgroundSprite();
		this.createPlatformSprites();
		this.createOrioSprite();
		//这里创建sprite对象的顺序很重要！决定了每个sprite对象在spriteArray的位置，后面的drawSprites方法会按顺序绘画sprite
	    //canvas的drawImage（）先画的会被后画的覆盖
		// this.initializeSprites();
	},
	createBackgroundSprite: function() {
		this.background = new Sprite("background",[],"images/background.png",1,400,2000);
		this.background.width = 400;
		this.background.height = 2000;
		this.background.left = 0;
		this.background.top = -1400;

		this.spritesArray.push(this.background);
	},
	
	createPlatformSprites: function(){
		var platforms = this.platformData;
		for(var i = 0; i < platforms.length; i++){
			var sprite = new Sprite(platforms[i].type, [], platforms[i].src,1,platforms[i].width,platforms[i].height);
		    sprite.width = platforms[i].width;
		    sprite.height = platforms[i].height;
		    sprite.left = platforms[i].left;
		    sprite.top = platforms[i].top;
		    if(platforms[i].velocityX){sprite.velocityX = platforms[i].velocityX;}
		    if(platforms[i].velocityY){sprite.velocityY = platforms[i].velocityY;}
		    if(platforms[i].minLeftDistance){sprite.minLeftDistance = platforms[i].minLeftDistance}
		    if(platforms[i].maxLeftDistance){sprite.maxLeftDistance = platforms[i].maxLeftDistance}
		    this.spritesArray.push(sprite);
		}
	},
	createOrioSprite: function(){
		this.orio = new Sprite("orio",[
			this.orioWalkBehavior, 
			this.orioJumpBehavior, 
			this.orioFallBehavior, 
			this.orioCollideBehavior],"images/orio-right-standing.gif",1,24,32);
		this.orio.width = 24;
		this.orio.height = 32;
		this.orio.left = 270;
		this.orio.top = 544;
		this.orio.walk_left = false;
		this.orio.walk_right = false;
		this.orio.pre_left = false;
		this.orio.pre_right = true;
		
		this.orio.jumpHeight = 150;
		this.orio.jumpDuration = 1200;
		this.orio.jumpping = false;
		this.orio.upTimer = new AnimationTimer(this.orio.jumpDuration/2,AnimationTimer.makeEaseOutEasingFunction(1.0));
		this.orio.downTimer = new AnimationTimer(this.orio.jumpDuration/2,AnimationTimer.makeEaseInEasingFunction(1.0));
		this.orio.jump = function() {
			if(this.jumpping)
				return;
			this.jumpping = true;
			this.beforeJumpPosition = this.top;
			this.upTimer.start();
		};
		
		this.orio.stopJump = function() {
			this.jumpping = false;
		};
		this.orio.isGoingUp = function() {
			return this.upTimer.isRunning();
		};
		this.orio.isDoneGoingUp = function(now) {
			return this.upTimer.getElapsedTime() > this.jumpDuration/2;
		};
		this.orio.isGoingDown = function() {
			return this.downTimer.isRunning();
		};
		this.orio.isDoneGoingDown = function(now) {
			return this.downTimer.getElapsedTime() > this.jumpDuration/2;
		};


		this.orio.falling = false;
		this.orio.fallTimer = new AnimationTimer();
		this.orio.fall = function(initailVelocity) {
			this.falling = true;
			this.initailVelocity = initailVelocity;
			this.fallTimer.start();
		};
		this.orio.stopFalling = function(){
			this.falling = false;
			this.fallTimer.stop();
		};
		this.spritesArray.push(this.orio);
	},

};


window.onkeydown = function(e) {
	var key = e.keyCode;
	if(key === 65){
		superOrio.orio.walk_left = true;
		
	}else if(key === 68){
		superOrio.orio.walk_right = true;
	}
	else if(key === 87){
		if(!superOrio.orio.falling)
		superOrio.orio.jump();
	}
};
window.onkeyup = function(e) {
	var key = e.keyCode;
	if(key === 65){
		superOrio.orio.walk_left = false;
		superOrio.orio.pre_left = true;
		superOrio.orio.pre_right = false;
		superOrio.orio.image.src = "images/orio-left-standing.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 24;
		superOrio.orio.cellHeight = 32;
	}else if(key === 68){
		superOrio.orio.walk_right = false;
		superOrio.orio.pre_left =false;
		superOrio.orio.pre_right = true;
		superOrio.orio.image.src = "images/orio-right-standing.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 24;
		superOrio.orio.cellHeight = 32;
	}
	else if(key === 87){
		// superOrio.orio.jump = false;
	}
};
//防止keydown时间停顿现象
setInterval(function() {
	if(superOrio.orio.walk_left&&!superOrio.orio.walk_right&&!superOrio.orio.jumpping&&!superOrio.orio.falling){
		superOrio.orio.left -= 4;
		superOrio.orio.image.src = "images/orio-left-walking.png";
		superOrio.orio.cells = 3;
		superOrio.orio.cellWidth = 30;
		superOrio.orio.cellHeight = 32;
	}
	else if(superOrio.orio.walk_right&&!superOrio.orio.walk_left&&!superOrio.orio.jumpping&&!superOrio.orio.falling){
		superOrio.orio.left += 4;
		superOrio.orio.image.src = "images/orio-right-walking.png";
		superOrio.orio.cells = 3;
		superOrio.orio.cellWidth = 30;
		superOrio.orio.cellHeight = 32;
	}
	else if(superOrio.orio.jumpping&&superOrio.orio.walk_left&&!superOrio.orio.walk_right || (superOrio.orio.falling&&superOrio.orio.walk_left&&!superOrio.orio.walk_right)){
		superOrio.orio.left -= 4;
		superOrio.orio.image.src = "images/orio-left-jumping.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 32;
		superOrio.orio.cellHeight = 32;
	}else if(superOrio.orio.jumpping&&!superOrio.orio.walk_left&&superOrio.orio.walk_right || (superOrio.orio.falling&&!superOrio.orio.walk_left&&superOrio.orio.walk_right)){
		superOrio.orio.left += 4;
		superOrio.orio.image.src = "images/orio-right-jumping.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 32;
		superOrio.orio.cellHeight = 32;
	}
	else if((superOrio.orio.jumpping || superOrio.orio.falling)&&!superOrio.orio.walk_left&&!superOrio.orio.walk_right){
		if(superOrio.orio.pre_left){
			superOrio.orio.image.src = "images/orio-left-jumping.gif";
			superOrio.orio.cells = 1;
		    superOrio.orio.cellWidth = 32;
		    superOrio.orio.cellHeight = 32;
		}else if(superOrio.orio.pre_right){
			superOrio.orio.image.src = "images/orio-right-jumping.gif";
			superOrio.orio.cells = 1;
			superOrio.orio.cellWidth = 32;
			superOrio.orio.cellHeight = 32;
		}
	}
},30);

var superOrio = new SuperOrio();
superOrio.createSprites();
superOrio.initialize();
