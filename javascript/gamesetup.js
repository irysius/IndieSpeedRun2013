$(function () {
    initializeGame();
});

var canvas, stage, preload;

function initializeGame() {
    alert('something');
    canvas = document.getElementById('main-canvas');
    canvas.width = 0;
    canvas.height = 0;
    stage = new createjs.Stage(canvas);
    preload = new createjs.LoadQueue(true);

    var manifest = [

    ];

    preload.addEventListener('complete', prepareAssets);
    preload.loadManifest(manifest);
};

function prepareAssets() {
    //paddle1Image = preload.getResult("paddle1Image");
    //paddle1Bitmap = new createjs.Bitmap(paddle1Image);
    //stage.addChild(ballBitmap);

    //var data = {
    //    images: [runningImage],
    //    frames: { width: 71, height: 66, count: 18 },
    //    animations: { run: [0, 17, "run", 16] }
    //};
    //var spriteSheet = new createjs.SpriteSheet(data);
    //animation = new createjs.BitmapAnimation(spriteSheet);

    startGame();
};

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