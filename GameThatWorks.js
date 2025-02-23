/*******************************************************/
// P5.play: t01_create_sprite
// Create a sprite
/// Written by ???
/*******************************************************/
	
/*******************************************************/
//setup()
/*******************************************************/
const PLAYER_VELOCITY = 5;
const NODE_SIZE = 25;
const TIMEOUT = 2000;
var score = 0;

function setup() {
	console.log("setup: initializing canvas");
	cnv = new Canvas(windowWidth, windowHeight);
	player = new Sprite(windowWidth/2,windowHeight/2,50,50,'d');
	player.color = "black";
    nodes = new Group()
}
	
/*******************************************************/
//draw()
/*******************************************************/
function createNode() {
    console.log("Node created")
    newNode = new Sprite(100,100,NODE_SIZE,NODE_SIZE);
    newNode.x = random(50, windowWidth - 50);
    newNode.y = random(50, windowHeight - 50);
    newNode.spawnTime = 0;
    nodes.add(newNode);
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

function draw() {
	background("lightblue");
    handlePlayerMovement()
    nodes.overlap(player);
    nodes.overlapping(player, (node) => {console.log("Node collected"),node.remove(), score++;})
}

/*******************************************************/
//  END OF APP
/*******************************************************/