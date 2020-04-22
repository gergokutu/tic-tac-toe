import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   // state = {
//   //   value: null,
//   // };

//   // Same result...
//   // But following the tutorial
//   // We lifted the state up to Board
//   // So we do not need the following lines here
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }

//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick({value: 'X'})}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Reshape Square to function component
// Do not forget to pass props!
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  // Lift the state up to Game component
  // To be able to control all the date there
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true
  //   };
  // }

  // State lifted up >
  // Implement handleClick in Game component too
  // handleClick(i) {
  // // Use slice for immutability 
  //   const squares = this.state.squares.slice();

  //   // Return early by ignoring a click
  //   // If someone has won the game or
  //   // If a Square is already filled
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }

  //   squares[i] = this.state.xIsNext ? 'X' : 'O';

  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext
  //   });
  // } 

  // Modify renderSquare
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // const status = `Next player ${(this.state.xIsNext ? 'X' : 'O')}`;
    // After moving the state to Game
    // We have to handle the status there too
    // const winner = calculateWinner(this.state.squares);
    // let status;

    // if (winner) {
    //   status = `Winner ${winner}`;
    // } else {
    //   this.state.squares.indexOf(null) === -1 ?
    //     status = 'Tied' :
    //     status = `Next player ${(this.state.xIsNext ? 'X' : 'O')}`;
    // }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // Move state here from Board > add history!!!
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)}
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  // Implement handleCLick here
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // Slice for immutability!!!
    const squares = current.squares.slice();

    // Return early by ignoring a click
    // If someone has won the game or
    // If a Square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Concat for immutability!!! (instead of push)
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  newGame() {
    this.setState({
      history: [
        {squares: Array(9).fill(null)}
      ],
      stepNumber: 0,
      xIsNext: true
    });
  }

  render() {
    // Handle the game status here >
    // Call calculate winner and handle status
    const history = this.state.history;
    // const current = history[history.length - 1];
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)

    // Map 2nd arg is the index
    // move > index
    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}` :
        'Go to the start'
      
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner ${winner}`;
    } else {
      current.squares.indexOf(null) === -1 ?
        status = 'Tie' :
        status = `Next player ${(this.state.xIsNext ? 'X' : 'O')}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <button onClick={() => this.newGame()}>Play again</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// helper function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]) {
          return squares[a];
    }
  }

  return null;
}
