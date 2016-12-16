/*
сделать нормальный подсчет очков, количество фейлов, стадии игры, убрать рамку на спрайтшите
*/

function init() {
	console.info("initialized"); 
	var stage = new createjs.Stage("game"); 
  
	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.framerate = 30;

	var background = new createjs.Bitmap("images/background.png");
	background.width = 640;
	background.height = 480;
	stage.addChild(background);
  
	var birdData = {
		images: ["images/birdSpriteSheet.png"],
		frames: {width:714/3, height:356/2, count:6, regX:714/6, regY:356/4, spacing:0, margin:0},
		animations: {
			open: {
				frames : [0, 1, 2, 3, 4, 5],
				next :  "close"
			}, 
			close: { 
				frames: [5, 4, 3, 2, 1, 0],
				next: "stayClose"
			},
			stayClose: 0
		}
	};

	var spriteSheetOfBird = new createjs.SpriteSheet(birdData);
	var spriteOfBird = new createjs.Sprite(spriteSheetOfBird);
	var birdPosition = 3;
	spriteOfBird.x = 220;
	spriteOfBird.y = 400;
	stage.addChild(spriteOfBird);
		
	var gameStatus = "start";
	var countFails = 0; 
  
	// --------------------------арбузы---------------------------------
  
	var watermelons = [];
	var countWatermelons = 0;
	var speed = 2000;
  
	function createWatermelon(){
		if (gameStatus != "gameOver") {
			var wtm = { branchN : Math.floor(Math.random() * 4) + 1 };
			watermelons.push(wtm);		

			if (countWatermelons != 0 && countWatermelons % 5 == 0 && countWatermelons < 80)
				speed-=400;
		  
			var bmp = new createjs.Bitmap("images/arbuz.png");
			wtm.bmp = bmp;
			  
			stage.addChild(bmp);
			bmp.regX = 100 / 2;
			bmp.regY = 100 / 2;
			bmp.scaleX = 0.5;
			bmp.scaleY = 0.5;
			var twin;
			switch(wtm.branchN){
				case 1:
					bmp.x = 65;			
					bmp.y = 75;		
					twin = createjs.Tween.get(bmp).to({x : 185, y : 160, rotation : 180}, speed);	
					break;
				case 2:
					bmp.x = 575;			
					bmp.y = 75;
					twin = createjs.Tween.get(bmp).to({x : 455, y : 160, rotation : -180}, speed);
					break;
				case 3:
					bmp.x = 65;			
					bmp.y = 185;
					twin = createjs.Tween.get(bmp).to({x : 185, y : 275, rotation : 180}, speed);
					break;
				case 4:
					bmp.x = 575;			
					bmp.y = 185;
					twin = createjs.Tween.get(bmp).to({x : 455, y : 275, rotation : -180}, speed);
					break;
			}
			
			twin.call(function() {
				if (wtm.branchN == birdPosition) {				
					spriteOfBird.gotoAndPlay("open");
					deleteBmp(bmp, wtm);
					countWatermelons++;
				} else {
					var tween;
					switch(wtm.branchN){
						case 1:	
							tween = createjs.Tween.get(bmp).to({x : 200, y : 445, rotation : 250}, 1000);	
							break;
						case 2:
							tween = createjs.Tween.get(bmp).to({x : 440, y : 445, rotation : -250}, 1000);
							break;
						case 3:
							tween = createjs.Tween.get(bmp).to({x : 200, y : 445, rotation : 250}, 1000);
							break;
						case 4:
							tween = createjs.Tween.get(bmp).to({x : 440, y : 445, rotation : -250}, 1000);
							break;
					}
					tween.call(function() {
					var x = 410;
						if (wtm.branchN == 1 || wtm.branchN == 3)
							x = 170;
						stage.removeChild(bmp); 
						var crashed = new createjs.Bitmap("images/arbuz2.png");
						stage.addChild(crashed);
						crashed.x = x;
						crashed.y = 420;
						crashed.scaleX = 0.5;
						crashed.scaleY = 0.5;
					})
					countFails++;	
					if(countFails >= 3) {
						gameStatus = "gameOver";
						tween.wait(3000).call(gameOver());
					}
				}
				
			});	
		}		
	}
		
	function deleteBmp(bmp, wtm) {
		watermelons.splice(watermelons.indexOf(wtm), 1);
		stage.removeChild(bmp);
	}
	
	var bgHit = new createjs.Shape();
	bgHit.graphics.beginFill('#000000').drawRect(0, 0, 640, 480);
	
	background.hitArea = bgHit;
	
	background.addEventListener("click", function(event){	
		if(event.localX <= background.width / 2){
			spriteOfBird.x = 220;
			spriteOfBird.scaleX = 1;
			if (event.localY < background.height / 2) {
				spriteOfBird.y = 260;
				birdPosition = 1;
			}else {
				spriteOfBird.y = 400;
				birdPosition = 3;
			}
		} else {
			spriteOfBird.x = 420;
			spriteOfBird.scaleX = -1;
			if (event.localY < background.height / 2) {
				spriteOfBird.y = 260;
				birdPosition = 2;
			}else {
				spriteOfBird.y = 400;
				birdPosition = 4;
			}
		}		
	});  
	
	var result = new createjs.Text(countWatermelons, "40px Arial", "#000000");
	result.x = 310;
	
	function printResult(){
		result.text = countWatermelons;
	}	
	
	if(gameStatus == "start"){
		var button = new createjs.Shape();
		button.graphics.beginFill("#000000").drawRect((background.width - 160) / 2, 120, 160, 80);
		var startText = new createjs.Text("Start", "40px Arial", "#FFFFFF");
		startText.x = background.width / 2;
		startText.textAlign = "center";
		startText.y = 135;
		stage.addChild(button, startText);
		
		button.addEventListener("click", function() {
			stage.removeChild(button, startText);
			createWatermelon();
			setInterval(createWatermelon, 2000);
			
			stage.addChild(result);	
			setInterval(printResult, 200);
		
			gameStatus = "game";
		})
		
		stage.enableMouseOver();
		button.addEventListener("mouseover", function() {
			startText.font = "42px Arial";
		});		
		button.addEventListener("mouseout", function() {
			startText.font = "40px Arial";
		});
	}
	
	function gameOver() {
		stage.removeChild(result);
		watermelons = [];
		var gameOverText = new createjs.Text("Game over...", "30px Arial", "#000000");
		stage.addChild(gameOverText);
		gameOverText.x = background.width / 2;
		gameOverText.textAlign = "center";
		gameOverText.y = 30;
		
		//var score = new createjs.Shape();
		//score.graphics.beginFill("#000000").drawRect(240, 120, 160, 65); 		
		var resultText = new createjs.Text("Score : " + countWatermelons, "30px Arial", "#000000");
		resultText.x = background.width / 2;
		resultText.textAlign = "center";
		resultText.y = 70;
		stage.addChild(resultText);		
	}

	
	
	
}
