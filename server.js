// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const { exec } = require("child_process");
const express = require("express");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

exec("./sugen generate", (error, stdout,stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    parseSudoku(stdout);
});

function parseSudoku(stdout){

  const stdoutArr = stdout.split('\n');
  const sudokuBoard = stdoutArr.slice(0,9);
  var boardArr = sudokuBoard.map(line => line.split('').filter(item=>item !== ' ').map(item=> {
  	if(item === '_'){
  		return 0;
  	} else {
  		return Number(item);
  	}
  }));
  
  const difficultyLine = stdoutArr[10];
  difficultyLine.replace(/\s/g,'');
  const [first,difficultyStr] =  difficultyLine.split(':');

  const difficulty = Number(difficultyStr);
  console.log(sudokuBoard);
  console.log(boardArr);
  console.log(difficulty);
}

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
