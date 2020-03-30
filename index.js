function Sudoku(params={}) {
    this.id = params.id || 'sudoku_container';
    this.n = params.n || 3;
    this.difficulty = params.difficulty || 0;    
    this.sudokuBlock = this.n * this.n;      
    this.totalCells = this.sudokuBlock * this.sudokuBlock;
    
    this.init();
}

Sudoku.prototype.init = function() {
    this.createDOMBoard();
    this.handleNew(); 
};

Sudoku.prototype.handleNew = function () {
    this.generatePuzzle();
}

Sudoku.prototype.handleSolve = function() {
    //this.recursiveSolve();      currently bugging out
}

Sudoku.prototype.handleReset = function() {

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
    //generate puzzle into boardStart
    fetch("/puzzle")
      .then(response => response.json()) // parse the JSON from the server
      .then((items) => {
    this.boardStart = this.setBoard(items);
    this.boardState = this.setBoard(items);
    this.setDOMBoard(this.boardState);
  });
}

Sudoku.prototype.recursiveSolve = function() {
    var i,empty;
    const [x,y] = this.findNextEmptySpot();    //refactor into two items
    if(x===-1)    
        return true;
    for(i=1;i<this.sudokuBlock+1;i++){
        this.boardState[x][y]=i;
        this.setDOMBoardElement(i,x,y);
        if(this.isValidMove(i,x,y)){
            if(this.recursiveSolve())
                return true;
        } else {
            this.boardState[x][y]=' ';
            this.setDOMBoardElement(' ',x,y);
        }

    }
    return false;
}

Sudoku.prototype.findNextEmptySpot = function() {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++)
    {
        for(j=0;j<this.sudokuBlock;j++)
        {
            if (this.boardState[i][j]===' '){
                return [i,j];
            }
        }
    }
    return [-1,-1];
}

Sudoku.prototype.isValidMove = function(input,x,y) {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++){
        if(input===this.boardState[x][i] && i!=y)
            return false;
    }
    for(i=0;i<this.sudokuBlock;i++){
        if(input===this.boardState[i][y] && i!=x)
            return false;
    }

    const boardX = Math.floor((x)/this.n);
    const boardY = Math.floor((y)/this.n);
    for(i=0;i<this.n;i++){
        for(j=0;j<this.n;j++){
            if(input===this.boardState[boardX*this.n+i][boardY*this.n+j] && boardX*this.n+i !== x && boardY*this.n+j !== y)
                return false;
        }
    }
    return true;
}

Sudoku.prototype.createAndClearBoard = function() {
    const board = new Array(this.sudokuBlock);
    let i,j;
    for (i=0; i<this.sudokuBlock; i++) {
        board[i] = new Array(this.sudokuBlock);
    }
    for (i=0; i<this.sudokuBlock; i++) {
        for (j=0; j<this.sudokuBlock; j++) {
            board[i][j]=' ';
        }
    }
    return board;    
};

Sudoku.prototype.setBoard = function(inputBoard) {
  return JSON.parse(JSON.stringify(inputBoard));                //deep copy
}

Sudoku.prototype.createDOMBoard = function() {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++)
    {
        for(j=0;j<this.sudokuBlock;j++)
        {
            var node = document.createElement('div');
            node.textContent = ' ';
            node.id = 'cell'+i+j;
            node.classList.add("cell");
            document.getElementById("board").appendChild(node);
        }
    }
};

Sudoku.prototype.clearDOMBoard = function() {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++)
    {
        for(j=0;j<this.sudokuBlock;j++)
        {
            var cell = document.getElementById('cell'+i+j);
            cell.textContent = ' ';
        }
    }
};

Sudoku.prototype.setDOMBoard = function(inputBoard) {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++)
    {
        for(j=0;j<this.sudokuBlock;j++)
        {
            const cell = document.getElementById('cell'+i+j);
            cell.textContent = inputBoard[i][j];
        }
    }
};

Sudoku.prototype.setDOMBoardElement = function(val,i,j) {
    const cell = document.getElementById('cell'+i+j);
    cell.textContent = val;
}
var game = new Sudoku();
