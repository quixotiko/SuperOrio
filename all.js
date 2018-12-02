var Sprite = function(type,behaviors){
	var default_width = 32;
	    default_height = 32;
	this.type = type;
	this.behaviors = behaviors || [];
	this.width = default_width;
	this.height = default_height;
	this.top = 0;
	this.left = 0;
	this.velocityX = 0;
	this.velocityY = 0;
};

Sprite.prototype = {

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

	];


};
SuperOrio.prototype = {
	initializeBackground: function(){
		this.backgroundImage.src = "images/background.png";
		this.backgroundImage.onload = function(e){
			superOrio.drawBackground();
		};
	},
	initializePlatforms: function(){
		for(var i = 0;i < this.platformData.length; i++){
			(function(platform){
				platform.platformImage = new Image();
				platform.platformImage.src = "images/4rocks.png";
				platform.platformImage.onload = function(e){
				    superOrio.drawPlatform(platform);
				};
			})(this.platformData[i]);
		}
	},
	drawPlatform: function(platform){
		    this.context.drawImage(platform.platformImage,platform.left,platform.top);
	},
	drawBackground: function(){
		this.context.translate(0,this.bg_offset);
		this.context.drawImage(this.backgroundImage,0,-1400);
		this.context.translate(0,-this.bg_offset);
	},
	animate: function(now){
		superOrio.setOffset(now);
		superOrio.draw();
		lastAnimationFrameTime = now;
		requestNextAnimationFrame(superOrio.animate);
	},
	setOffset: function(now){
		this.setBackgroundOffset(now);
	},
	draw: function(){
		this.drawBackground();
		for(var i = 0; i < this.platformData.length; i++){
			this.drawPlatform(this.platformData[i]);
		}
	},
	startGame: function(){
		requestNextAnimationFrame(superOrio.animate);
	},
	initialize: function(){
		this.initializeBackground();
		this.initializePlatforms();
		this.startGame();
	},
	setBackgroundOffset: function(now){
		this.bg_offset = this.bg_v*(now-this.lastAnimationFrameTime)/1000;
	},

	createSprites: function(){
		this.createOrioSprite();
		this.initializeSprites();
	},
	createOrioSprite: function(){
		this.orio = new Sprite("orio",[
			this.orioWalkBehavior, 
			this.orioJumpBehavior, 
			this.orioFallBehavior, 
			this.orioCollideBehavior]);
		this.orio.width = 24;
		this.orio.height = 32;
		this.orio.left = 0;
		this.orio.top = 600;

		this.spritesArray.push(this.orio);
	}
};

var superOrio = new SuperOrio();
superOrio.initialize();