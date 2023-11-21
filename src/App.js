import { useState,useEffect } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  useEffect(() => {
    if (!xIsNext) {
      const timer = setTimeout(() => {
        const bestMove = findBestMove(squares);
        const nextSquares = squares.slice();
        nextSquares[bestMove] = 'O';
        setSquares(nextSquares);
        setXIsNext(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, squares]);

  function handleClick(i) {
    if (!xIsNext || squares[i] || calculatewinner(squares) || isBoardFull(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
    setXIsNext(false);
  }

  function reset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const winner = calculatewinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isBoardFull(squares)) {
    status = "It's a draw!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className='main'>
        <div className='status'>{status}</div>
        <div className='board-row'>
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className='board-row'>
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className='board-row'>
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
        <div>
          <button className='reset' onClick={reset}>
            Reset
          </button>
        </div>
        <div className='footer'>
          Made with ❤️ by <a href="http://ragesh.me" target="_blank" rel="noopener noreferrer">Ragesh</a>
        </div>
      </div>
    </>
  );
}



function isBoardFull(board) {
  return board.every(square => square !== null);
}


function findBestMove(board) {
  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const winner = calculatewinner(board);

  if (winner === 'O') {
    return 1;
  }
  if (winner === 'X') {
    return -1;
  }
  if (isBoardFull(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}


function calculatewinner(squares){
  const lines=[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i=0;i<lines.length;i++){
    const [a,b,c]=lines[i];
    if (squares[a] && squares[a]===squares[b] && squares[a] === squares[c] ){
      return squares[a];
    }
  }
  return null;

}
export default Board;
