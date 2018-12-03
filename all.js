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
		type:"platform",
		src:"images/3rocks.png",
		left: 100,
		top: 500,
		height: this.platform_height,
		width: 96,
	},

	{
		
		type:"platform",
		src:"images/3rocks.png",
		left: 100,
		top: 400,
		height: this.platform_height,
		width: 96,
	},
	{
		
	    type:"platform",
		src:"images/3rocks.png",
		left: 100,
		top: 300,
		height: this.platform_height,
		width: 96,
	}
	,
	{
		
		type:"platform",
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
		superOrio.setOffset(now);
		superOrio.draw(now);
		superOrio.lastAnimationFrameTime = now;
		requestNextAnimationFrame(superOrio.animate);
	},

	setOffset: function(now){
		// this.setBackgroundOffset(now);
		this.setSpritesOffset(now);
		this.setOrioOffset(now);
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
	setOrioOffset: function(now) {
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
						orio.stopJump();
						orio.top = orio.beforeJumpPosition;
						if(orio.pre_left){orio.image.src = "images/orio-left-standing.gif"};
						if(orio.pre_right){orio.image.src = "images/orio-right-standing.gif"}
					}
				}
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
			sprite.top += sprite.offsetY;
			sprite.draw(now,this.lastAnimationFrameTime,this.context);
			
		}
	},


	startGame: function(){
		requestNextAnimationFrame(superOrio.animate);
	},
	

// 创建sprite对象
	createSprites: function(){
		this.createBackgroundSprite();
		this.createOrioSprite();
		this.createPlatformSprites();
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
		this.orio.jumpDuration = 1000;
		this.orio.jumpping = false;
		this.orio.upTimer = new Stopwatch();
		this.orio.downTimer = new Stopwatch();
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

		this.spritesArray.push(this.orio);
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

};


window.onkeydown = function(e) {
	var key = e.keyCode;
	if(key === 65){
		superOrio.orio.walk_left = true;
		
	}else if(key === 68){
		superOrio.orio.walk_right = true;
	}
	else if(key === 87){
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
	if(superOrio.orio.walk_left&&!superOrio.orio.walk_right&&!superOrio.orio.jumpping){
		superOrio.orio.left -= 4;
		superOrio.orio.image.src = "images/orio-left-walking.png";
		superOrio.orio.cells = 3;
		superOrio.orio.cellWidth = 30;
		superOrio.orio.cellHeight = 32;
	}
	else if(superOrio.orio.walk_right&&!superOrio.orio.walk_left&&!superOrio.orio.jumpping){
		superOrio.orio.left += 4;
		superOrio.orio.image.src = "images/orio-right-walking.png";
		superOrio.orio.cells = 3;
		superOrio.orio.cellWidth = 30;
		superOrio.orio.cellHeight = 32;
	}
	else if(superOrio.orio.jumpping&&superOrio.orio.walk_left&&!superOrio.orio.walk_right){
		superOrio.orio.left -= 4;
		superOrio.orio.image.src = "images/orio-left-jumping.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 32;
		superOrio.orio.cellHeight = 32;
	}else if(superOrio.orio.jumpping&&!superOrio.orio.walk_left&&superOrio.orio.walk_right){
		superOrio.orio.left += 4;
		superOrio.orio.image.src = "images/orio-right-jumping.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 32;
		superOrio.orio.cellHeight = 32;
	}
	else if(superOrio.orio.jumpping&&!superOrio.orio.walk_left&&!superOrio.orio.walk_right){
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
