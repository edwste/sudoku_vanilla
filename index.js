function Sudoku(params={}) {
    this.id = params.id || 'sudoku_container';
    this.n = params.n || 3;
    this.difficulty = params.difficulty || 0;    
    this.sudokuBlock = this.n * this.n;      
    this.totalCells = this.sudokuBlock * this.sudokuBlock;
    
    this.init();
    this.createBoard();
}

Sudoku.prototype.init = function() {
    this.generatePuzzle(); 
};

Sudoku.prototype.initBoard = function() {
    const board = new Array(this.sudokuBlock);
    let i,j;
    for (i=0; i<this.sudokuBlock; i++) {
        board[i] = new Array(this.sudokuBlock);
    }
    for (i=0; i<this.sudokuBlock; i++) {
        for (j=0; j<this.sudokuBlock; j++) {
            board[i][j]=0;
        }
    }
    return board;    
};

Sudoku.prototype.handleNew = function () {
    this.clearBoard();
    this.generatePuzzle();
}

Sudoku.prototype.handleSolve = function() {
    this.recursiveSolve();
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
    this.boardStart = this.initBoard();
    //generate puzzle into boardStart
    this.boardState = JSON.parse(JSON.stringify(this.boardStart));     //deep copy
}

Sudoku.prototype.recursiveSolve = function() {
    var i,empty;
    empty = this.findNextEmptySpot();
    if(empty[0]==-1)
        return true;
    for(i=1;i<this.sudokuBlock+1;i++){
        this.boardState[empty[0]][empty[1]]=i;
        var v =document.getElementById('cell'+empty[0]+empty[1]);
        v.textContent=i;
        if(this.isValidMove(i,empty[0],empty[1])){
            if(this.recursiveSolve())
                return true;
        } else {
            this.boardState[empty[0]][empty[1]]=0;
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
            if (this.boardState[i][j]==0){
                return [i,j];
            }
        }
    }
    return [-1,-1];
}

Sudoku.prototype.isValidMove = function(input,x,y) {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++){
        if(input==this.boardState[x][i] && i!=y)
            return false;
    }
    for(i=0;i<this.sudokuBlock;i++){
        if(input==this.boardState[i][y] && i!=x)
            return false;
    }

    boardX = Math.floor((x)/this.n)
    boardY = Math.floor((y)/this.n)
    for(i=0;i<this.n;i++){
        for(j=0;j<this.n;j++){
            if(input==this.boardState[boardX*this.n+i][boardY*this.n+j] && boardX*this.n+i != x && boardY*this.n+j != y)
                return false;
        }
    }
    return true;
}


Sudoku.prototype.createBoard = function() {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++)
    {
        for(j=0;j<this.sudokuBlock;j++)
        {
            var node = document.createElement('div');
            node.textContent = ''+i+j;
            node.id = 'cell'+i+j;
            node.classList.add("cell");
            document.getElementById("board").appendChild(node);
        }
    }
};

Sudoku.prototype.clearBoard = function() {
    let i,j;
    for(i=0;i<this.sudokuBlock;i++)
    {
        for(j=0;j<this.sudokuBlock;j++)
        {
            this.boardState[i][j]=0;
            this.boardStart[i][j]=0;
            var cell = document.getElementById('cell'+i+j);
            cell.textContent = ' ';
        }
    }
};

var game = new Sudoku();
game.handleNew();
