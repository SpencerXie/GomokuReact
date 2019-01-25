import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(k) {
    return (
      <Square
        value={this.props.squares[k]}
        onClick={() => this.props.onClick(k)}
      />
    );
  }

  render() {
    // 重写 Board(棋盘) 使用两个循环来制作方格，此处采用箭头函数使this指针仍然指向Board。
    // return 语句中的{...}中不能出现变量或函数的定义语句，必须为打印输出语句。
    // 这里写了两种实现方法，一种是基于箭头函数调用方法用两个for循环实现，另一种是采用了数组map()方法的特性来实现。

    // 方法一
    let fun_row = ()=>{
      let res = [];
      let fun_col = (i)=>{
        let res_sub = [];
        for(let j = 0; j < this.props.SizeLen; j++) {
          res.push(
            this.renderSquare(this.props.SizeLen*i+j)
          );
        };
      };
      for(let i = 0; i < this.props.SizeLen; i++) {
        res.push(
          <div className="board-row">
          {fun_col(i)}
          </div>
          );
      };
      return res;
    };
    return (
      <div>
      {fun_row()}
      </div>
    );

    // 方法二
    // let cols = [], rows = [], m = 0, length = this.props.SizeLen;
    // while (m++ < length)
    // {
    //   cols.push(m-1);
    //   rows.push(m-1);
    // }
    // return(
    //   <div>
    //   {
    //     rows.map((i) =>{
    //       return (
    //         <div className="board-row">
    //         {cols.map((j)=>this.renderSquare(length*i+j))}
    //         </div>
    //       );
    //     })
    //   }
    //   </div>
    // );
    //
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      SizeLen: 3
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move:
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            SizeLen={this.state.SizeLen}
          />
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

ReactDOM.render(<Game />, document.getElementById("root"));

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
