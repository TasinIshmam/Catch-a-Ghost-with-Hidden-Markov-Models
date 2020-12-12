import React from 'react';
import Game from './Game';
import Settings from "./Settings";


export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rows: 6,
            cols: 6,
            distanceMedium: 2,
            distanceFar: 3,
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
            <div className="container main-container">

                <div className="row main-segment">
                    <div className="col-12 my-auto">
                        <Settings rows={this.state.rows} cols={this.state.cols} distanceMedium={this.state.distanceMedium} distanceFar={this.state.distanceFar} handleRestartGame={(settingsData) => this.handleRestartGame(settingsData)} />
                    </div>
                </div>
                <div className="row main-segment">
                    <div className="col-12 my-auto">
                        <Game rows={this.state.rows} cols={this.state.cols} distanceMedium={this.state.distanceMedium} distanceFar={this.state.distanceFar} lateralProb="0.96" diagonalProb="0.03" stayProb="0.01" />
                    </div>

                </div>

                <div className="row main-segment">
                    <div className="col-12 my-auto">
                        {/* UI design shamelessly <strike>ripped off from</strike> <i>inspired by</i> <a href="https://redwanplague.github.io/ghost-busters/">Redwan's demo</a>. */}
                    </div>

                </div>

            </div>
        )
    }
}


