const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let board = Array(9).fill(null);
let player = "X";
let player1Name = "Player 1";
let player2Name = "Player 2";
let winner = null;

const checkWinner = () => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      return;
    }
  }

  if (!board.includes(null)) {
    winner = "Draw";
  }
};

app.post("/make-move", (req, res) => {
  const { index } = req.body;

  if (!board[index] && !winner) {
    const newBoard = board.slice();
    newBoard[index] = player;
    board = newBoard;
    player = player === "X" ? "O" : "X";
    checkWinner();
  }

  res.json({ board, winner });
});

app.post("/reset-game", (req, res) => {
  board = Array(9).fill(null);
  player = "X";
  winner = null;

  res.json({ board, winner });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
