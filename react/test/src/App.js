import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 1
        }
    }

    plus = () => {
        this.setState({
            num: this.state.num + 1
        });
        console.log(this.state.num);
    };

    asyncPlus = () => {
        setTimeout(() => {
            this.setState({
                num: this.state.num + 1
            });
            console.log(this.state.num);
        }, 10);
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro" onClick={this.plus}>
                    To get started, edit <code>src/App.js</code> and save to reload. {this.state.num}
                </p>

                <button onClick={this.plus}>++</button>
                <button onClick={this.asyncPlus}>async ++</button>
            </div>
        );
    }
}

export default App;
