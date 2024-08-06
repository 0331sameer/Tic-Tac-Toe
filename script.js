document.addEventListener('DOMContentLoaded', function() {
    const newGameBtn = document.getElementById('newgame-btn');
    const continueDifficultyBtn = document.getElementById('continue-difficulty');
    const continueGameBtn = document.getElementById('continue-game');
    const gameboard = document.getElementById('game-board');
    const turnplayer = document.getElementById('player-turn');
    const outcome = document.getElementById('outcome');
    
    const playagainBtn = document.getElementById('play-again-btn');
    const newgameBtn = document.getElementById('new-game-btn');
    
    const gamesplayedcounter = document.getElementById('games-played-counter');
    const player1wincounter = document.getElementById('player1-wins-counter')
    const player2wincounter = document.getElementById('player2-wins-counter')
    

    let selectedOpponent = '';
    let selectedDifficulty = '';
    
    gameboardarray = [];
    let playerturn = 0;
    let aiEnabled = false;

    let player1Score = 0;
    let player2Score = 0;
    let gamesplayed = 0;

    newGameBtn.addEventListener('click', function() {
        selectedOpponent = '';
        selectedDifficulty = '';
        playerturn = 0;
        player1Score = 0;
        player2Score = 0;
        gamesplayed = 0;
        gamesplayedcounter.innerHTML = 0;
        player1wincounter.innerHTML = 0;
        player2wincounter.innerHTML = 0;
        gameboard.innerHTML = '';
        aiEnabled = false;
        resetAllInputs();
        togglePopup('opponent-popup', true);
    });

    continueDifficultyBtn.addEventListener('click', function() {
        if (selectedOpponent == 'hvc') {
            aiEnabled = true;
            togglePopup('difficulty-popup', true);
        }
        else if(selectedOpponent == 'hvh') {
            togglePopup('opponent-popup', false);
            createGameboard();
        }
        else {
            alert('You must select an opponent first.');
        }
        
    });

    continueGameBtn.addEventListener('click', function() {
        if ( selectedDifficulty != '') {
            startGame();
            
        } else {
            alert('Please select difficulty.');
        }
    });

    function togglePopup(popupId, isActive) {
        const popup = document.getElementById(popupId);
        if (isActive) {
            popup.classList.add('active');
        } else {
            popup.classList.remove('active');
        }
    }

    const opponentRadios = document.querySelectorAll('input[name="opponent"]');
    opponentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedOpponent = this.value;
        });
    });

    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectedDifficulty = this.value;
        });
    });

    function startGame() {        
        togglePopup('opponent-popup', false);
        togglePopup('difficulty-popup', false);
        createGameboard();
    }

    function createGameboard() {
        gameboard.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            gameboardarray[i] = [];
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                gameboard.appendChild(cell);
                gameboardarray[i][j] = '';
                cell.addEventListener('click', handleCellClick);
            }
        }
        const turnplayer = document.getElementById('player-turn');
        turnplayer.innerHTML = `${playerturn + 1}`;
        togglePopup('turn-popup',true);
        setTimeout(function() {
            togglePopup('turn-popup',false);
        }, 500);
        if (aiEnabled && playerturn === 1) {
            setTimeout(() => {
                turnplayer.inertHTML = '1';
                aiMove();
                // Check win condition immediately after AI moves
                checkwinner(checkWinCondition());
            }, 500);
            playerturn = 0;
        }
    }

    function handleCellClick(event) {
        const cell = event.target;
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');
        console.log(playerturn);
        if (gameboardarray[row][col] === '') {    
            if (playerturn === 0) {
                addTile('X', row, col);
                turnplayer.innerHTML = '2';
                if(checkwinner(checkWinCondition())){
                    return;
                }
                if (aiEnabled) {
                    setTimeout(aiMove, 500);
                    turnplayer.innerHTML = '1';
                }
            } else if (playerturn === 1) {
                addTile('O', row, col);
                turnplayer.innerHTML = '1';
                if(checkwinner(checkWinCondition())){
                    return;
                }
            }
        } else {
            alert('Already Selected');
        }
    }
    

    function addTile(value, xpos, ypos) {
        const existingTile = gameboard.querySelector(`.grid-cell[data-row="${xpos}"][data-col="${ypos}"]`);
        existingTile.innerHTML = value === 'X' ? '<p>X</p>' : value === 'O' ? '<p>O</p>' : '';
        gameboardarray[xpos][ypos] = value;
    }

    function checkwinner(winner) {
        if (winner === 'X') {
            outcome.innerHTML = 'Player 1 won';
            togglePopup('outcome-popup', true);
            player1Score++;
            player1wincounter.innerHTML = player1Score;
            gamesplayed++;
            gamesplayedcounter.innerHTML = gamesplayed;
            playerturn = 0
            return true;
        } else if (winner === 'O') {
            outcome.innerHTML = 'Player 2 won';
            togglePopup('outcome-popup', true);
            player2Score++;
            player2wincounter.innerHTML = player2Score;
            gamesplayed++;
            gamesplayedcounter.innerHTML = gamesplayed;
            playerturn = 1
            return true;
        } else if (winner === 'd') {
            playerturn = (playerturn + 1) % 2;
            outcome.innerHTML = 'Game is a draw';
            togglePopup('outcome-popup', true);
            gamesplayed++;
            gamesplayedcounter.innerHTML = gamesplayed;
            return true;
        } else if (winner === 'n') {
            playerturn = (playerturn + 1) % 2;
            togglePopup('turn-popup', true);
            setTimeout(function () {
                togglePopup('turn-popup', false);
            }, 500);
            return false;
        }
    }
    
    function checkWinCondition() {
        for (let i = 0; i < 3; i++) {
            if (gameboardarray[i][0] === gameboardarray[i][1] && gameboardarray[i][1] === gameboardarray[i][2] && gameboardarray[i][0]!== '') {
                return gameboardarray[i][0];
            }
        }
        
        for (let i = 0; i < 3; i++) {
            if (gameboardarray[0][i] === gameboardarray[1][i] && gameboardarray[1][i] === gameboardarray[2][i] && gameboardarray[0][i]!== '') {
                return gameboardarray[0][i];
            }
        }
        
        if (gameboardarray[0][0] === gameboardarray[1][1] && gameboardarray[1][1] === gameboardarray[2][2] && gameboardarray[0][0]!== '') {
            return gameboardarray[0][0];
        }
        
        if (gameboardarray[0][2] === gameboardarray[1][1] && gameboardarray[1][1] === gameboardarray[2][0] && gameboardarray[0][2]!== '') {
            return gameboardarray[0][2];
        }
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameboardarray[i][j] === '') {
                    return 'n';
                }
            }
        }
        
        return 'd';
    }

    playagainBtn.addEventListener('click', function() {
        togglePopup('outcome-popup', false);
        createGameboard();
    });

    newgameBtn.addEventListener('click', function() {
        togglePopup('outcome-popup', false);
        selectedOpponent = '';
        selectedDifficulty = '';
        playerturn = 0;
        player1Score = 0;
        player2Score = 0;
        gamesplayed = 0;
        gamesplayedcounter.innerHTML = 0;
        player1wincounter.innerHTML = 0;
        player2wincounter.innerHTML = 0;
        gameboard.innerHTML = '';
        aiEnabled = false;
        resetAllInputs();
        togglePopup('opponent-popup', true);
    });

    function resetAllInputs() {
        const allInputs = document.querySelectorAll('input[type=radio], input[type=checkbox], select');
    
        allInputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });
    }

    function aiMove() {
        switch (selectedDifficulty) {
            case 'easy':
                makeRandomMove();
                break;
            case 'medium':
                makeStrategicMove();
                break;
            case 'hard':
                makeOptimalMove();
                break;
        }
        checkwinner(checkWinCondition());
    }

    // Make a random move for Easy AI
    function makeRandomMove() {
        let emptyCells = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (gameboardarray[i][j] === '') {
              emptyCells.push({ row: i, col: j });
            }
          }
        }
      
        if (emptyCells.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          const { row, col } = emptyCells[randomIndex];
          addTile('O', row, col);
        }
    }
      

    // Make a strategic move for Medium AI (Block if needed)
    function makeStrategicMove() {
        // Check for blocking the player
        if (!attemptWinOrBlock('O')) {
            // Attempt to block the player
            if (!attemptWinOrBlock('X')) {
                makeRandomMove();
            }
        }
    }

    // Make an optimal move for Hard AI (MiniMax)
    function makeOptimalMove() {
        let bestScore = -Infinity;
        let move = null;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameboardarray[i][j] === '') {
                    gameboardarray[i][j] = 'O';
                    let score = minimax(gameboardarray, 0, false);
                    gameboardarray[i][j] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        move = { row: i, col: j };
                    }
                }
            }
        }

        if (move !== null) {
            addTile('O', move.row, move.col);
        }
    }

    // Minimax algorithm for decision making
    function minimax(board, depth, isMaximizing) {
        const scores = {
            'X': -1,
            'O': 1,
            'd': 0
        };

        const result = checkWinCondition();
        if (result !== 'n') {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === '') {
                        board[i][j] = 'O';
                        let score = minimax(board, depth + 1, false);
                        board[i][j] = '';
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === '') {
                        board[i][j] = 'X';
                        let score = minimax(board, depth + 1, true);
                        board[i][j] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    // Attempt to win or block the opponent
    function attemptWinOrBlock(player) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameboardarray[i][j] === '') {
                    gameboardarray[i][j] = player;
                    if (checkWinCondition() === player) {
                        addTile('O', i, j);
                        return true;
                    }
                    gameboardarray[i][j] = '';
                }
            }
        }
        return false;
    }


    togglePopup('opponent-popup', true);
});
