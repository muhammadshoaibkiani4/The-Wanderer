const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startMenu = document.getElementById("startMenu");
const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");

let playerName = "Player";

// ===== Player Setup =====
const player = {
    x: 80,
    y: 400,
    size: 32,
    color: "cyan",
    speed: 3
};

// ===== Rooms Setup =====
let currentRoom = "room1";

// Room objects with visuals
const rooms = {
    room1: {
        width: 800, height: 500,
        floorPattern: "#444",
        objects: [
            {x: 50, y: 350, w: 120, h: 60, type: "bed", color: "#a52a2a"},
            {x: 300, y: 350, w: 60, h: 40, type: "table", color: "#8b4513"},
            {x: 300, y: 310, w: 40, h: 40, type: "chair", color: "#654321"},
            {x: 700, y: 200, w: 40, h: 80, type: "door", target: "room2", color: "#654321"},
            {x: 400, y: 200, w: 32, h: 48, type: "npc", name: "Aster", color: "yellow"}
        ]
    },
    room2: {
        width: 800, height: 500,
        floorPattern: "#333",
        objects: [
            {x: 400, y: 200, w: 40, h: 40, type: "box", color: "#fff"},
            {x: 380, y: 250, w: 100, h: 50, type: "table", color: "#8b4513"},
            {x: 200, y: 300, w: 80, h: 40, type: "sofa", color: "#900"},
            {x: 500, y: 300, w: 120, h: 60, type: "tv", color: "#222"},
            {x: 50, y: 200, w: 40, h: 80, type: "door", target: "room1", color: "#654321"}
        ]
    }
};

// ===== Keyboard Input =====
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// ===== Dialogue System =====
let dialogueActive = false;
let dialogueQueue = [];
let dialogueIndex = 0;
let typingIndex = 0;
let typingSpeed = 30;
let currentText = "";

function startDialogue(dialogues) {
    dialogueActive = true;
    dialogueQueue = dialogues;
    dialogueIndex = 0;
    typingIndex = 0;
    currentText = "";
}

function typeWriter() {
    if(dialogueActive && typingIndex < dialogueQueue[dialogueIndex].text.length) {
        currentText += dialogueQueue[dialogueIndex].text[typingIndex];
        typingIndex++;
    }
}

// ===== Start Game =====
startButton.onclick = () => {
    playerName = playerNameInput.value || "Player";
    startMenu.style.display = "none";
    canvas.style.display = "block";
    gameLoop();
};

// ===== Update Function =====
function update() {
    if(!dialogueActive) {
        if(keys["w"]) player.y -= player.speed;
        if(keys["s"]) player.y += player.speed;
        if(keys["a"]) player.x -= player.speed;
        if(keys["d"]) player.x += player.speed;
    }

    // Interactions
    rooms[currentRoom].objects.forEach(obj => {
        if(obj.type === "npc" || obj.type === "box" || obj.type === "door") {
            if(Math.abs(player.x - obj.x) < 40 && Math.abs(player.y - obj.y) < 40) {
                if(keys["e"]) {
                    if(obj.type === "npc") {
                        startDialogue([
                            {name:"Aster", text:`Hey! you're awake`},
                            {name:playerName, text:`Yes wasn't I suppose to?`},
                            {name:"Aster", text:`No I mean it's Sunday you don't have anything to do do you?`},
                            {name:playerName, text:`Yea you're right but I feel something will happen today`},
                            {name:"Aster", text:`Yes it might I guess oh and someone delivered a package for you`},
                            {name:playerName, text:`A package for me? I did not order anything`},
                            {name:"Aster", text:`Well I don't know it was for you go check it out`},
                            {name:playerName, text:`Weird but ok I'll check it out then`}
                        ]);
                    }
                    if(obj.type === "box" && currentRoom === "room2") {
                        startDialogue([
                            {name:"Package", text:`For Mr. ${playerName}`},
                            {name:playerName, text:`It has my name but what's inside?`},
                            {name:playerName, text:`It's a page`},
                            {name:"Page", text:`I have a mouth but never speak, and a bed but never sleep. What am I?`},
                            {name:playerName, text:`What is this?`},
                            {name:playerName, text:`What even is this about?`}
                        ]);
                    }
                    if(obj.type === "door") {
                        currentRoom = obj.target;
                        if(currentRoom === "room1") { player.x=80; player.y=400; }
                        else { player.x=100; player.y=400; }
                    }
                }
            }
        }
    });

    if(dialogueActive) typeWriter();
}

// ===== Draw Function =====
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Draw floor pattern
    let size = 40;
    for(let i=0;i<canvas.width;i+=size){
        for(let j=0;j<canvas.height;j+=size){
            ctx.fillStyle = ((i/size + j/size)%2===0)?rooms[currentRoom].floorPattern:"#555";
            ctx.fillRect(i,j,size,size);
        }
    }

    // Draw Room Objects
    rooms[currentRoom].objects.forEach(obj => {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        if(obj.type === "npc") {
            ctx.fillStyle = "#fff";
            ctx.font = "16px Arial";
            ctx.fillText(obj.name, obj.x-10, obj.y-10);
        }
        if(obj.type === "tv") {
            ctx.fillStyle = "#000";
            ctx.fillRect(obj.x+5, obj.y+5, obj.w-10, obj.h-10);
        }
    });

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.fillStyle = "#00f";
    ctx.fillRect(player.x+8, player.y+4, 16, 8); // face detail

    // Draw Dialogue
    if(dialogueActive) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 400, canvas.width, 100);
        ctx.fillStyle = "#fff";
        ctx.font = "18px Arial";
        ctx.fillText(`${dialogueQueue[dialogueIndex].name}: ${currentText}`, 20, 430);
    }
}

// ===== Advance Dialogue =====
window.addEventListener("keydown", e => {
    if(e.key === " " && dialogueActive) {
        dialogueIndex++;
        typingIndex = 0;
        currentText = "";
        if(dialogueIndex >= dialogueQueue.length) dialogueActive = false;
    }
});

// ===== Game Loop =====
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
