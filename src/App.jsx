import React from "react";
import './index.css';
import DatePicker from './components/DatePicker';


class App extends React.Component {

    state = {
        date: null
    };
    handleDateChange = date => this.setState({date});

    render() {
        const {date} = this.state;

        return (
            <div className="box">



                <DatePicker
                    onChange={this.handleDateChange}
                />
            </div>
        );
    }
}


export default App;