import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let GameSizeLen = 5;
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
          squares: Array(this.props.SizeLen*this.props.SizeLen).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      SizeLen: this.props.SizeLen
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares,this.state.SizeLen) || squares[i]) {
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
    const winner = calculateWinner(current.squares,this.state.SizeLen);

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

ReactDOM.render(<Game SizeLen={GameSizeLen} />, document.getElementById("root"));

// ========================================
function calculateWinner(squares,SizeLen) {
  // lines用来存游戏结束的“状态”，当且仅当棋盘中所有行、列或两个对角线中元素都相等时游戏结束。
  const lines = new Array(SizeLen*2+2);
  let line_x = Array(SizeLen).fill(null),line_y = Array(SizeLen).fill(null);
  for(let i=0; i<SizeLen; i++)
  {
    let sub_line_raw = Array(SizeLen).fill(null),sub_line_col = Array(SizeLen).fill(null);

    for(let j=0;j<SizeLen;j++)
    {
      sub_line_raw[j] = i*SizeLen+j;
      sub_line_col[j] = j*SizeLen+i;
    }
    lines[i] = sub_line_raw;
    lines[i+SizeLen] = sub_line_col;
    line_x[i] = i*(SizeLen+1);
    line_y[i] = (i+1)*(SizeLen-1);
  }
  lines[SizeLen*2] = line_x;
  lines[SizeLen*2+1] = line_y;

  // 以下用于判断squares中的状态是否达到“结束”状态，采用遍历所有胜利状态的方法
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let Is_FIN = false;  // 用于记录在一个line中所有元素是否相等的标识
    for(let j = 0; j < SizeLen; j++)  // 因为Size不确定，所以用for循环来遍历
    {
      if(squares[line[0]]&&squares[line[0]]===squares[line[j]])
        Is_FIN = true;
      else{  // 如果有一个元素不等，则结束此行的判断
        Is_FIN = false;
        break;
      }
    }
    if(Is_FIN)
      return squares[line[0]];
  }
  return null;

}
