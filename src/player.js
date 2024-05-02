import Gameboard from "./gameboard";
import { availableShips, playerBoard, computerBoard } from "./game";

class Player {
    constructor(name) {
        this.name = name;
        this.board = new Gameboard;
    }
    // The function below chooses a ship's orientation randomly. After that, random coordinates
    // are chosen. However that position is only valid if it does not spill off the board or
    // overlap with another ship. The DOM is then updated accordingly.
    boardSetup() {
        for (let ship of availableShips) {
            let valid = false;
            let start = [];
            let orientation;
            if (Math.random() > 0.5) orientation = "Horizontal";
            else orientation = "Vertical";
            while (!valid) {
                start = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
                let i;
                if (orientation === "Horizontal") {
                    if ((start[1] + ship.length - 1) > 9) continue;
                    for (i = 0; i < ship.length; i++) {
                        if (this.board.board[start[0]][start[1] + i] === "S") break;
                    }
                }
                else {
                    if ((start[0] + ship.length - 1) > 9) continue;
                    for (i = 0; i < ship.length; i++) {
                        if (this.board.board[start[0] + i][start[1]] === "S") break;
                    }
                }
                if (i === ship.length) valid = true;
            }
            this.board.placeShip(ship.name, ship.length, start, orientation);
        }
        if (this.name === "player") {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (this.board.board[i][j] === "S") {
                        playerBoard.children[Number(String(i) + String(j))].classList.add("ship");
                    }
                }
            }
        }
        if (this.name === "computer") {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (this.board.board[i][j] === "S") {
                        computerBoard.children[Number(String(i) + String(j))].classList.add("ship-hidden");
                    }
                }
            }
        }
    }
    // When the computer plays a turn (with random coordinates), these will be rejected if already
    // occupied by a hit or miss. In that case playTurn() recursively invokes until it finds a free
    // spot.

    playTurn(coordinates, opponent) {
        const row = coordinates[0];
        const col = coordinates[1];
        if (opponent.board.board[row][col] === "H" || opponent.board.board[row][col] === "M") {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            return this.playTurn([x, y], opponent);
        }
        else {
            opponent.board.receiveAttack(coordinates);
            if (opponent.name === "player") {
                if (playerBoard.children[Number(String(row) + String(col))].classList.contains("ship")) {
                    playerBoard.children[Number(String(row) + String(col))].classList.add("hit");
                    playerBoard.children[Number(String(row) + String(col))].classList.remove("ship");
                }
                else if (playerBoard.children[Number(String(row) + String(col))].classList.contains("water")) {
                    playerBoard.children[Number(String(row) + String(col))].classList.add("miss");
                    playerBoard.children[Number(String(row) + String(col))].classList.remove("water");
                }
            }
            return;
        }
    }
}

export default Player;