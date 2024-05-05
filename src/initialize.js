import { playerBoard, startingBoard, randomLayout, computer, player } from './game';

// If the user has chosen a random layout, the board and fleet are first erased to ensure no 
// repetition. Otherwise, the layout chosen at the beginning is applied to the player's board.
function initialize() {
    computer.boardSetup();
    if (randomLayout) {
        player.board.fleet = [];
        player.board.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        player.boardSetup();
    }
    else {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (startingBoard.children[Number(String(i) + String(j))].classList.contains("choice")) {
                    player.board.board[i][j] = "S";
                    playerBoard.children[Number(String(i) + String(j))].classList.add("ship");
                }
                else {
                    player.board.board[i][j] = 0;
                    playerBoard.children[Number(String(i) + String(j))].classList.add("water");
                }
            }
        }
    }
}

export default initialize;