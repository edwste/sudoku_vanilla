// server.js
const express = require("express");
const app = express();
const util = require('util');
const exec = util.promisify(require('child_process').exec);



async function generateSudoku() {
  const { stdout, stderr } = await exec("./sugen generate");
  const sudokuParams=parseSudoku(stdout);
  
  return sudokuParams;
}

function parseSudoku(stdout){

  const stdoutArr = stdout.split('\n');
  const sudokuBoard = stdoutArr.slice(0,9);
  var boardArr = sudokuBoard.map(line => line.split('').filter(item=>item !== ' ').map(item=> {
  	if(item === '_'){
  		return ' ';
  	} else {
  		return Number(item);
  	}
  }));
  
  const difficultyLine = stdoutArr[10];
  difficultyLine.replace(/\s/g,'');
  const [first,difficultyStr] =  difficultyLine.split(':');
  const difficulty = Number(difficultyStr);
  return [boardArr,difficulty];
}

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/puzzle", async (request, response) => {
  try {
    const sudoku= await generateSudoku();
    response.json(sudoku[0]);
  } catch (err) {
    console.log(err);
    response.status(500);
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
