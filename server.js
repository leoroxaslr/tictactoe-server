const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//will add player account integration
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

io.on("connection", (socket) => {
  console.log("A user connected");

  // handle connection and init
  io.emit("gameState", { board, player, player1Name, player2Name, winner });

  socket.on("makeMove", (index) => {
    if (!board[index] && !winner) {
      const newBoard = board.slice();
      newBoard[index] = player;
      board = newBoard;
      player = player === "X" ? "O" : "X";
      checkWinner();

      // Send updated game state to all connected clients
      io.emit("gameState", { board, player, player1Name, player2Name, winner });
    }
  });

  socket.on("resetGame", () => {
    board = Array(9).fill(null);
    player = "X";
    winner = null;

    // Send updated game state to all connected clients
    io.emit("gameState", { board, player, player1Name, player2Name, winner });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
