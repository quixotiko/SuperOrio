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
};

Sprite.prototype = {
	draw: function(now,lastAnimationFrameTime,context) {
		if(this.cells < 2){
			context.drawImage(this.image,this.left,this.top);
		}
		else{
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
	this.bg_v = 0;
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


	this.platform_height = 32;
	this.platformData = [
	{
		
		left: 100,
		top: 500,
		height: this.platform_height,
		width: 96,
	},

	{
		
		left: 0,
		top: 400,
		height: this.platform_height,
		width: 96,
	},
	{
		
		left: 100,
		top: 300,
		height: this.platform_height,
		width: 96,
	}
	,
	{
		
		left: 100,
		top: 200,
		height: this.platform_height,
		width: 96,
	}
	];
};
SuperOrio.prototype = {
	initialize: function(){
		this.initializeBackground();
		// this.initializePlatforms();
		this.startGame();
	},
	initializeBackground: function(){
		this.backgroundImage.src = "images/background.png";
		this.backgroundImage.onload = function(e){
			superOrio.drawBackground();
		};
	},
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
	drawBackground: function(){
		this.context.translate(0,this.bg_offset);
		this.context.drawImage(this.backgroundImage,0,-1400);
		this.context.translate(0,-this.bg_offset);
	},
	animate: function(now){
		superOrio.setOffset(now);
		superOrio.draw(now);
		lastAnimationFrameTime = now;
		requestNextAnimationFrame(superOrio.animate);
	},
	setOffset: function(now){
		this.setBackgroundOffset(now);
		this.setSpritesOffset(now);
	},
	setBackgroundOffset: function(now){
		this.bg_offset = this.bg_v*(now-this.lastAnimationFrameTime)/1000;
	},
	setSpritesOffset: function(now) {
		for(var i = 0; i < this.spritesArray.length; i++){
			var sprite = this.spritesArray[i];
			sprite.offsetX = sprite.velocityX*(now-this.lastAnimationFrameTime)/1000;
			sprite.offsetY = sprite.velocityY*(now-this.lastAnimationFrameTime)/1000;
		}
	},
	draw: function(now){
		this.drawBackground();
		// for(var i = 0; i < this.platformData.length; i++){
		// 	this.drawPlatform(this.platformData[i]);
		// }
		this.drawSprites(now);

	},
	startGame: function(){
		requestNextAnimationFrame(superOrio.animate);
	},
	
// 创建sprite对象
	createSprites: function(){
		this.createOrioSprite();
		this.createPlatformSprites();
		// this.initializeSprites();
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
		this.orio_walk_left = false;
		this.orio_walk_right = false;

		this.spritesArray.push(this.orio);
	},
	createPlatformSprites: function(){
		var platforms = this.platformData;
		for(var i = 0; i < platforms.length; i++){
			var sprite = new Sprite("platform", [], "images/3rocks.png");
		    sprite.width = platforms[i].width;
		    sprite.height = platforms[i].height;
		    sprite.left = platforms[i].left;
		    sprite.top = platforms[i].top;
		    this.spritesArray.push(sprite);
		}
	},


	//根据每个sprite对象里面不同的offset绘画sprite对象，实现移动效果
	drawSprites: function(now) {
		var sprites = this.spritesArray;
		for(var i = 0; i < sprites.length; i++){
			var sprite = sprites[i];
			this.context.translate(-sprite.offsetX,sprite.offsetY);
			sprite.draw(now,this.lastAnimationFrameTime,this.context);
			this.context.translate(sprite.offsetX,-sprite.offsetY);
		}
	}
};
window.onkeydown = function(e) {
	var key = e.keyCode;
	if(key === 65){
		superOrio.orio_walk_left = true;
		superOrio.orio.image.src = "images/orio-left-walking.png";
		superOrio.orio.cells = 3;
		superOrio.orio.cellWidth = 30;
		superOrio.orio.cellHeight = 32;
	}else if(key === 68){
		superOrio.orio_walk_right = true;
		superOrio.orio.image.src = "images/orio-right-walking.png";
		superOrio.orio.cells = 3;
		superOrio.orio.cellWidth = 30;
		superOrio.orio.cellHeight = 32;
	}
};
window.onkeyup = function(e) {
	var key = e.keyCode;
	if(key === 65){
		superOrio.orio_walk_left = false;
		superOrio.orio.image.src = "images/orio-left-standing.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 24;
		superOrio.orio.cellHeight = 32;
	}else if(key === 68){
		superOrio.orio_walk_right = false;
		superOrio.orio.image.src = "images/orio-right-standing.gif";
		superOrio.orio.cells = 1;
		superOrio.orio.cellWidth = 24;
		superOrio.orio.cellHeight = 32;
	}
};
//防止keydown时间停顿现象
setInterval(function() {
	if(superOrio.orio_walk_left){
		superOrio.orio.left -= 4;
	}
	else if(superOrio.orio_walk_right){
		superOrio.orio.left += 4;
	}
},30);
var superOrio = new SuperOrio();
superOrio.initialize();
superOrio.createSprites();