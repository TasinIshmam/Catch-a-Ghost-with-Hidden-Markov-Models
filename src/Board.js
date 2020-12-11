import React from "react";
import Square from "./Square";

export default class Board extends React.Component {


    renderSquare(row, col) {
        return (
            <Square
                probability={this.props.boardProbabilities[row][col]}
                isClicked = {this.props.boardIsClicked[row][col]}
                onClick={() => this.props.onClick(row, col)}
            />
        );
    }

    renderRow(rowNo) {
        let squares = [];
        
        for(let colNo = 0; colNo < this.props.cols ; colNo ++) {
            squares.push(this.renderSquare(rowNo, colNo));
        }

        return (
            <div className="board-row">
                {squares}
            </div>
        )
    }

  
    render() {
        const rows = [];

        for (let rowNo = 0; rowNo < this.props.rows; rowNo ++ ) {
            rows.push(this.renderRow(rowNo));
        }

        return (
            <div>{rows}</div>
        );
    }
}
