import React from 'react';

export default function GameControls(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-4 settings-button">
                    <button  className="btn btn-primary" onClick={props.onClickAdvanceTime}>Advance</button>
                </div>
                <div className="col-4 settings-button">
                    <button  className="btn btn-primary" onClick={props.onClickRevealGhost}>Reveal</button>
                </div>
                <div className="col-4 settings-button">
                    <button  className="btn btn-primary" onClick={props.onClickCatchGhost}>Catch</button>
                </div>
            </div>
        </div>
    )
}



