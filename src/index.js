import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let bgColor = (props.winnerSquares && props.winnerSquares.includes(props.index)) ?
      'green':
      'white';

  return (
    <button
      style={{
	backgroundColor: bgColor
      }}
      className="square"
      onClick={props.onClick}
      >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winnerSquares) {
    return (
      <Square
	winnerSquares= {winnerSquares}
	index = {i}
	key = {i}
	value={this.props.squares[i]}
	onClick={()=>this.props.onClick(i)}
	/>
    );
  }
  
  render() {
    console.log(this.props.winnerSquares);
    let rows = [];
    let squares = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
    	squares.push(this.renderSquare(i*3+j, this.props.winnerSquares));
      }
      rows.push(<div key={i*3} className="board-row">{squares}</div>);
      squares = [];
    }
    return <div>{rows}</div>;
  }
}

function ToggleButton(props) {
  return (
    <button onClick={props.onClick}>Reverse List</button>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
	squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      locationsHistory: [null],
      reversedHistoryList: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const locationsHistory = this.state.locationsHistory.slice(0, this.state.stepNumber + 1);
    locationsHistory.push(i);

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
	squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      locationsHistory: locationsHistory,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverse() {
    this.setState({reversedHistoryList: !this.state.reversedHistoryList});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;

    const moves = history.map((step, move) => {
      let moveX = Math.floor(this.state.locationsHistory[move]/3);
      let moveY = this.state.locationsHistory[move] - (moveX * 3);

      const DescEl = () => {
	const text = move ?
	      `Go to move #${move} (${moveX}:${moveY})`:
	      'Go to game start';
	return (
	  move === this.state.stepNumber ? <b>{text}</b> : text
	);
      };

      return (
      	<li key={move}>
      	  <button onClick={() => this.jumpTo(move)}>
      	    <DescEl />
      	  </button>
      	</li>
      );
    });
    if (this.state.reversedHistoryList)
      moves.reverse();

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
	    winnerSquares = {calculateWinner(current.squares).winnerSquares}
	    squares = {current.squares}
	    onClick = {(i) => this.handleClick(i)}
	    />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
	  <ToggleButton onClick={() => this.reverse()}/>
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

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
	winner: squares[a],
	winnerSquares: lines[i],
      };
    }
  }
  return {
    winner: null,
    winnerSquares: null,
  };
}
