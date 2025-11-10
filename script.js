const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startMenu = document.getElementById("startMenu");
const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");

let playerName = "Player";

// ===== Player Setup =====
const player = {
    x: 100,
    y: 400,
    size: 32,
    color: "cyan",
    speed: 3
};

// ===== Rooms Setup =====
let currentRoom = "room1";

// Room objects
const rooms = {
    room1: {
        objects: [
            {x: 300, y: 200, w: 64, h: 32, type: "bed", color: "#a52a2a"},
            {x: 500, y: 350, w: 64, h: 32, type: "table", color: "#8b4513"},
            {x: 700, y: 250, w: 32, h: 48, type: "door", target: "room2", color: "#654321"},
            {x: 400, y: 200, w: 32, h: 48, type: "npc", name: "Aster", color: "yellow"}
        ]
    },
    room2: {
        objects: [
            {x: 400, y: 200, w: 32, h: 32, type: "box", color: "#fff"},
            {x: 300, y: 300, w: 64, h: 32, type: "table", color: "#8b4513"}
        ]
    }
};

// ===== Keyboard Input =====
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// ===== Dialogue System =====
let dialogueActive = false;
let dialogueQueue = [];
let dialogueIndex = 0;
let typingIndex = 0;
let typingSpeed = 30;
let currentText = "";
let dialogueObject = null;

function startDialogue(dialogues) {
    dialogueActive = true;
    dialogueQueue = dialogues;
    dialogueIndex = 0;
    typingIndex = 0;
    currentText = "";
}

function typeWriter() {
    if(dialogueActive) {
        if(typingIndex < dialogueQueue[dialogueIndex].text.length) {
            currentText += dialogueQueue[dialogueIndex].text[typingIndex];
            typingIndex++;
        }
    }
}

// ===== Start Button =====
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
            if(Math.abs(player.x - obj.x) < 32 && Math.abs(player.y - obj.y) < 32) {
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
                        player.x = 100; player.y = 400;
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

    // Draw Room Objects
    rooms[currentRoom].objects.forEach(obj => {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    });

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

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
        if(dialogueIndex >= dialogueQueue.length) {
            dialogueActive = false;
        }
    }
});

// ===== Game Loop =====
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
