// gameboard module
const Gameboard = (() => {
  let boardArray = [];
  const full = () => boardArray.length === 9 && allCellsFull(); 
  const clearBoard = () => boardArray.splice(0, boardArray.length);
  const markCell = (index, symbol) => (boardArray[index] = symbol);
  const symbolAt = (index) => boardArray[index];
  
  function allCellsFull() {
    for (i=0; i <= 8; i++) {
      if (boardArray[i] === undefined) return false;
    }
    return true;
  }
  
  return { full, clearBoard, markCell, symbolAt };
})();

// player factory function
const Player = (playerName, symbol) => {
  return { playerName, symbol };
};

// set random() function on Array prototype
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

// board display module
const BoardDisplay = (() => {
  const infoDiv = document.querySelector('.info');

  const askInputNames = () => { infoDiv.textContent = 'Please input player names.'};
  const askClickNewGame = () => { infoDiv.textContent= 'Click New Game!'}
  const notifyTurn = (playerName) => { infoDiv.textContent = `${playerName}'s turn.` };
  const announceTie = () => { infoDiv.textContent = "Tied Game" };
  const resetInfoDiv = () => { infoDiv.classList.remove('win-text') };
  const announceWinner = (playerName) => {
    infoDiv.textContent = `${playerName} won!`;
    infoDiv.classList.add('win-text');
  };

  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.addEventListener('click', () => Game.playRound(cell))
  });
  const clearButtons = () => cells.forEach((cell) => (cell.textContent = ""));
  const enableCells = () => cells.forEach((cell) => (cell.disabled = false));
  const disableAllCells = () => cells.forEach((cell) => disableCell(cell));
  const changeCursor = () => cells.forEach((cell) => (cell.style.cursor = 'pointer'));
 
  function notifySymbols(p1Symbol, p2Symbol, p1Name, p2Name) {
    const symbolsDiv = document.querySelector('.symbols');
    symbolsDiv.textContent = `${p1Name} = ${p1Symbol}, ${p2Name} = ${p2Symbol}`;
  }

  function disableCell(cell) {
    cell.disabled = true;
    cell.style.cursor = 'auto';
  }

  return {
    notifyTurn,
    announceTie,
    resetInfoDiv,
    clearButtons,
    enableCells,
    disableAllCells,
    changeCursor,
    announceWinner,
    notifySymbols,
    disableCell,
    askInputNames,
    askClickNewGame
  };
})();

// game flow module
const Game = (() => {
  const player1 = Player('Player 1');
  const player2 = Player('Player 2');
  player1.symbol = ['X', 'O'].random();
  player2.symbol = (player1.symbol === 'X') ? 'O' : 'X';
  let currentPlayer;

  const playButton = document.querySelector('.play');
  playButton.style.display = 'none'

  // iife that runs once on page load to set player names
  const inputNames = (() => {
    const nameInputsContainer = document.querySelector('.hidden');
    const nameForm = document.querySelector('[name="player-form"]');
    BoardDisplay.askInputNames();
    nameInputsContainer.style.display = 'block';
    nameForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const player1Name = event.currentTarget.player1.value
      const player2Name = event.currentTarget.player2.value
  
      player1.playerName = player1Name
      player2.playerName = player2Name
  
      nameInputsContainer.style.display = 'none';
      BoardDisplay.askClickNewGame();
      playButton.style.display = 'block'
    })
  })();
  
  let playing = false;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function play() {
    playing = true;
    currentPlayer = [player1, player2].random();
    resetState();
    BoardDisplay.notifySymbols(player1.symbol, player2.symbol, player1.playerName, player2.playerName);
    BoardDisplay.notifyTurn(currentPlayer.playerName);
    BoardDisplay.changeCursor();
  };

  function resetState() {
    Gameboard.clearBoard();
    BoardDisplay.resetInfoDiv();
    BoardDisplay.clearButtons();
    BoardDisplay.enableCells();
  }

  function playRound(cell) {
    if (!playing) return;
    cell.textContent = currentPlayer.symbol;
    Gameboard.markCell(cell.id, cell.textContent);
    BoardDisplay.disableCell(cell);
    if (gameOver()) {
      BoardDisplay.disableAllCells();
      return;
    }
    currentPlayer = switchTurn();
    BoardDisplay.notifyTurn(currentPlayer.playerName)
  }

  const switchTurn = () => (currentPlayer === player1 ? player2 : player1);
  const gameWon = () => winningCombos.some((combo) => allSameSymbol(combo));

  function allSameSymbol(combo) {
    return combo.every((i) => Gameboard.symbolAt(i) === currentPlayer.symbol);
  }

  function gameOver() {
    if (gameWon()) {
      BoardDisplay.announceWinner(currentPlayer.playerName);
      return true;
    } else if (Gameboard.full()) {
      BoardDisplay.announceTie();
      return true;
    }
  }

  playButton.addEventListener('click', play);
  return { playRound };
})();