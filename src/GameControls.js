import React from 'react';

export default function GameControls(props) {
    return (
        <div className="container buttons-container">
            <div className="row">
                <div className="col-4">
                    <button  className="btn btn-primary settings-button" onClick={props.onClickAdvanceTime}>Move</button>
                </div>
                <div className="col-4 ">
                    <button  className="btn btn-primary settings-button" onClick={props.onClickRevealGhost}>Reveal</button>
                </div>
                <div className="col-4">
                    <button  className="btn btn-primary settings-button" onClick={props.onClickCatchGhost}>Catch</button>
                </div>
            </div>
        </div>
    )
}



