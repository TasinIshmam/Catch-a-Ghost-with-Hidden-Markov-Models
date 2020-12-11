import React, { useState } from 'react';
import Game from './Game';
import Settings from "./Settings";


export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rows: 4,
            cols: 4,
            distanceMedium: 2,
            distanceFar: 4,
            submitClicked: 0
        }

        // this.handleRestartGame = this.handleRestartGame.bind(this);
    }


    handleRestartGame(settingsData) {
        console.log("handleRestartGame called");

        this.setState({
            rows: settingsData.rows,
            cols: settingsData.cols,
            distanceMedium: settingsData.distanceMedium,
            distanceFar: settingsData.distanceFar,
            submitClicked: this.state.submitClicked + 1
        });

        // console.log(this.state);
        //todo understand why the fuck not updating....
    }

    render() {

        return (
            <div className="container" >

                <div className="row">
                    <div className="col-12 my-auto">
                        <Settings rows={this.state.rows} cols={this.state.cols} distanceMedium={this.state.distanceMedium} distanceFar={this.state.distanceFar} handleRestartGame={(settingsData) => this.handleRestartGame(settingsData)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Game rows={this.state.rows}/>
                    </div>

                </div>

                <div className="row">
                    <div className="col-12">
                        Submit clicked so far: {this.state.rows}
                    </div>

                </div>

            </div>


        )
    }
}


