$(function () {
    initializeGame();
});

var canvas, stage, preload;
var backgroundImage;
var backgroundBitmap;
var ping;

function initializeGame() {
    canvas = document.getElementById('main-canvas');
    canvas.width = 600;
    canvas.height = 480;
    stage = new createjs.Stage(canvas);
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);

    var manifest = [
        { id: 'backgroundImage', src:'images/cornflowerblue.bmp' }
    ];

    preload.addEventListener('complete', prepareAssets);
    preload.loadFile({id: "sound", src: "sounds/ping.wav"});
    preload.loadManifest(manifest);
};

function prepareAssets() {
    // images
    backgroundImage = preload.getResult('backgroundImage');
    backgroundBitmap = new createjs.Bitmap(backgroundImage);
    stage.addChild(backgroundBitmap);

    // animations
    //var data = {
    //    images: [runningImage],
    //    frames: { width: 71, height: 66, count: 18 },
    //    animations: { run: [0, 17, "run", 16] }
    //};
    //var spriteSheet = new createjs.SpriteSheet(data);
    //animation = new createjs.BitmapAnimation(spriteSheet);


    stage.addEventListener("click", stageClicked);

    startGame();
};

function handleComplete() {
    ping.stop();
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

function update() {
};

function stageClicked(evt) {
    var pong = createjs.Sound.createInstance("sound");
    pong.play();
};