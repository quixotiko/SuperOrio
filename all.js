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
	this.visible = true;
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
	this.gameOver = false;
	this.win = false;
	this.winDiv = document.getElementById("win");
	this.gameOverDiv = document.getElementById("game-over");


	this.bichosData = [
	{
		type: "bicho",
		src: "images/bicho-walking.png",
		left: 113,
		top:268,
		height: 32,
		width: 32,
		velocityX: 50,
		minLeftDistance: 50,
		maxLeftDistance: 114,
		squashed: false,
		beginDisppearTime: 0,
	},
	{
		type: "bicho",
		src: "images/bicho-walking.png",
		left: 120,
		top:-32,
		height: 32,
		width: 32,
		velocityX: 50,
		minLeftDistance: 100,
		maxLeftDistance: 164,
		squashed: false,
		beginDisppearTime: 0,
	},
	];
	this.ducks = [];
	this.plant = [];
	this.mushroomsData = [
	{
		type: "mushroom",
		src: "images/mushroom.gif",
		left: 200,
		top: -1332,
		height:32,
		width: 32,
	}
	];
	this.coins = [];
	this.spritesArray = [];

	this.orio_walk_left = false;
	this.orio_walk_right = false;
	this.orio_jump = false;


	this.platform_height = 32;
	this.platformData = [
	{
		type: "ground",
		src: "",
		left: 0,
		top: 576,
		height:24,
		width: 400,
	},

	{
		type:"3rocks",
		src:"images/3rocks.png",
		left: 150,
		top: 500,
		height: this.platform_height,
		width: 96,
	},

	{
		
		type:"3rocks",
		src:"images/3rocks.png",
		left: 100,
		top: 400,
		height: this.platform_height,
		width: 96,
	},
	{
		
	    type:"3rocks",
		src:"images/3rocks.png",
		left: 50,
		top: 300,
		height: this.platform_height,
		width: 96,
	}
	,
	{
		
	    type:"3rocks",
		src:"images/3rocks.png",
		left: 50,
		top: 100,
		height: this.platform_height,
		width: 96,
	}
	,
	{
		
	    type:"3rocks",
		src:"images/3rocks.png",
		left: 100,
		top: 0,
		height: this.platform_height,
		width: 96,
	}
	,
	{
		
		type:"platform",
		src:"images/platform01.png",
		left: 160,
		top: 200,
		height: 16,
		width: 48,
		velocityX: 100,
		minLeftDistance:150,
		maxLeftDistance:300, 
	}
	,
	{
		
	    type:"unstableRock",
		src:"images/unstablerock.gif",
		left: 150,
		top: -100,
		height: this.platform_height,
		width: 96,
	}
	,{
		
	    type:"unstableRock",
		src:"images/unstablerock.gif",
		left: 200,
		top: -200,
		height: this.platform_height,
		width: 96,
	}
	,{
		
	    type:"unstableRock",
		src:"images/unstablerock.gif",
		left: 250,
		top: -300,
		height: this.platform_height,
		width: 96,
	}
	,
	{
		
		type:"platform",
		src:"images/platform02.png",
		left: Math.random()*200,
		top: -400,
		height: 16,
		width: 48,
		velocityX: 10 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform02.png",
		left: Math.random()*200,
		top: -500,
		height: 16,
		width: 48,
		velocityX: 10 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform02.png",
		left: Math.random()*200,
		top: -600,
		height: 16,
		width: 48,
		velocityX: 10 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform02.png",
		left: Math.random()*200,
		top: -700,
		height: 16,
		width: 48,
		velocityX: 10 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform02.png",
		left: Math.random()*200,
		top: -800,
		height: 16,
		width: 48,
		velocityX: 10 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform04.png",
		left: Math.random()*200,
		top: -900,
		height: 16,
		width: 48,
		velocityX: 100 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform04.png",
		left: Math.random()*200,
		top: -1000,
		height: 16,
		width: 48,
		velocityX: 100 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform04.png",
		left: Math.random()*200,
		top: -1100,
		height: 16,
		width: 48,
		velocityX: 100 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform04.png",
		left: Math.random()*200,
		top: -1200,
		height: 16,
		width: 48,
		velocityX: 100 + Math.random()*100,
		minLeftDistance:0,
		maxLeftDistance:350, 
	}
	,
	{
		
		type:"platform",
		src:"images/platform04.png",
		left: 200,
		top: -1300,
		height: 16,
		width: 48,
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
		superOrio.checkIfInTheView();
		superOrio.setOffset(now);
		superOrio.makeDisppear(now);
		superOrio.makeFall(now);
		superOrio.draw(now);
		superOrio.checkCollision(now);
		superOrio.movingDown();
		superOrio.checkIfGameOver();
		superOrio.checkIfWin();
		superOrio.lastAnimationFrameTime = now;
		requestNextAnimationFrame(superOrio.animate);
	},
	checkIfGameOver: function() {
		if(this.orio.top + this.orio.height >= this.canvasHeight)
			this.gameOver = true;
		if(this.gameOver&&!this.win){
			for(var i=0;i<this.spritesArray.length;i++)
			{
				var sprite = this.spritesArray[i];
				sprite.velocityY = 0;
				sprite.velocityX = 0;
				this.orio.image.src = "images/orio-fail.gif";
			}
			this.gameOverDiv.style.opacity = 1;
		}
	},
	checkIfWin: function(){
		if(this.win)
		{
			this.winDiv.style.opacity = 1;
		}
	},
	checkIfInTheView: function(){
		if(this.orio.left<0)
		{
			this.orio.left = 0;
		}
		if(this.orio.left + this.orio.width > this.canvasWidth)
		{
			this.orio.left = this.canvasWidth - this.orio.width;
		}
	},
	setOffset: function(now){
		// this.setVelocityX(now);
		this.setSpritesOffset(now);
		this.setOrioJumpOffset(now);
		this.setOrioFallOffset(now);
		
		
	},
	// setVelocityX: function() {
	// 	for(var i =0; i < this.spritesArray.length; i++){
	// 		var sprite = this.spritesArray[i];
	// 		if(sprite.type === "orio"&&sprite.jumpping){
	// 			sprite.velocityX = 0;
	// 		}
	// 		else{
	// 			sprite.velocityX = 0;
	// 		}
	// 	}
	// },
	movingDown: function(){
		var orio = this.orio;
		if(orio.top < 500){
			for(var i =0 ; i < this.spritesArray.length; i++){
				var sprite = this.spritesArray[i];
				   sprite.velocityY = 30;
			}
		}
	},

	setSpritesOffset: function(now) {
		for(var i = 0; i < this.spritesArray.length; i++){
			var sprite = this.spritesArray[i];
			if(sprite.left>sprite.maxLeftDistance || sprite.left<sprite.minLeftDistance ){
				
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
								var offsetY = 0.5*9.81*time*time*2;//模拟重力效应
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
	checkCollision: function(now) {
		for(var i = 0; i < this.spritesArray.length; i++){
			if(this.spritesArray[i].type !=="oiro")
			{
				var sprite = this.spritesArray[i];
				if(this.isSpriteInView(sprite)){
					rec = this.calculateCollisionRec(sprite);
					orioRec = this.calculateCollisionRec(this.orio);
					if(sprite.type === "3rocks" || sprite.type === "platform" || sprite.type === "unstableRock"|| sprite.type === "mushroom")
					{
						if(this.didCollide(sprite,rec,orioRec,this.context)){
							this.processCollision(sprite,now);
						}
				    }
				    else if(sprite.type === "bicho")
				    {
				    	if(this.didCollideWithBadGuy(sprite,rec,orioRec,this.context))
				    	{
				    		this.processCollision(sprite,now);
				    	}
				    }
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
	didCollideWithBadGuy: function(sprite,rec,orioRec,context){
		context.beginPath();
		context.rect(rec.left+5,rec.top,rec.right-rec.left-5,(rec.bottom-rec.top)/3);
		return  context.isPointInPath(orioRec.left,orioRec.top) || context.isPointInPath(orioRec.right,orioRec.top)
		       || context.isPointInPath(orioRec.right,orioRec.bottom) || context.isPointInPath(orioRec.left,orioRec.bottom);
	},
	processCollision: function(sprite,now) {
		var o = this.orio;
		if(sprite.type === "3rocks" || sprite.type === "ground"){
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
		else if(sprite.type === "platform")
		{
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
			o.left += sprite.offsetX;
		}
		else if(sprite.type === "bicho")
		{
			if((o.isGoingDown()||o.falling)&&!sprite.squashed){
				o.stopJump();
				o.downTimer.stop();//模拟反弹
				o.jump();
				sprite.image.src = "images/bicho-squashing.gif";
				sprite.cells = 1;
				sprite.squashed = true;
				sprite.beginDisppearTime = now;
			}
			else if(!sprite.squashed)
			{
				o.image.src = "images/orio-fail.gif";
				o.cells = 1;
				this.gameOver = true;
				o.jumpping = false;
			}
		}
		else if(sprite.type === "unstableRock")
		{
			if(o.isGoingDown()){
				o.stopJump();
				o.downTimer.stop();
				o.top = sprite.top - o.height;
				o.platformOn = sprite;
				if(o.pre_left){o.image.src = "images/orio-left-standing.gif"};
				if(o.pre_right){o.image.src = "images/orio-right-standing.gif"};
				sprite.toFall = true;
				sprite.beginFallTime = now;
			}
			if(o.falling){
				o.stopFalling();
				o.fallTimer.stop();
				o.fallTimer.reset();
				o.top = sprite.top - o.height;
				o.platformOn = sprite;
				if(o.pre_left){o.image.src = "images/orio-left-standing.gif"};
				if(o.pre_right){o.image.src = "images/orio-right-standing.gif"};
				sprite.toFall = true;
				sprite.beginFallTime = now;
			}
		}
		else if(sprite.type === "mushroom")
		{
			this.win = true;
		}
	},
	makeDisppear: function(now) {
		for(var i=0;i<this.spritesArray.length;i++){
			if(this.spritesArray[i].type === "bicho")
			{
				var sprite = this.spritesArray[i];
				if(sprite.squashed)
				{
					if(sprite.squashed&&now-sprite.beginDisppearTime >300)
					{
						sprite.visible = false;
					}
			    }
			}
		}
	},
	makeFall: function(now) {
		for(var i=0;i<this.spritesArray.length;i++){
			if(this.spritesArray[i].type === "unstableRock")
			{
				var sprite = this.spritesArray[i];
				if(sprite.toFall)
				{
					if(sprite.toFall&&now-sprite.beginFallTime >1000)
					{
						sprite.top+=4;
						this.orio.fall(0);
					}
			    }
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
				sprite.top += sprite.offsetY;
				if(sprite.visible)
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
		this.createBichoSprite();
		this.createMushroomSprite();
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
		    // if(platforms[i].velocityY){sprite.velocityY = platforms[i].velocityY;}
		    if(platforms[i].minLeftDistance){sprite.minLeftDistance = platforms[i].minLeftDistance}
		    if(platforms[i].maxLeftDistance){sprite.maxLeftDistance = platforms[i].maxLeftDistance}
		    this.spritesArray.push(sprite);
		}
	},
	createBichoSprite: function(){
		var bichos = this.bichosData;
		for(var i=0;i<bichos.length;i++){
			var sprite = new Sprite(bichos[i].type,[],bichos[i].src,2,bichos[i].width,bichos[i].height);
			sprite.width = bichos[i].width;
			sprite.height = bichos[i].height;
			sprite.left = bichos[i].left;
			sprite.top = bichos[i].top;
			sprite.velocityX = bichos[i].velocityX;
			sprite.minLeftDistance = bichos[i].minLeftDistance;
			sprite.maxLeftDistance = bichos[i].maxLeftDistance;
			sprite.squashed = bichos[i].squashed;
			sprite.disppearTimer = bichos[i].disppearTimer;
			sprite.beginDisppearTime = bichos[i].beginDisppearTime;

			this.spritesArray.push(sprite);
		}
	},
	createMushroomSprite: function() {
		var mushrooms = this.mushroomsData;
		for(var i=0;i<mushrooms.length;i++){
			var sprite =new Sprite(mushrooms[i].type,[],mushrooms[i].src,1,mushrooms[i].width,mushrooms[i].height);
			sprite.width = mushrooms[i].width;
			sprite.height = mushrooms[i].height;
			sprite.left = mushrooms[i].left;
			sprite.top = mushrooms[i].top;

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
		
		this.orio.jumpHeight = 120;
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
	
	if(!superOrio.gameOver){var key = e.keyCode;
		if(key === 65){
			superOrio.orio.walk_left = true;
			
		}else if(key === 68){
			superOrio.orio.walk_right = true;
		}
		else if(key === 87){
			if(!superOrio.orio.falling)
			superOrio.orio.jump();
		}}
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
	if(!superOrio.orio.gameOver){if(superOrio.orio.walk_left&&!superOrio.orio.walk_right&&!superOrio.orio.jumpping&&!superOrio.orio.falling){
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
		}}
},30);

var superOrio = new SuperOrio();
superOrio.createSprites();
superOrio.initialize();
