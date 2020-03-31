function Sudoku(params={}) {
  this.id = params.id || 'sudoku_container';
  this.n = params.n || 3;
  this.difficulty = params.difficulty || 0;    
  this.sudokuBlock = this.n * this.n;      
  this.totalCells = this.sudokuBlock * this.sudokuBlock; 
  this.iterativeSolve = this.iterativeSolve.bind(this);
  this.init();
}

Sudoku.prototype.init = function() {
  this.createDOMBoard();
  this.handleNew(); 
};

/////////////
// handlers
Sudoku.prototype.handleNew = function () {
  this.solved = false;
  this.generatePuzzle();
}

Sudoku.prototype.handleSolve = function() {
  this.handleReset();    //only solves from a starting position
  this.solverState = this.solverStateFindingNextEmptySpot;
  while(!this.solved){
    this.iterativeSolve();
  }
}


Sudoku.prototype.handleReset = function() {
  this.solved = false;
  this.boardState = this.setBoard(this.boardStart);
  this.setDOMBoard(this.boardState);
}

Sudoku.prototype.handleDifficulty = function() {
  this.difficulty = (this.difficulty + 1) % 3;
  var difficultyLabels= ['easy','medium','hard'];
  document.getElementById("difficulty").textContent=difficultyLabels[this.difficulty];
  this.handleNew();
}

Sudoku.prototype.generatePuzzle = function() {
  this.boardStart = this.createAndClearBoard();
  this.boardState = this.createAndClearBoard();
  fetch("/puzzle")
    .then(response => response.json())
    .then((items) => {
  this.boardStart = this.setBoard(items);
  this.boardState = this.setBoard(items);
  this.setDOMBoard(this.boardState);
});  //TODO add error handling
}
//TODO add new and reset clearIntervals
Sudoku.prototype.iterativeSolve = function() {
  this.solverState();
}

Sudoku.prototype.solverStateFindingNextEmptySpot = function() {
  //find next empty spot and place a one in it
  //if one is valid next iteration is still findingNextEmptySpot
  //if not valid then goto incrementingLastNumber
  const [x,y] = this.findNextEmptySpot();
  this.boardState[x][y]=1;
  this.setDOMBoardElement(1,x,y);
  if(this.isValidMove(1,x,y)){
    if(this.findNextEmptySpot()[1]===this.sudokuBlock) {
      this.puzzleSolved();
    }
   //state stays the same for next iteration
  } else {
    this.solverState = this.solverStateIncrementingLastNumber;
  }
}

Sudoku.prototype.solverStateIncrementingLastNumber = function() {
  //increments last non starter value
  //if it hits number limit then clear the cell
  //which will cause a backtrack to previous cells
  const [a,b] = this.findNextEmptySpot();
  const [i,j] = this.findLastNonStartValue(a,b);
  if(this.boardState[i][j] === this.sudokuBlock) {
    //this will cause the previous valid cell to increment next round
    this.boardState[i][j]=' ';
    this.setDOMBoardElement(' ',i,j);
    return;
  }
  
  this.boardState[i][j]++;
  this.setDOMBoardElement(this.boardState[i][j],i,j);
  if(this.isValidMove(this.boardState[i][j],i,j)) {
    if(this.findNextEmptySpot()[1]===this.sudokuBlock) {
      this.puzzleSolved();
    }
    this.solverState=this.solverStateFindingNextEmptySpot;
  } // keep incrementing if move is invalid
}

Sudoku.prototype.puzzleSolved = function() {
  clearInterval(this.iterativeSolve);
  console.log('puzzle solved');
  this.solved=true;
  //add styling changes here
}


Sudoku.prototype.findLastNonStartValue = function(a,b) {
  //lots of edge cases here
  let i = a;
  let j = b;
  while(i>=0){
    j--;
    if(j===-1){
      j=this.sudokuBlock-1;
      i--;
    }
    if (this.boardStart[i][j]===' '){
      return [i,j];
    }
  }
  return;   //error
}

Sudoku.prototype.findNextEmptySpot = function() {
  for(let i=0;i<this.sudokuBlock;i++){
    for(let j=0;j<this.sudokuBlock;j++){
      if (this.boardState[i][j]===' '){
        return [i,j];
      }
    }
  }
  return [this.sudokuBlock-1,this.sudokuBlock];
}

Sudoku.prototype.isValidMove = function(input,x,y) {
  for(let i=0;i<this.sudokuBlock;i++){
    if(input===this.boardState[x][i] && i!=y)
      return false;
  }
  for(let i=0;i<this.sudokuBlock;i++){
    if(input===this.boardState[i][y] && i!=x)
      return false;
  }

  const boardX = Math.floor((x)/this.n);
  const boardY = Math.floor((y)/this.n);
  for(let i=0;i<this.n;i++){
    for(let j=0;j<this.n;j++){
      if(input===this.boardState[boardX*this.n+i][boardY*this.n+j] && boardX*this.n+i !== x && boardY*this.n+j !== y)
        return false;
      }
  }
  return true;
}

Sudoku.prototype.createAndClearBoard = function() {
  const board = new Array(this.sudokuBlock);
  for (let i=0; i<this.sudokuBlock; i++) {
    board[i] = new Array(this.sudokuBlock);
  }
  for (let i=0; i<this.sudokuBlock; i++) {
    for (let j=0; j<this.sudokuBlock; j++) {
      board[i][j]=' ';
    }
  }
  return board;    
};

Sudoku.prototype.setBoard = function(inputBoard) {
  return JSON.parse(JSON.stringify(inputBoard));                //deep copy
}

Sudoku.prototype.createDOMBoard = function() {
  for(let i=0;i<this.sudokuBlock;i++) {
    for(let j=0;j<this.sudokuBlock;j++) {
      var node = document.createElement('div');
      node.textContent = ' ';
      node.id = 'cell'+i+j;
      node.classList.add("cell");
      document.getElementById("board").appendChild(node);
    }
  }
};

Sudoku.prototype.clearDOMBoard = function() {
  for(let i=0;i<this.sudokuBlock;i++) {
    for(let j=0;j<this.sudokuBlock;j++) {
      var cell = document.getElementById('cell'+i+j);
      cell.textContent = ' ';
    }
  }
};

Sudoku.prototype.setDOMBoard = function(inputBoard) {
  for(let i=0;i<this.sudokuBlock;i++) {
    for(let j=0;j<this.sudokuBlock;j++) {
      const cell = document.getElementById('cell'+i+j);
      cell.textContent = inputBoard[i][j];
    }
  }
};

Sudoku.prototype.setDOMBoardElement = function(val,i,j) {
    const cell = document.getElementById('cell'+i+j);
    cell.textContent = val;
}

const game = new Sudoku();
