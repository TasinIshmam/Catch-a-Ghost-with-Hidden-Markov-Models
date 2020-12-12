import React from 'react';


export default class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rows: props.rows,
            cols: props.cols,
            distanceMedium: props.distanceMedium,
            distanceFar: props.distanceFar
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


    }

    onSubmit(event) {
        event.preventDefault();
        console.log("On submit debug");

        if (this.state.distanceMedium >= this.state.distanceFar) {
            alert("Medium distance must be less than Far Distance");
            return;
        }

        if (this.state.rows < this.state.distanceMedium && this.state.cols < this.state.distanceMedium) {
            alert("Medium distance must greater than one of row or column");
            return;
        }

        this.props.handleRestartGame(this.state)

    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    };

    render() {
        return (
            <form onSubmit={this.onSubmit} className="form-inline" >
                <div className="form-group">
                    <label htmlFor="rows">Rows: </label>
                    <input id="rows" name="rows" type="number" min="2" max="10" className="form-control mb-2 mr-sm-2" value={this.state.rows} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="cols">Cols: </label>
                    <input id="cols" name="cols" type="number" min="2" max="10" className="form-control mb-2 mr-sm-2" value={this.state.cols} onChange={this.handleInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="distanceMedium">Medium Distance: </label>
                    <input id="distanceMedium" name="distanceMedium" type="number" min="1" max="10" className="form-control mb-2 mr-sm-2" value={this.state.distanceMedium} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="distanceFar">Far Distance: </label>
                    <input id="distanceFar" name="distanceFar" type="number" min="2" max="10" className="form-control mb-2 mr-sm-2" value={this.state.distanceFar} onChange={this.handleInputChange} />
                </div>

                <button type="submit" className="btn btn-success mb-2">Start</button>
            </form>

        )
    }
}
