const p1 = createPlayer('Player 1');
const p2 = createPlayer('Player 2');

const gameBoard = (function() {
    let gameBoardArray = ['', '', '', '', '', '', '', '', ''];

    function getGameBoardArray() {
        return gameBoardArray;
    }

    function resetGameBoardArray() {
        gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    }

    function isSlotFull(location) {
        if (gameBoardArray[location] != '') return true;
        else return false;
    }

    function addPiece(player, location) {
        if(isSlotFull(location)) return;
        gameBoardArray[location] = player.getSymbol();
        displayer.render();
        game.isGameOver(player);
    }

    return { getGameBoardArray, addPiece, resetGameBoardArray };
})();


const displayer = (function() {
    const slots = Array.from(document.querySelectorAll('.grid div'));
    const sound = document.querySelector('#sound');
    const result = document.querySelector('.result');
    const playAgain = document.querySelector('button');

    for (let i = 0; i < slots.length; i++) {
        slots[i].setAttribute('class', 'slots');
        slots[i].setAttribute('data-slot', i.toString());
        slots[i].addEventListener('click', click);
    }

    function click(e) {
        if (game.whosTurn() == 'Player 1') gameBoard.addPiece(p1, e.target.dataset.slot);
        else if (game.whosTurn() == 'Player 2') gameBoard.addPiece(p2, e.target.dataset.slot);
    }

    function render() {
        sound.play();
        let gameBoardArray = gameBoard.getGameBoardArray();
        for (let i = 0; i < slots.length; i++) {
            slots[i].textContent = gameBoardArray[i];
        }
    }

    function displayResult(player) {
        setTimeout(() => {
            if (player == undefined) {
                result.textContent = `It's a TIE! Player 1: ${p1.getScore()} | Player 2: ${p2.getScore()}`;
            }
            else {
                result.textContent = `${player.getName()} Wins!!! Player 1: ${p1.getScore()} | Player 2: ${p2.getScore()}`;
                for (let i = 0; i < slots.length; i++) {
                    if (game.getWinningCombo().includes(i)) slots[i].setAttribute('style', 'background-color: green');
                }
            }
    
            playAgain.setAttribute('style', 'visibility: visible');
        }, 1000);
    }

    function clearBoard() {
        for (let i = 0; i < slots.length; i++) {
            slots[i].textContent = '';
        }
        result.textContent = '';
        for (let i = 0; i < slots.length; i++) {
            slots[i].setAttribute('style', 'background-color: gold');
        }
    }

    playAgain.addEventListener('click', e => {
        playAgain.setAttribute('style','visibility: hidden');
        clearBoard();
        game.resetGame();
    })

    return { render, displayResult };
})();


const game = (function() {
    let turn = 'Player 1';
    let winningCombo;

    p1.setSymbol('x');
    p2.setSymbol('o');


    function switchTurn() {
        if (turn == 'Player 1') turn = 'Player 2';
        else if (turn == 'Player 2') turn = 'Player 1';
    }

    function checkIfPlayerWon(player) {
        let array = gameBoard.getGameBoardArray();
        let symbol = player.getSymbol();
        if (array[0] == symbol && array[1] == symbol && array[2] == symbol) {
            winningCombo = [0,1,2];
            return true;
        }
        if (array[2] == symbol && array[5] == symbol && array[8] == symbol) {
            winningCombo = [2,5,8]
            return true;
        }
        if (array[6] == symbol && array[7] == symbol && array[8] == symbol) {
            winningCombo = [6,7,8];
            return true;
        }
        if (array[0] == symbol && array[3] == symbol && array[6] == symbol) {
            winningCombo = [0,3,6];
            return true;
        }
        if (array[0] == symbol && array[4] == symbol && array[8] == symbol) {
            winningCombo = [0,4,8];
            return true;
        }
        if (array[2] == symbol && array[4] == symbol && array[6] == symbol) {
            winningCombo = [2,4,6];
            return true;
        }
        if (array[3] == symbol && array[4] == symbol && array[5] == symbol) {
            winningCombo = [3,4,5];
            return true;
        }
        if (array[1] == symbol && array[4] == symbol && array[7] == symbol) {
            winningCombo = [1,4,7];
            return true;
        }
    }

    function checkIfTie() {
        for (let i = 0; i <= 8; i++) {
            if (gameBoard.getGameBoardArray()[i] == '') {
                return false;
            }
        }
        return true;
    }

    function announceWinner(player) {
        if (player == undefined) {
            displayer.displayResult(undefined);
        }
        else {
            player.incrementScore();
            displayer.displayResult(player);
        }
    }

    function resetGame() {
        gameBoard.resetGameBoardArray();
        turn = 'Player 1';
    }

    function isGameOver(lastPlayer) {
        if (checkIfPlayerWon(lastPlayer) == true) {
            announceWinner(lastPlayer);
        }
        else if (checkIfTie() == true) {
            announceWinner();
        }

        // if game not over, give the turn to the other player
        switchTurn();
    }

    function whosTurn() {
        return turn;
    }

    function getWinningCombo() {
        return winningCombo;
    }

    return { isGameOver , whosTurn, getWinningCombo, resetGame };
})();


function createPlayer(name) {
    let playerName = name;
    let symbol;
    let score = 0;

    function getName() {
        return playerName;
    }
    
    function getSymbol() {
        return symbol;
    }

    function setSymbol(sign) {
        symbol = sign;
    }

    function getScore() {
        return score;
    }

    function incrementScore() {
        score++;
    }

    return { getName, getSymbol, setSymbol, getScore, incrementScore };
}









