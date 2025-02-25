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
var speedUpgradePrice = 10;
var nodeSizeUpgradePrice = 10;

function setup() {
	console.log("setup: initializing canvas");
	cnv = new Canvas(windowWidth, windowHeight);
	player = new Sprite(windowWidth/2,windowHeight/2,50,50,'d');
    upgradeButton1 = new Sprite(windowWidth/4,windowHeight/2,250,100,'d');
    upgradeButton2 = new Sprite(windowWidth-windowWidth/4,windowHeight/2,250,100,'d');
    playButton = new Sprite(windowWidth/2,windowHeight - windowHeight/4,250,100,'d');
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
    nodes = new Group()
}
	
/*******************************************************/
//draw()
/*******************************************************/

function handleUpgradeScreen() {
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
}
function tryNodeSpawn() {
    if (random(0,RANDOM_VALUE_MAX) < (RANDOM_VALUE_MAX/100)*spawnChancePerFrame) {
        createNode();
    }
}
function createNode() {
    console.log("Node created")
    newNode = new Sprite(100,100,NODE_SIZE,NODE_SIZE);
    newNode.x = random(50, windowWidth - 50);
    newNode.y = random(50, windowHeight - 50);
    newNode.timeSpawned = 0;
    nodes.add(newNode);
}

function checkNodeTimeout() {
    for (i=0; i < nodes.length; i++) {
        nodes[i].timeSpawned = nodes[i].timeSpawned + 1;
        if (nodes[i].timeSpawned >= (TIMEOUT*60)-(TIMEOUT*60)/5) {
            nodes[i].colour = "red";
        }
        if (nodes[i].timeSpawned >= TIMEOUT*60) {
            console.log("LOSE")
        }
    };
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
    textAlign(CENTER)
    textSize(25)
    text("SCORE",windowWidth/2, 0 + windowHeight/10)
    textSize(50)
    text(score,windowWidth/2, 0 + windowHeight/10+50)
}

function draw() {
    if (gameState == 0) {
        background("black")
        player.visible = false;
        handleUpgradeScreen()
    }
    if (gameState == 1) {
        player.visible = true;
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
        nodes.overlapping(player, (node) => {console.log("Node collected"),node.remove(), score++, spawnChanceLock = false;}) 
    }
	
}

/*******************************************************/
//  END OF APP
/*******************************************************/