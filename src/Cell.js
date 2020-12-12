import React from "react";

export default function Cell(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.probability}
        </button>
    );
}
