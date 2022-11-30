// gameboard module
const Gameboard = (() => {
  let boardArray = [];
  const full = () => boardArray.length === 9 && allCellsFull(); 
  const clearBoard = () => boardArray.splice(0, boardArray.length);
  const markCell = () => (index, symbol) => (boardArray[index] = symbol);
  const symbolAt = () => (index) => boardArray[index];
  
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
}

// board display module
const BoardDisplay = (() => {


  return {};
})();

// game flow module
const Game = (() => {


  return {};
})();