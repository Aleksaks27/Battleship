import "./styles.css";
import Player from "./player";
import initialize from "./initialize";

const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");
const message = document.querySelector("#message");
const restart = document.querySelector("#restart");
// The ready variable makes sure that a user can't attack while the computer is "choosing"
// its next move
let ready = true;

const availableShips = [
    {name: "Carrier", length: 5},
    {name: "Battleship", length: 4},
    {name: "Destroyer", length: 3},
    {name: "Submarine", length: 3},
    {name: "Patrol Boat", length: 2},
]
const popup = document.querySelector("#popup");
const startingBoard = document.querySelector("#starting-board");
const randomise = document.querySelector("#randomise");
const begin = document.querySelector("#begin");
let introMessage = document.querySelector("#intro-message");
let gameMode = document.querySelector("#game-mode");
let orientation = document.querySelector("#orientation");
let index = 0;
let randomLayout = false;

popup.showModal();
// The user can choose their starting layout on the popup menu. Much like boardSetup() below, the
// position of a ship is only valid if it neither spills off the board nor crosses another ship.
// The user will cycle through the fleet's available ships, each accompanied by a different message.
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const square = document.createElement("div");
        startingBoard.appendChild(square);
        square.addEventListener("click", () => {
            if (index < 5) {
                if (orientation.textContent === "Horizontal") {
                    if (j + availableShips[index].length - 1 < 10) {
                        let k = availableShips[index].length - 1;
                        let start = Number(String(i) + String(j));
                        let valid = true;
                        for (let z = start; z <= start + k; z++) {
                            if (startingBoard.children[z].classList.contains("choice")) {
                                valid = false;
                            }
                        }
                        if (valid) {
                            while (k >= 0) {
                                startingBoard.children[start + k].classList.add("choice");
                                k--;
                            }
                            let ship = availableShips[index];
                            player.board.placeShip(ship.name, ship.length, [i, j],"Horizontal");
                            index++;
                            if (index < 5) introMessage.textContent = `Place your ${availableShips[index].name}`;
                        }
                    }
                }
                else {
                    if (i + availableShips[index].length - 1 < 10) {
                        let k = 10 * (availableShips[index].length - 1);
                        let start = Number(String(i) + String(j));
                        let valid = true;
                        for (let z = start; z <= start + k; z += 10) {
                            if (startingBoard.children[z].classList.contains("choice")) {
                                valid = false;
                            }
                        }
                        if (valid) {
                            while (k >= 0) {
                                startingBoard.children[start + k].classList.add("choice");
                                k -= 10;
                            }
                            let ship = availableShips[index];
                            player.board.placeShip(ship.name, ship.length, [i, j],"Verical");
                            index++;
                            if (index < 5) introMessage.textContent = `Place your ${availableShips[index].name}`;
                        }
                    }
                }
            }
        })
    }
}

gameMode.addEventListener("click", () => {
    if (gameMode.textContent === "Easy Mode") gameMode.textContent = "Hard Mode";
    else gameMode.textContent = "Easy Mode";
})

orientation.addEventListener("click", () => {
    if (orientation.textContent === "Horizontal") orientation.textContent = "Vertical";
    else orientation.textContent = "Horizontal";
})

randomise.addEventListener("click", () => {
    randomLayout = true;
    popup.close();
    initialize();
})

begin.addEventListener("click", () => {
    if (index === 5) {
        popup.close();
        initialize();
    }
})

restart.addEventListener("click", () => {
    location.reload();
})

// The HTML boards/grids are created below. For the player's board, event listeners are added to
// each unoccupied square for the user to play a round. These are only accessible while the game is
// in progress. CSS properties of squares change accordingly.
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const square = document.createElement("div");
        square.classList.add("water");
        square.id = `${i}` + `${j}` + "p";
        playerBoard.appendChild(square);
    }
}

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const square = document.createElement("div");
        square.classList.add("water");
        square.id = `${i}` + `${j}` + "c";
        computerBoard.appendChild(square);
        
        square.addEventListener("click", () => {
            if (!player.board.gameOver && !computer.board.gameOver && ready) {
                if (!square.classList.contains("hit") && !square.classList.contains("miss")) {
                    if (square.classList.contains("ship-hidden")) {
                        square.classList.add("hit");
                        square.classList.remove("ship-hidden");
                        playGame(player, computer, [i, j]);
                    }
                    else if (square.classList.contains("water")) {
                        square.classList.add("miss");
                        square.classList.remove("water");
                        playGame(player, computer, [i, j]);
                    }
                    ready = false;
                }
            }
        })
    }
}
// New player objects are created here.
let computer = new Player("computer");
let player = new Player("player");

// Each time the user clicks a square on the computer's board, both play one turn until a winner
// is crowned.
function playGame(player, computer, guess) {
    if (!player.board.gameOver && !computer.board.gameOver) {
        player.playTurn(guess, computer);
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        if (!computer.board.gameOver) {
            setTimeout(() => {
                if (gameMode.textContent === "Easy Mode") computer.playTurn([x, y], player);
                else computer.playTurnSmart(player);
                ready = true;
                if (player.board.gameOver) message.textContent = "Hard luck. The computer wins this round.";
            }, 800)
        }
    }
    if (computer.board.gameOver) message.textContent = "Congratulations. You win this round!";
}

export { 
    playerBoard,
    computerBoard,
    message,
    startingBoard,
    availableShips,
    randomLayout,
    computer,
    player,
}