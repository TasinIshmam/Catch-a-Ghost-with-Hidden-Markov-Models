import React from "react";
import Cell from "./Cell";

export default class Board extends React.Component {


    renderSquare(row, col) {
        return (
            <Cell
                probability={this.props.boardProbabilities[row][col]}
                manhattanDistance = {this.props.boardManhattanDistanceArray[row][col]}
                onClick={() => this.props.onClick(row, col)}
                key={`${row},${col}`}
                distanceMedium={this.props.distanceMedium}
                distanceFar={this.props.distanceFar}
            />
        );
    }

    renderRow(rowNo) {
        let squares = [];
        
        for(let colNo = 0; colNo < this.props.cols ; colNo ++) {
            squares.push(this.renderSquare(rowNo, colNo));
        }

        return (
            <div className="board-row" key={`ROW ${rowNo}`}>
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
