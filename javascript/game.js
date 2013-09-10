$(function () {
    initializeGame();
});

var canvas, stage, preload;
var backgroundImage;
var backgroundBitmap;
var skyBitmap;
var backgroundDesertBitmap, backgroundCityDayBitmap, backgroundCityNightBitmap;
var clownBodyBitmap, clownShadowBitmap;

var clownFeetAnimation, clownHandAnimation;
var roadAnimation;
var sidegroundDesertAnimation, sidegroundCityDayAnimation, sidegroundCityNightAnimation;
var backgroundDayAnimation, backgroundNightAnimation, backgroundCloudAnimation;

var score = 0, health = 5;

var clownPosition = 300, clownLeftBound = 60, clownRightBound = 540;
var laneStart = 200, laneMid = 275, laneMid2 = 345, laneCollisionCheck = 420, laneEnd = 520;
var healthText, scoreText, scoreGameOverText;
var laneR4 = [];
var laneL3 = [], laneL2 = [], laneL1 = [], laneM = [], laneR1 = [], laneR2 = [], laneR3 = [];
var laneSlowVelocity = .25;
var laneMidVelocity = .75;
var laneMid2Velocity = 1;
var laneFastVelocity = 1.5;
var laneSlowVelocityBase = .25;
var laneMidVelocityBase = .75;
var laneMid2VelocityBase = 1;
var laneFastVelocityBase = 1.5;
var roadAnimationFrequencyBase = 27;

var clownHit = false;
var invulnCap = 2000;
var invulnTime = 0;

var obstacleBugCap = 5000;
var obstacleBugTime = 0;
var obstacleSpawnCapBase = 5000;
var obstacleSpawnCap = 5000;
var obstacleSpawnTime = 0;
var spawnBlocked = false;

var ping;

var debrisBitmap1, debrisBitmap2, debrisBitmap3;

var animalBitmap1, animalBitmap2, animalBitmap3;

var signBitmap0, signBitmap1, signBitmap2, signBitmap3, signBitmap4, signBitmap5, signBitmap6, signBitmap7, signBitmap8, signBitmap9;

var vehicleBitmaps = [];
var animalBitmaps = [];
var debrisBitmaps = [];
var signBitmaps = [];

var healthAnimation;

var obstacles = [];
var obstacleTracker = { l3: 0, l2: 0, l1: 0, m: 0, r1: 0, r2: 0, r3: 0 };
var difficulty = 1;
var difficultyCap = 15000;
var difficultyTime = 0;

var juggled = [];
var bowlingPinBitmap1, bowlingPinBitmap2, bowlingPinBitmap3, bowlingPinBitmap4;

var targetClownPosition;



// 0 - start game, 1 - instructions, 2 - juggling portion, 3 - buskering portion, 4 - game over, 5 - finish!
var gameState = 'splash';
var cities = ['Parsippany', 'Scranton', 'Binghamton', 'Cortland', 'Syracuse', 'Rochester', 'Buffalo', 'Hamilton', 'Mississauga', 'Toronto'];

function initializeGame() {
    canvas = document.getElementById('main-canvas');
    canvas.width = 600;
    canvas.height = 480;
    stage = new createjs.Stage(canvas);
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);

    var manifest = [
        { id: 'backgroundImage', src: 'images/cornflowerblue.bmp' },
        { id: 'roadImage', src: 'images/road.png' },
        { id: 'backgroundCityImage', src: 'images/cityBackground.png' },
        { id: 'clownBodyImage', src: 'images/clownbody.png' },
        { id: 'bananaImage', src: 'images/bananas.png' },
        { id: 'tireImage', src: 'images/tire.png' },
        { id: 'normalCarImage', src: 'images/car.png' },
        { id: 'normalCarImage2', src: 'images/car2.png' },
        { id: 'bowlingPinImage', src: 'images/bowling-pin.png' },
        { id: 'cowImage', src: 'images/cow.png' },
        { id: 'elkImage', src: 'images/elk.png' },
        { id: 'mooseImage', src: 'images/moose.png' },
        { id: 'SplashPage', src: 'images/SplashPage.png' },
        { id: 'InstructionPage', src: 'images/InstructionPage.png' },
        { id: 'CreditsPage', src: 'images/CreditsPage.png' },
        { id: 'GameOverPage', src: 'images/GameOverPage.png' },
        { id: 'WinPage', src: 'images/WinPage.png' },
        { id: 'Sign0', src: 'images/sign0.png' },
        { id: 'Sign1', src: 'images/sign1.png' },
        { id: 'Sign2', src: 'images/sign2.png' },
        { id: 'Sign3', src: 'images/sign3.png' },
        { id: 'Sign4', src: 'images/sign4.png' },
        { id: 'Sign5', src: 'images/sign5.png' },
        { id: 'Sign6', src: 'images/sign6.png' },
        { id: 'Sign7', src: 'images/sign7.png' },
        { id: 'Sign8', src: 'images/sign8.png' },
        { id: 'Sign9', src: 'images/sign9.png' }
    ];

    preload.addEventListener('complete', prepareAssets);
    preload.loadFile({ id: "sound", src: "sounds/ping.wav" });
    preload.loadFile({ id: "hit", src: "sounds/hit.wav" });
    preload.loadFile({ id: "bgm", src: "sounds/bennyhill.mp3" });
    preload.loadManifest(manifest);
};

function prepareAssets() {
    var index = 0;
    scoreText = new createjs.Text("Score: 1000 ", "24px sans-serif", "Black");
    scoreText.x = canvas.width - scoreText.getMeasuredWidth() - 20;
    scoreText.y = 20;
    scoreText.text = 'Score: 0';

    scoreGameOverText = new createjs.Text("1000", "48px sans-serif", "White");
    scoreGameOverText.x = 325;
    scoreGameOverText.y = 200;
    scoreGameOverText.visible = false;

    prepareBitmaps();
    prepareAnimations();
    preparePages();

    clownBodyBitmap.y = 200;
    clownBodyBitmap.x = clownPosition - clownBodyBitmap.image.width / 2;
    clownFeetAnimation.x = clownPosition - 56;
    clownFeetAnimation.y = clownBodyBitmap.y + 153;
    clownHandAnimation.x = clownPosition - 57;
    clownHandAnimation.y = clownBodyBitmap.y + 80;

    stage.addChild(skyBitmap);
    stage.addChild(backgroundBitmap);
    stage.addChild(roadAnimation);

    stage.addChild(signBitmap0);
    stage.addChild(signBitmap1);
    stage.addChild(signBitmap2);
    stage.addChild(signBitmap3);
    stage.addChild(signBitmap4);
    stage.addChild(signBitmap5);
    stage.addChild(signBitmap6);
    stage.addChild(signBitmap7);
    stage.addChild(signBitmap8);
    stage.addChild(signBitmap9);
    stage.addChild(debrisBitmap1);
    stage.addChild(debrisBitmap2);
    stage.addChild(normalCarBitmap1);
    stage.addChild(normalCarBitmap2);
    stage.addChild(animalBitmap1);
    stage.addChild(animalBitmap2);
    stage.addChild(animalBitmap3);

    signBitmaps.push(signBitmap0);
    signBitmaps.push(signBitmap1);
    signBitmaps.push(signBitmap2);
    signBitmaps.push(signBitmap3);
    signBitmaps.push(signBitmap4);
    signBitmaps.push(signBitmap5);
    signBitmaps.push(signBitmap6);
    signBitmaps.push(signBitmap7);
    signBitmaps.push(signBitmap8);
    signBitmaps.push(signBitmap9);
    debrisBitmaps.push(debrisBitmap1);
    debrisBitmaps.push(debrisBitmap2);
    animalBitmaps.push(animalBitmap1);
    animalBitmaps.push(animalBitmap2);
    animalBitmaps.push(animalBitmap3);
    vehicleBitmaps.push(normalCarBitmap1);
    vehicleBitmaps.push(normalCarBitmap2);


    stage.addChild(clownFeetAnimation);
    stage.addChild(clownHandAnimation);

    stage.addChild(bowlingPinBitmap1);
    stage.addChild(bowlingPinBitmap2);
    stage.addChild(bowlingPinBitmap3);
    stage.addChild(bowlingPinBitmap4);

    
    juggled.push({ bitmap: bowlingPinBitmap1, angle: 0 });
    juggled.push({ bitmap: bowlingPinBitmap2, angle: 90 });
    juggled.push({ bitmap: bowlingPinBitmap3, angle: 180 });
    juggled.push({ bitmap: bowlingPinBitmap4, angle: 270 });

    stage.addChild(clownBodyBitmap);
    
    stage.addChild(scoreText);
    stage.addChild(healthAnimation);

    stage.addChild(splashPage);
    stage.addChild(instructionPage);
    stage.addChild(creditsPage);
    stage.addChild(gameOverPage);
    stage.addChild(scoreGameOverText);
    stage.addChild(btnInstructions);
    stage.addChild(btnCredits);
    stage.addChild(btnStartGame);
    stage.addChild(btnBack);
    stage.addChild(btnRestart);

    stage.onMouseMove = stageMouseMove;
    stage.addEventListener("click", stageClicked);

    createjs.Sound.play('sounds/bennyhill.mp3', 'none', 0, 0, -1, .1, 0);

    startGame();
};

function prepareAnimations() {
    // animations
    var roadData = {
        images: ['images/road.png'],
        frames: { width: 78, height: 272 },
        animations: { slow: [0, 2, 'slow', 27], regular: [0, 2, 'regular', 18], fast: [0, 2, 'fast', 9] }
    };
    var roadSS = new createjs.SpriteSheet(roadData);
    roadAnimation = new createjs.BitmapAnimation(roadSS);
    roadAnimation.x = 260;
    roadAnimation.y = 215;
    roadAnimation.gotoAndPlay('slow');

    var feetData = {
        images: ['images/clownfeet.png'],
        frames: { width: 112, height: 114 },
        animations: { slow: [0, 9, 'slow', 9], regular: [0, 9, 'regular', 6], fast: [0, 9, 'fast', 3] }
    };
    var feetSS = new createjs.SpriteSheet(feetData);
    clownFeetAnimation = new createjs.BitmapAnimation(feetSS);
    clownFeetAnimation.gotoAndPlay('slow');

    var handData = {
        images: ['images/clownarms.png'],
        frames: { width: 114, height: 71 },
        animations: { run: [0, 5, 'run', 24] }
    };
    var handSS = new createjs.SpriteSheet(handData);
    clownHandAnimation = new createjs.BitmapAnimation(handSS);
    clownHandAnimation.gotoAndPlay('run');

    // health bar
    var healthData = {
        images: ['images/lives.png'],
        frames: { width: 210, height: 35 },
        animations: { five: [0, 0], four: [1, 1], three: [2, 2], two: [3, 3], one: [4, 4], zero: [5, 5] }
    };
    var healthSS = new createjs.SpriteSheet(healthData);
    healthAnimation = new createjs.BitmapAnimation(healthSS);
    healthAnimation.y = 8;
    healthAnimation.x = 20;
    healthAnimation.gotoAndPlay('five');
};
function prepareBitmaps() {
    // bitmaps
    var skyImage = preload.getResult('backgroundImage');
    skyBitmap = new createjs.Bitmap(skyImage);

    backgroundImage = preload.getResult('backgroundCityImage');
    backgroundBitmap = new createjs.Bitmap(backgroundImage);

    var clownBodyImage = preload.getResult('clownBodyImage');
    clownBodyBitmap = new createjs.Bitmap(clownBodyImage);

    var bananaImage = preload.getResult('bananaImage');
    debrisBitmap1 = new createjs.Bitmap(bananaImage);
    debrisBitmap1.regX = debrisBitmap1.image.width / 2;
    debrisBitmap1.visible = false;

    var tireImage = preload.getResult('tireImage');
    debrisBitmap2 = new createjs.Bitmap(tireImage);
    debrisBitmap2.regX = debrisBitmap2.image.width / 2;
    debrisBitmap2.visible = false;

    var normalCarImage = preload.getResult('normalCarImage');
    normalCarBitmap1 = new createjs.Bitmap(normalCarImage);
    normalCarBitmap1.regX = normalCarBitmap1.image.width / 2;
    normalCarBitmap1.regY = normalCarBitmap1.image.height;
    normalCarBitmap1.visible = false;

    var normalCarImage2 = preload.getResult('normalCarImage2');
    normalCarBitmap2 = new createjs.Bitmap(normalCarImage2);
    normalCarBitmap2.regX = normalCarBitmap2.image.width / 2;
    normalCarBitmap2.regY = normalCarBitmap2.image.height;
    normalCarBitmap2.visible = false;

    var cowImage = preload.getResult('cowImage');
    animalBitmap1 = new createjs.Bitmap(cowImage);
    animalBitmap1.regX = animalBitmap1.image.width / 2;
    animalBitmap1.regY = animalBitmap1.image.height;
    animalBitmap1.visible = false;

    var elkImage = preload.getResult('elkImage');
    animalBitmap2 = new createjs.Bitmap(elkImage);
    animalBitmap2.regX = animalBitmap2.image.width / 2;
    animalBitmap2.regY = animalBitmap2.image.height;
    animalBitmap2.visible = false;

    var mooseImage = preload.getResult('mooseImage');
    animalBitmap3 = new createjs.Bitmap(mooseImage);
    animalBitmap3.regX = animalBitmap3.image.width / 2;
    animalBitmap3.regY = animalBitmap3.image.height;
    animalBitmap3.visible = false;

    var bowlingPinImage = preload.getResult('bowlingPinImage');
    bowlingPinBitmap1 = new createjs.Bitmap(bowlingPinImage);
    bowlingPinBitmap1.regX = bowlingPinBitmap1.image.width / 2;
    bowlingPinBitmap1.regY = 50;
    bowlingPinBitmap2 = new createjs.Bitmap(bowlingPinImage);
    bowlingPinBitmap2.regX = bowlingPinBitmap2.image.width / 2;
    bowlingPinBitmap2.regY = 50;
    bowlingPinBitmap3 = new createjs.Bitmap(bowlingPinImage);
    bowlingPinBitmap3.regX = bowlingPinBitmap3.image.width / 2;
    bowlingPinBitmap3.regY = 50;
    bowlingPinBitmap4 = new createjs.Bitmap(bowlingPinImage);
    bowlingPinBitmap4.regX = bowlingPinBitmap4.image.width / 2;
    bowlingPinBitmap4.regY = 50;
    
    var sign0Image = preload.getResult('Sign0');
    signBitmap0 = new createjs.Bitmap(sign0Image);
    signBitmap0.regX = signBitmap0.image.width / 2;
    var sign1Image = preload.getResult('Sign1');
    signBitmap1 = new createjs.Bitmap(sign1Image);
    signBitmap1.regX = signBitmap1.image.width / 2;
    var sign2Image = preload.getResult('Sign2');
    signBitmap2 = new createjs.Bitmap(sign2Image);
    signBitmap2.regX = signBitmap2.image.width / 2;
    var sign3Image = preload.getResult('Sign3');
    signBitmap3 = new createjs.Bitmap(sign3Image);
    signBitmap3.regX = signBitmap3.image.width / 2;
    var sign4Image = preload.getResult('Sign4');
    signBitmap4 = new createjs.Bitmap(sign4Image);
    signBitmap4.regX = signBitmap4.image.width / 2;
    var sign5Image = preload.getResult('Sign5');
    signBitmap5 = new createjs.Bitmap(sign5Image);
    signBitmap5.regX = signBitmap5.image.width / 2;
    var sign6Image = preload.getResult('Sign6');
    signBitmap6 = new createjs.Bitmap(sign6Image);
    signBitmap6.regX = signBitmap6.image.width / 2;
    var sign7Image = preload.getResult('Sign7');
    signBitmap7 = new createjs.Bitmap(sign7Image);
    signBitmap7.regX = signBitmap7.image.width / 2;
    var sign8Image = preload.getResult('Sign8');
    signBitmap8 = new createjs.Bitmap(sign8Image);
    signBitmap8.regX = signBitmap8.image.width / 2;
    var sign9Image = preload.getResult('Sign9');
    signBitmap9 = new createjs.Bitmap(sign9Image);
    signBitmap9.regX = signBitmap9.image.width / 2;

    signBitmap0.x = -300;
    signBitmap1.x = -300;
    signBitmap2.x = -300;
    signBitmap3.x = -300;
    signBitmap4.x = -300;
    signBitmap5.x = -300;
    signBitmap6.x = -300;
    signBitmap7.x = -300;
    signBitmap8.x = -300;
    signBitmap9.x = -300;
    signBitmap0.regY = signBitmap0.image.height / 2;
    signBitmap1.regY = signBitmap0.image.height / 2;
    signBitmap2.regY = signBitmap0.image.height / 2;
    signBitmap3.regY = signBitmap0.image.height / 2;
    signBitmap4.regY = signBitmap0.image.height / 2;
    signBitmap5.regY = signBitmap0.image.height / 2;
    signBitmap6.regY = signBitmap0.image.height / 2;
    signBitmap7.regY = signBitmap0.image.height / 2;
    signBitmap8.regY = signBitmap0.image.height / 2;
    signBitmap9.regY = signBitmap0.image.height / 2;
    signBitmap0.visible = false;
    signBitmap1.visible = false;
    signBitmap2.visible = false;
    signBitmap3.visible = false;
    signBitmap4.visible = false;
    signBitmap5.visible = false;
    signBitmap6.visible = false;
    signBitmap7.visible = false;
    signBitmap8.visible = false;
    signBitmap9.visible = false;

}


function startGame() {
    createjs.Ticker.setInterval(window.requestAnimationFrame);
    createjs.Ticker.addListener(gameLoop);
};

function gameLoop() {
    update();
    draw();
};

function draw() {
    stage.update();
};

var prevTime = 0;
function update() {
    var totalTime = createjs.Ticker.getTime();
    var elapsedTime = totalTime - prevTime;
    prevTime = createjs.Ticker.getTime();
    updateClownPosition();
    updateJuggled();
    switch (gameState) {
        case 'game':
            updateInvuln(elapsedTime);
            updateLanes();
            updateObstacles(elapsedTime);
            updateDifficulty(elapsedTime);
            updateScore(elapsedTime);
            updateHealth();
            break;
    }
};
function hasCollidedWithClown(left, width) {
    var pt = clownPosition;
    if (left < pt && pt < left + width){
        return true;
    }
    return false;
};
function updateInvuln(elapsedMS) {
    if (clownHit) {
        invulnTime += elapsedMS;
        if (invulnTime > invulnCap) {
            clownHit = false;
            invulnTime = 0;
            createjs.Tween.removeTweens(clownBodyBitmap);
            createjs.Tween.removeTweens(clownFeetAnimation);
            createjs.Tween.removeTweens(clownHandAnimation);
            clownBodyBitmap.alpha = 1;
            clownFeetAnimation.alpha = 1;
            clownHandAnimation.alpha = 1;
        }
    }
};
function updateLane(lane, slope, isVertical, horizontalOffset, velocityOverride, scaleMultiplier){
    var index;
    var laneDivisor = laneCollisionCheck - laneStart + laneStart / 12;
    for (index = lane.length - 1; index >= 0; index--) {
        if (velocityOverride == 0) {
            if (lane[index].position < laneMid) {
                lane[index].position += laneSlowVelocity;
            } else if (lane[index].position < laneMid2) {
                lane[index].position += laneMidVelocity;
            } else if (lane[index].position < laneCollisionCheck) {
                lane[index].position += laneMid2Velocity;
            } else {
                lane[index].position += laneFastVelocity;
            }
        } else {
            if (lane[index].position < laneCollisionCheck)
                lane[index].position += velocityOverride;
            else
                lane[index].position += 1;
        }
        lane[index].bitmap.y = lane[index].position;
        if (isVertical) {
            lane[index].bitmap.x = 300;
        } else { 
            if (slope > 0)
                lane[index].bitmap.x = 300 + horizontalOffset + (lane[index].bitmap.y - 190) / slope;
            else
                lane[index].bitmap.x = 290 + horizontalOffset + (lane[index].bitmap.y - 190) / (slope * 1.5);
        }
        lane[index].bitmap.scaleX = (1 - (laneEnd - lane[index].position - 100) / laneDivisor) * scaleMultiplier;
        lane[index].bitmap.scaleY = (1 - (laneEnd - lane[index].position - 100) / laneDivisor) * scaleMultiplier;

        if (lane[index].position > laneCollisionCheck) {
            if (!clownHit && hasCollidedWithClown(lane[index].bitmap.x - lane[index].bitmap.regX, lane[index].bitmap.image.width)){
                var hitSound = createjs.Sound.createInstance("hit");
                hitSound.play();
                clownHit = true;
                score -= (difficulty + 1) * 50;
                health--;
                createjs.Tween.get(clownBodyBitmap, {loop: true}).to({ alpha: .2 }, 200).to({ alpha: .8 }, 200);
                createjs.Tween.get(clownFeetAnimation, {loop: true}).to({ alpha: .2 }, 200).to({ alpha: .8 }, 200);
                createjs.Tween.get(clownHandAnimation, {loop: true}).to({ alpha: .2 }, 200).to({ alpha: .8 }, 200);
                if (health == 0){
                    gotoGameOver();
                }
            }
        }
        if (lane[index].position >= laneEnd) {
            lane[index].position = laneEnd;
            lane[index].bitmap.scaleX = 1;
            lane[index].bitmap.scaleY = 1;
            lane[index].bitmap.visible = false;
            
            // deregister obstacle
            obstacleTracker.l3 = 0;
            obstacleTracker.l2 = 0;
            obstacleTracker.l1 = 0;
            obstacleTracker.m = 0;
            obstacleTracker.r1 = 0;
            obstacleTracker.r2 = 0;
            obstacleTracker.r3 = 0;

            lane.splice(index, 1);
            break;
        }
    }
}
function updateLanes() {    
    updateLane(laneL1, -2.8, false, 0, 0, 1);
    updateLane(laneL2, -1.7, false, 0, 0, 1);
    updateLane(laneL3, -1.25, false, 0, 0, 1);
    updateLane(laneM, 1, true, 0, 0, 1);
    updateLane(laneR1, 2.8, false, 0, 0, 1);
    updateLane(laneR2, 1.7, false, 0, 0, 1);
    updateLane(laneR3, 1.25, false, 0, 0, 1);
    updateLane(laneR4, .3, false, 60, .2, 1.5);
};
function updateClownPosition() {
    if (gameState != 'game') {
        clownPosition = 300;
    } else {
        if (targetClownPosition < clownPosition){
            clownPosition -= 1;
            if (targetClownPosition > clownPosition) clownPosition = targetClownPosition;
        } else if (targetClownPosition > clownPosition) {
            clownPosition += 1;
            if (targetClownPosition < clownPosition) clownPosition = targetClownPosition;
        }
    
        clownBodyBitmap.x = clownPosition - clownBodyBitmap.image.width / 2;
        clownFeetAnimation.x = clownPosition - 56;
        clownHandAnimation.x = clownPosition - 57;
    }
};
function updateObstacles(elapsedMS) {
    var obstacleTypes = ['animal', 'animal', 'vehicle', 'debris', 'debris', 'animal'];
    if (spawnBlocked) {
        obstacleSpawnTime += elapsedMS;
        if (obstacleSpawnTime > obstacleSpawnCap) {
            obstacleSpawnTime = 0;
            spawnBlocked = false;
        }
    }

    if (obstacleTracker.l1 + obstacleTracker.l2 + obstacleTracker.l1 +
        obstacleTracker.m +
        obstacleTracker.r1 + obstacleTracker.r2 + obstacleTracker.r3 < 4 && !spawnBlocked){
        obstacleBugTime = 0;

        // no obstacles on screen.
        addObstacle(obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]);
        spawnBlocked = true;
    } else {
        obstacleBugTime += elapsedMS;
        if (obstacleBugTime > obstacleBugCap) {
            obstacleTracker.l1 = 0;
            obstacleTracker.l2 = 0;
            obstacleTracker.l3 = 0;
            obstacleTracker.r1 = 0;
            obstacleTracker.r2 = 0;
            obstacleTracker.r3 = 0;
            obstacleTracker.m = 0;
            obstacleBugTime = 0;
        }
    }
}
function addObstacle(type) {
    var vehicleSlots = [];
    var animalSlots = [];
    var debrisSlots = [];
    var bitmapIndex = 0;
    var randomBitmap;
    var lane = '';
    var typeSize = 1;
    switch (type){
        case 'vehicle':
            if (obstacleTracker.l1 == 0 && obstacleTracker.l2 == 0 && obstacleTracker.l3 == 0)
                vehicleSlots.push('l2');
            if (obstacleTracker.r1 == 0 && obstacleTracker.r2 == 0 && obstacleTracker.r3 == 0)
                vehicleSlots.push('r2');
            randomBitmap = vehicleBitmaps[Math.floor(Math.random() * vehicleBitmaps.length)];
            lane = vehicleSlots[Math.floor(Math.random() * vehicleSlots.length)];
            typeSize = 3;
            break;
        case 'animal':
            if (obstacleTracker.l3 == 0 && obstacleTracker.l2 == 0) animalSlots.push('l3');
            if (obstacleTracker.l1 == 0 && obstacleTracker.m == 0) animalSlots.push('l1');
            if (obstacleTracker.r1 == 0 && obstacleTracker.m == 0) animalSlots.push('m');
            if (obstacleTracker.r2 == 0 && obstacleTracker.r3 == 0) animalSlots.push('r2');
            randomBitmap = animalBitmaps[Math.floor(Math.random() * animalBitmaps.length)];
            lane = animalSlots[Math.floor(Math.random() * animalSlots.length)];
            typeSize = 2;
            break;
        case 'debris':
            if (obstacleTracker.l1 == 0) debrisSlots.push('l1');
            if (obstacleTracker.l2 == 0) debrisSlots.push('l2');
            if (obstacleTracker.l3 == 0) debrisSlots.push('l3');
            if (obstacleTracker.m == 0) debrisSlots.push('m');
            if (obstacleTracker.r1 == 0) debrisSlots.push('r1');
            if (obstacleTracker.r2 == 0) debrisSlots.push('r2');
            if (obstacleTracker.r3 == 0) debrisSlots.push('r3');
            randomBitmap = debrisBitmaps[Math.floor(Math.random() * debrisBitmaps.length)];
            lane = debrisSlots[Math.floor(Math.random() * debrisSlots.length)];
            typeSize = 1;
            break;
    }

    if (!randomBitmap.visible) {
        randomBitmap.visible = true;

        switch (lane) {
            case 'l1':
                obstacleTracker.l1 = 1;
                if (typeSize == 2) obstacleTracker.m = 1;
                laneL1.push({ bitmap: randomBitmap, position: laneStart, size: typeSize, laneName: lane });
                break;
            case 'l2':
                obstacleTracker.l2 = 1;
                if (typeSize == 2) obstacleTracker.l1 = 1;
                if (typeSize == 3) {
                    obstacleTracker.l3 = 1;
                    obstacleTracker.l1 = 1;
                }
                laneL3.push({ bitmap: randomBitmap, position: laneStart, size: typeSize, laneName: lane });
                break;
            case 'l3':
                obstacleTracker.l3 = 1;
                if (typeSize == 2) obstacleTracker.l2 = 1;
                laneL3.push({ bitmap: randomBitmap, position: laneStart, size: typeSize, laneName: lane });
                break;
            case 'r1':
                obstacleTracker.r1 = 1;
                if (typeSize == 2) obstacleTracker.r2 = 1;
                laneR1.push({ bitmap: randomBitmap, position: laneStart, size: typeSize, laneName: lane });
                break;
            case 'r2':
                obstacleTracker.r2 = 1;
                if (typeSize == 2) obstacleTracker.r3 = 1;
                if (typeSize == 3) {
                    obstacleTracker.r3 = 1;
                    obstacleTracker.r1 = 1;
                }
                laneR2.push({ bitmap: randomBitmap, position: laneStart, size: typeSize, laneName: lane });
                break;
            case 'r3':
                obstacleTracker.r3 = 1;
                laneR3.push({ bitmap: randomBitmap, position: laneStart, size: typeSize, laneName: lane });
                break;
            case 'm':
                obstacleTracker.m = 1;
                if (typeSize == 2) obstacleTracker.r1 = 1;
                laneM.push({ bitmap: randomBitmap, position: laneStart, size: typeSize, laneName: lane });
                break;
        }
    }
}

function addSign(index) {
    signBitmaps[index].visible = true;
    laneR4.push({ bitmap: signBitmaps[index], position: laneStart, size: 1, laneName: 'r4' });
}

function updateJuggled() {
    // The trajectory of a juggled item is supposed to mimic a parabola with a line connect, but i've chosen to use an ellipse instead.
    var index = 0;
    var radians;
    var r;
    for (index = 0; index < juggled.length; ++index) {
        if (juggled[index].angle > 180) {
            if (juggled[index].angle > 240 && juggled[index].angle < 300)
                juggled[index].angle += .4;
            else
                juggled[index].angle += .75;
        }
        else
            juggled[index].angle += 1.2;

        if (juggled[index].angle > 360)
            juggled[index].angle = 0;
        radians = juggled[index].angle * 3.14159 / 180;
        r = 75 * 150 / Math.sqrt((150 * Math.cos(radians)) * (150 * Math.cos(radians)) + (75 * Math.sin(radians)) * (75 * Math.sin(radians)));
        juggled[index].bitmap.x = r * Math.cos(radians) + clownPosition;
        juggled[index].bitmap.y = r * Math.sin(radians) + 165;
        juggled[index].bitmap.rotation = juggled[index].angle;

    }
}
function updateDifficulty(elapsedMS) {
    difficultyTime += elapsedMS;
    if (difficultyTime > difficultyCap) {
        difficultyTime = 0;
        difficulty++;
        addSign(difficulty - 2);
        laneSlowVelocity = laneSlowVelocityBase * difficulty / 3;
        laneMidVelocity = laneMidVelocityBase * difficulty / 3;
        laneMid2Velocity = laneMid2VelocityBase * difficulty / 3;
        laneFastVelocity = laneFastVelocityBase * difficulty / 3;
        obstacleSpawnCap = obstacleSpawnCapBase - difficulty * 500;
        if (difficulty == 4){
            roadAnimation.gotoAndPlay('regular');
            clownFeetAnimation.gotoAndPlay('regular');
        }
        if (difficulty == 7){
            roadAnimation.gotoAndPlay('fast');
            clownFeetAnimation.gotoAndPlay('fast');
        }
        if (difficulty > 10)
            gotoWin();
    }
}

var splashPage, instructionPage, creditsPage, gameOverPage, winPage;
var btnInstructions, btnCredits, btnStartGame, btnBack, btnRestart;
function preparePages() {
    var splashPageImage = preload.getResult('SplashPage');
    var instructionPageImage = preload.getResult('InstructionPage');
    var creditsPageImage = preload.getResult('CreditsPage');
    var gameOverPageImage = preload.getResult('GameOverPage');
    var winPageImage = preload.getResult('WinPage');
    splashPage = new createjs.Bitmap(splashPageImage);
    instructionPage = new createjs.Bitmap(instructionPageImage);
    instructionPage.visible = false;
    creditsPage = new createjs.Bitmap(creditsPageImage);
    creditsPage.visible = false;
    gameOverPage = new createjs.Bitmap(gameOverPageImage);
    gameOverPage.visible = false;
    winPage = new createjs.Bitmap(winPageImage);
    winPage.visible = false;

    var btnInstructionData = {
        images: ['images/btn-instructions.png'],
        frames: { width: 260, height: 35 },
        animations: {out:[0, 0], over:[1, 1], down: [2, 2]}
    };
    var btnInstructionSS = new createjs.SpriteSheet(btnInstructionData);
    btnInstructions = new createjs.BitmapAnimation(btnInstructionSS);
    btnInstructions.gotoAndStop('out');
    btnInstructions.x = 304;
    btnInstructions.y = 306;    

    var btnCreditsData = {
        images: ['images/btn-credits.png'],
        frames: { width: 151, height: 35},
        animations: {out:[0, 0], over:[1, 1], down: [2, 2]}
    };
    var btnCreditsSS = new createjs.SpriteSheet(btnCreditsData);
    btnCredits = new createjs.BitmapAnimation(btnCreditsSS);
    btnCredits.gotoAndStop('out');
    btnCredits.x = 414;
    btnCredits.y = 363

    var btnStartGameData = {
        images: ['images/btn-startgame.png'],
        frames: { width: 241, height: 35},
        animations: {out:[0, 0], over:[1, 1], down: [2, 2]}
    };
    var btnStartGameSS = new createjs.SpriteSheet(btnStartGameData);
    btnStartGame = new createjs.BitmapAnimation(btnStartGameSS);
    btnStartGame.gotoAndStop('out');
    btnStartGame.x = 324;
    btnStartGame.y = 249;

    var btnBackData = {
        images: ['images/btn-back.png'],
        frames: { width: 105, height: 35},
        animations: {out:[0, 0], over:[1, 1], down: [2, 2]}
    };
    var btnBackSS = new createjs.SpriteSheet(btnBackData);
    btnBack = new createjs.BitmapAnimation(btnBackSS);
    btnBack.gotoAndStop('out');
    btnBack.x = 459;
    btnBack.y = 363;
    btnBack.visible = false;

    var btnRestartData = {
        images: ['images/btn-restart.png'],
        frames: { width: 178, height: 35},
        animations: {out:[0, 0], over:[1, 1], down: [2, 2]}
    };
    var btnRestartSS = new createjs.SpriteSheet(btnRestartData);
    btnRestart = new createjs.BitmapAnimation(btnRestartSS);
    btnRestart.gotoAndStop('out');
    btnRestart.x = 396;
    btnRestart.y = 403;
    btnRestart.visible = false;
}

function gotoGame() {
    hideAllButtons();
    splashPage.visible = false;
    instructionPage.visible = false;
    creditsPage.visible = false;
    gameOverPage.visible = false;
    winPage.visible = false;

    resetGame();

    gameState = 'game';
}

function resetGame() {
    difficulty = 1;
    difficultyTime = 0;
    laneSlowVelocity = laneSlowVelocityBase;
    laneMidVelocity = laneMidVelocityBase;
    laneMid2Velocity = laneMid2VelocityBase;
    laneFastVelocity = laneFastVelocityBase;
    obstacleSpawnCap = obstacleSpawnCapBase;
    scoreGameOverText.visible = false;
    laneL1 = [];
    laneL2 = [];
    laneL3 = [];
    laneM = [];
    laneR1 = [];
    laneR2 = [];
    laneR3 = [];
    score = 0;
    health = 5;

    var index = 0;
    for (index = 0; index < animalBitmaps.length; ++index){
        animalBitmaps[index].visible = false;
    }
    for (index = 0; index < debrisBitmaps.length; ++index){
        debrisBitmaps[index].visible = false;
    }
    for (index = 0; index < vehicleBitmaps.length; ++index){
        vehicleBitmaps[index].visible = false;
    }
    for (index = 0; index < signBitmaps.length; ++index){
        signBitmaps[index].visible = false;
    }
    
    createjs.Tween.removeTweens(clownBodyBitmap);
    createjs.Tween.removeTweens(clownFeetAnimation);
    createjs.Tween.removeTweens(clownHandAnimation);
    clownBodyBitmap.alpha = 1;
    clownFeetAnimation.alpha = 1;
    clownHandAnimation.alpha = 1;

    clownPosition = 300;
    clownBodyBitmap.x = clownPosition - clownBodyBitmap.image.width / 2;
    clownFeetAnimation.x = clownPosition - 56;
    clownHandAnimation.x = clownPosition - 57;

    scoreText.text = 'Score: ' + score;
    scoreGameOverText.text = ' ' + score;

    healthAnimation.gotoAndStop('five');
}

function hideAllButtons() {
    btnInstructions.visible = false;
    btnCredits.visible = false;
    btnStartGame.visible = false;
    btnBack.visible = false;
    btnRestart.visible = false;
}

function gotoInstructions() {
    gameState = 'instructions';
    hideAllButtons();
    instructionPage.visible = true;
    splashPage.visible = false;
    creditsPage.visible = false;
    gameOverPage.visible = false;
    btnBack.visible = true;
    winPage.visible = false;
}
function gotoSplash() {
    gameState = 'splash';
    hideAllButtons();
    splashPage.visible = true;
    instructionPage.visble = false;
    creditsPage.visible = false;
    gameOverPage.visible = false;
    btnInstructions.visible = true;
    btnCredits.visible = true;
    btnStartGame.visible = true;
    scoreGameOverText.visible = false;
    winPage.visible = false;
}
function gotoCredits() {
    gameState = 'credits';
    hideAllButtons();
    creditsPage.visible = true;
    splashPage.visible = false;
    instructionPage.visible = false;
    gameOverPage.visible = false;
    btnBack.visible = true;
    winPage.visible = false;
}
function gotoGameOver() {
    gameState = 'gameOver';
    hideAllButtons();
    gameOverPage.visible = true;
    splashPage.visible = false;
    instructionPage.visible = false;
    creditsPage.visible = false;
    btnRestart.visible = true;
    scoreGameOverText.visible = true;
    winPage.visible = false;
}
function gotoWin() {
    gameState = 'win';
    hideAllButtons();
    btnRestart.visible = true;
    scoreGameOverText.visible = true;

    gameOverPage.visible = false;
    splashPage.visible = false;
    instructionPage.visible = false;
    creditsPage.visible = false;
    winPage.visible = true;
}

var scoreCap = 5000;
var scoreTime = 0;
function updateScore(elapsedMS) {
    scoreTime += elapsedMS;
    if (scoreTime > scoreCap) {
        score += 100 * (difficulty + 1);
        scoreTime = 0;
    }
    scoreText.text = 'Score: ' + score;
    scoreGameOverText.text = ' ' + score;
    
}

var healthAnimation;
function updateHealth() {
    if (health == 5)
        healthAnimation.gotoAndStop('five');
    else if (health == 4)
        healthAnimation.gotoAndStop('four');
    else if (health == 3)
        healthAnimation.gotoAndStop('three');
    else if (health == 2)
        healthAnimation.gotoAndStop('two');
    else if (health == 1)
        healthAnimation.gotoAndStop('one');
    else
        healthAnimation.gotoAndStop('zero');
}

function stageClicked(evt) {
    switch (gameState) {
        case 'splash':
            if (324 < evt.stageX && evt.stageX < 324 + 249 &&
                241 < evt.stageY && evt.stageY < 241 + 35) {
                var pong = createjs.Sound.createInstance("sound");
                pong.play();
                gotoGame();
            }
            if (304 < evt.stageX && evt.stageX < 304 + 260 &&
                306 < evt.stageY && evt.stageY < 306 + 35) {
                var pong = createjs.Sound.createInstance("sound");
                pong.play();
                gotoInstructions();
            }
            if (414 < evt.stageX && evt.stageX < 414 + 157 &&
                363 < evt.stageY && evt.stageY < 363 + 35) {
                var pong = createjs.Sound.createInstance("sound");
                pong.play();
                gotoCredits();
            }
            break;
        case 'instructions':
            if (459 < evt.stageX && evt.stageX < 459 + 105 &&
                363 < evt.stageY && evt.stageY < 363 + 35) {
                var pong = createjs.Sound.createInstance("sound");
                pong.play();
                gotoSplash();
            }
            break;
        case 'credits':
            if (459 < evt.stageX && evt.stageX < 459 + 105 &&
                363 < evt.stageY && evt.stageY < 363 + 35) {
                var pong = createjs.Sound.createInstance("sound");
                pong.play();
                gotoSplash();
            }
            break;
        case 'gameOver':
            if (396 < evt.stageX && evt.stageX < 396 + 157 &&
                403 < evt.stageY && evt.stageY < 403 + 35) {
                resetGame();
                var pong = createjs.Sound.createInstance("sound");
                pong.play();
                gotoSplash();
            }
            break;
        case 'win':
            if (396 < evt.stageX && evt.stageX < 396 + 157 &&
                403 < evt.stageY && evt.stageY < 403 + 35) {
                resetGame();
                var pong = createjs.Sound.createInstance("sound");
                pong.play();
                gotoSplash();
            }
            break;
    }

};

function stageMouseMove(evt) {
    var tempX = evt.stageX;
    if (tempX < clownLeftBound)
        tempX = clownLeftBound;
    if (tempX > clownRightBound)
        tempX = clownRightBound;
    targetClownPosition = tempX;

    // start game
    if (324 < evt.stageX && evt.stageX < 324 + 249 &&
        241 < evt.stageY && evt.stageY < 241 + 35){
        btnStartGame.gotoAndStop('over');
    } else {
        btnStartGame.gotoAndStop('out');
    }

    // instructions
    if (304 < evt.stageX && evt.stageX < 304 + 260 &&
        306 < evt.stageY && evt.stageY < 306 + 35){
        btnInstructions.gotoAndStop('over');
    } else {
        btnInstructions.gotoAndStop('out');
    }
    
    // credits
    if (414 < evt.stageX && evt.stageX < 414 + 157 &&
        363 < evt.stageY && evt.stageY < 363 + 35){
        btnCredits.gotoAndStop('over');
    } else {
        btnCredits.gotoAndStop('out');
    }
    // back
    if (459 < evt.stageX && evt.stageX < 459 + 105 &&
        363 < evt.stageY && evt.stageY < 363 + 35){
        btnBack.gotoAndStop('over');
    } else {
        btnBack.gotoAndStop('out');
    }
    // restart
    if (396 < evt.stageX && evt.stageX < 396 + 157 &&
        403 < evt.stageY && evt.stageY < 403 + 35){
        btnRestart.gotoAndStop('over');
    } else {
        btnRestart.gotoAndStop('out');
    }
};