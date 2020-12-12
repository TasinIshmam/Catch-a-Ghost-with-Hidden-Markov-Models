import React from "react";

export default function Cell(props) {

    let className = "square ";

    if ( props.manhattanDistance < props.distanceMedium && props.manhattanDistance !== -1) {
        className += "red ";
    } else if (props.distanceMedium <= props.manhattanDistance && props.manhattanDistance < props.distanceFar) {
        className += "orange ";
    } else if (props.manhattanDistance >= props.distanceFar) {
        className += "green ";
    }

    if (props.manhattanDistance === -1) {
        className = "square";
    }

    return (
        <button className={className} onClick={props.onClick}>
            {props.probability}
        </button>
    );
}
