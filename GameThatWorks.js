/*******************************************************/
// P5.play: t01_create_sprite
// Create a sprite
/// Written by ???
/*******************************************************/
	
/*******************************************************/
//setup()
/*******************************************************/
var PLAYER_VELOCITY = 5;
var NODE_SIZE = 25;
const TIMEOUT = 10;
var spawnChancePerFrame = 1;
const RANDOM_VALUE_MAX = 10000;
var score = 0;
var spawnChanceLock = true;
var collectedNodes = 0;
var gameState = 0;
var speedUpgradePrice = 2;
var nodeSizeUpgradePrice = 2;
var redNodes = 0;

function preload() {
    actionFail = loadSound("./action_fail.wav")
    gameOverSound = loadSound("./gameover.wav")
    gameOverSound2 = loadSound("./gameover2.wav")
    timeoutWarn = loadSound("./timeoutWarn.wav")
    overloadAlarm = loadSound("./overloadSiren.wav")
    powercoreTexture = loadImage("./powercore_texture.png")
    nodeTexture = loadImage("./node_texture.png")
}

// Didn't write this but I know how it works.
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function setup() {
	console.log("setup: initializing canvas");
	cnv = new Canvas(windowWidth, windowHeight);
	player = new Sprite(windowWidth/2,windowHeight/2,50,50,'d');
    upgradeButton1 = new Sprite(windowWidth/4,windowHeight/2,250,100,'s');
    upgradeButton2 = new Sprite(windowWidth-windowWidth/4,windowHeight/2,250,100,'s');
    playButton = new Sprite(windowWidth/2,windowHeight - windowHeight/4,250,100,'s');
    menuButton = new Sprite(windowWidth/2,windowHeight - windowHeight/3,250,100,'s');
    powerCore = new Sprite(windowWidth/2,windowHeight/2,200,200,'s');
    powercoreTexture.resize(200,200);
    powerCore.image = powercoreTexture;
	player.color = "black";
    upgradeButton1.color = "#00b3ff";
    upgradeButton1.textSize = 25
    upgradeButton1.text = "UPGRADE (+1)"
    upgradeButton2.color = "#00b3ff";
    upgradeButton2.textSize = 25
    upgradeButton2.text = "UPGRADE (+5)"
    playButton.color = "#ffa200";
    playButton.textSize = 50
    playButton.text = "GO"
    menuButton.color = "#ffa200";
    menuButton.textSize = 50
    menuButton.text = "MENU"
    allSprites.overlap(upgradeButton1)
    allSprites.overlap(upgradeButton2)
    allSprites.overlap(playButton)
    allSprites.overlap(menuButton)
    nodes = new Group()
    nodeLines = new Group()
    nodeLines.overlap(powerCore)
    nodeLines.overlap(nodes)
    nodeLines.overlap(nodeLines)
}
	
/*******************************************************/
//draw()
/*******************************************************/

function handleUpgradeScreen() {
    score = 0;
    textAlign(LEFT)
    textSize(25)
    fill("white")
    text("NODES: "+collectedNodes,windowWidth/15,windowHeight/15)
    textAlign(CENTER)
    textSize(25)
    fill("white")
    text("SPEED",upgradeButton1.x,upgradeButton1.y - 75)
    fill("white")
    text("NODE SIZE",upgradeButton2.x,upgradeButton2.y - 75)
    textSize(12.5)
    fill("white")
    text("CURRENT SPEED: "+PLAYER_VELOCITY,upgradeButton1.x,upgradeButton1.y + 75)
    fill("white")
    text("CURRENT NODE SIZE: "+NODE_SIZE,upgradeButton2.x,upgradeButton2.y + 75)
    if (upgradeButton1.mouse.pressed()) {
        if (collectedNodes >= speedUpgradePrice) {
            collectedNodes -= speedUpgradePrice;
            PLAYER_VELOCITY++;
            speedUpgradePrice += 2;
        } else {
            actionFail.play();
        }
    }
    if (upgradeButton2.mouse.pressed()) {
        if (collectedNodes >= nodeSizeUpgradePrice) {
            collectedNodes -= nodeSizeUpgradePrice;
            NODE_SIZE += 5;
            nodeSizeUpgradePrice += 2;
        } else {
            actionFail.play();
        }
    }
    if (playButton.mouse.pressed()) {
        gameState = 1;
    }
}

function reset() {
    powerCore.tint = "white";
    player.x = windowWidth / 2;
    player.y = windowHeight / 2;
    spawnChancePerFrame = 1;
    score = 0;
    spawnChanceLock = true;
}

async function lose() {
    background("lightblue")
    nodeLines.removeAll()
    collectedNodes = collectedNodes+score;
    player.vel.x = 0;
    player.vel.y = 0;
    player.rotationSpeed = 0;
    redNodes = 0;
    timeoutWarn.stop();
    background("black")
    player.colour = "white";
    nodes.colour = "white"
    powerCore.tint = "white";
    await sleep(500)
    overloadAlarm.play();
    powerCore.tint = "red";
    await sleep(500)
    powerCore.tint = "white";
    await sleep(500)
    powerCore.tint = "red";
    await sleep(500)
    powerCore.tint = "white";
    await sleep(500)
    powerCore.tint = "red";
    await sleep(500)
    powerCore.tint = "white";
    await sleep(500)
    powerCore.tint = "red";
    await sleep(500)
    overloadAlarm.stop();
    background("white")
    player.visible = false;
    powerCore.visible = false;
    nodes.removeAll()
    gameOverSound.play();
    gameOverSound2.play();
    await sleep(500)
    background("black")
    await sleep(1000)
    textAlign(CENTER)
    fill("white")
    textSize(100)
    text("Game Over", windowWidth/2,windowHeight/2-100);
    await sleep(500)
    textSize(50)
    text("Score: "+score, windowWidth/2,windowHeight/2+10);
    text("NODES: "+collectedNodes,windowWidth/15,windowHeight/15)
    await sleep(1000)
    menuButton.visible = true;
    gameState = 5;
}

async function loseInit() {
    gameState = 4;
    await lose()
}

function tryNodeSpawn() {
    if (random(0,RANDOM_VALUE_MAX) < (RANDOM_VALUE_MAX/100)*spawnChancePerFrame) {
        createNode();
    }
}
function createNode() {
    console.log("Node created")
    newNode = new Sprite(100,100,NODE_SIZE,NODE_SIZE);
    newNodeLine = new Sprite(100,100,1,1);
    newNode.x = random(50, windowWidth - 50);
    newNode.y = random(50, windowHeight - 50);
    newNodeLine.pos = newNode.pos;
    newNode.image = nodeTexture;
    newNode.image.resize(NODE_SIZE,NODE_SIZE);
    newNode.timeSpawned = 0;
    nodes.add(newNode);
    nodeLines.add(newNodeLine);
}

function checkNodeTimeout() {
    strokeWeight(10)
    for (i=0; i < nodes.length; i++) {
        nodes[i].timeSpawned = nodes[i].timeSpawned + 1;
        if (nodes[i].timeSpawned == (TIMEOUT*60)-(TIMEOUT*60)/4) {
            console.log("TIMEOUT WARN")
            redNodes++; 
        }
        if (nodes[i].timeSpawned >= (TIMEOUT*60)-(TIMEOUT*60)/4) {
            stroke("red")
        } else {
            stroke("black")
        }
        nodeLines[i].moveTowards(powerCore,0.002)
        line(nodes[i].x,nodes[i].y,nodeLines[i].x,nodeLines[i].y)
        if (nodes[i].timeSpawned >= TIMEOUT*60) {
            gameState = 3;
        }
    }
    strokeWeight(0)
}

function handlePlayerMovement() {
    if (kb.pressing("w")) {
        player.vel.y = PLAYER_VELOCITY*-1;
    }
    if (kb.pressing("s")) {
        player.vel.y = PLAYER_VELOCITY;
    }
    if (kb.pressing("a")) {
        player.vel.x = PLAYER_VELOCITY*-1;
    }
    if (kb.pressing("d")) {
        player.vel.x = PLAYER_VELOCITY;
    }
    if (kb.released("w")) {
        player.vel.y = 0;
    }
    if (kb.released("s")) {
        player.vel.y = 0;
    }
    if (kb.released("a")) {
        player.vel.x = 0;
    }
    if (kb.released("d")) {
        player.vel.x = 0;
    }
}

function updateScore() {
    fill("black")
    textAlign(CENTER)
    textSize(25)
    text("SCORE",windowWidth/2, 0 + windowHeight/10)
    textSize(50)
    text(score,windowWidth/2, 0 + windowHeight/10+50)
}

function draw() {
    if (gameState == 0) {
        background("black")
        upgradeButton1.visible = true;
        upgradeButton2.visible = true;
        playButton.visible = true;
        menuButton.visible = false;
        powerCore.visible = true;
        player.visible = false;
        handleUpgradeScreen()
    }
    if (gameState == 1) {
        upgradeButton1.visible = false;
        upgradeButton2.visible = false;
        playButton.visible = false;
        menuButton.visible = false;
        powerCore.visible = true;
        player.visible = true;
        player.colour = "black";
        background("lightblue");
        handlePlayerMovement()
        checkNodeTimeout()
        tryNodeSpawn()
        updateScore()
        if (score % 10 == 0 && !spawnChanceLock) {
            spawnChanceLock = true;
            spawnChancePerFrame += 0.5;
            console.log("SPAWN CHANCE INCREASED - NEW CHANCE: "+spawnChancePerFrame+"%")
        }
        nodes.overlap(player);
        nodes.overlapping(player, (node) => {console.log("Node collected"),node.remove(), /*nodeLines.findIndex(node).remove(), CAUSES AN ERROR*/ score++, spawnChanceLock = false; if (node.timeSpawned >= (TIMEOUT*60)-(TIMEOUT*60)/4) {redNodes--}})
        console.log(redNodes)
            if (redNodes > 0) {
                if (!timeoutWarn.isPlaying()) {
                    timeoutWarn.loop();
                }
            } else {
                timeoutWarn.stop();
            }
    }
	if (gameState == 3) {
        loseInit()
    }
    if (gameState == 5) {
        if (menuButton.mouse.pressed()) {
            window.gghEntryHandler.recordEntry("highscore",score);
            reset()
            gameState = 0;
        }
    }
}

/*******************************************************/
//  END OF APP
/*******************************************************/