import React from "react";
import classnames from 'classnames';
import './index.css';
import * as datePicker from './datePicker';
import logo from "./calendar.svg"


export default class DatePicker extends React.Component {
    static defaultProps = {
        date: new Date(),
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        weekDayNames: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        onChange: Function.prototype
    }

    state = {
        date: this.props.date,
        currentDate: new Date(),
        selectedDate: null,
        selectedEndDate: null
    };

    get year() {
        return this.state.date.getFullYear();
    }

    get years() {
        let years = [];
        for (let i = 1900; i <= 2200; i++)
        {
            years.push(i);
        }
        return years;
    }

    get month() {
        return this.state.date.getMonth();
    }

    get day() {
        return this.state.date.getDate();
    }
    get formattedFrom() {
        let from = this.state.selectedDate;
        if (from) {
            const offset = from.getTimezoneOffset()
            let b = new Date(from.getTime() - (offset*60*1000)).toISOString().split('T')[0].split('-');
            return  b[2] + "/" + b[1] + "/" + b[0];
        }
        return "";
    }

    get formattedTo() {
        let from = this.state.selectedEndDate;
        if (from) {
            const offset = from.getTimezoneOffset()
            let b = new Date(from.getTime() - (offset*60*1000)).toISOString().split('T')[0].split('-');
            return  b[2] + "/" + b[1] + "/" + b[0];
        }
        return "";
    }

    /*renderFromToInput(){
        if (this.state.selectedDate && this.state.selectedEndDate) {
            return "<input value={this.formattedFrom}></input>";
        }
        return "";
    }*/

    isInPeriod(date) {
        let from = this.state.selectedEndDate,
            to = this.state.selectedDate;

        if (from && to) {
            return date.getTime() < from.getTime() && date.getTime() > to.getTime();
        }

        return false;
    }

    handlePrevMonthButtonClick = () => {
        const date = new Date(this.year, this.month - 1);
        if (date.getFullYear() >= this.years[0]) {
            console.log(date);
            this.setState({date});
        }
    };

    handleNextMonthButtonClick = () => {
        const lastYear = this.years.length;
        const date = new Date(this.year, this.month + 1);
        if (date.getFullYear() <= this.years[lastYear - 1]) {
            console.log(date);
            this.setState({date});
        }
    };

    handlePrevYearButtonClick = () => {
        if (this.year - 1 >= this.years[0]) {
            const date = new Date(this.year - 1, this.month);
            console.log(date);
            this.setState({date});
        }
    };

    handleNextYearButtonClick = () => {
        const lastYear = this.years.length;
        if (this.year + 1 <= this.years[lastYear - 1]) {
            const date = new Date(this.year + 1, this.month);
            console.log(date);
            this.setState({date});
        }
    };

    handleSelectChange = () => {
        const year = this.yearSelect.value;
        const month = this.monthSelect.value;
        const date = new Date(year, month);
        console.log(date);
        this.setState({date});
    };

    handleDayClick = date => {
        console.log(date);

        if (!this.state.selectedDate)
            this.setState({selectedDate: date});
        else if (!datePicker.areLarge(this.state.selectedDate, date))
            this.setState({selectedEndDate: date});
        else if (datePicker.areLarge(this.state.selectedDate, date))
            this.setState({selectedDate: date});

        this.props.onChange(date);
    };


    render() {
        console.log(this.props);
        const {monthNames, weekDayNames} = this.props;
        const years = this.years;
        const {currentDate, selectedDate, selectedEndDate} = this.state;

        const monthDate = datePicker.getMonthDate(this.year, this.month);


        return (
            <div className="datePicker">
                {/*{this.renderFromToInput}*/}
                <div className="formattedFromTo">
                    <div className="inputDiv">
                        <p className="paragraphDiv">От <input className="borderNone" size="6" value={this.formattedFrom}></input> <img src={logo} alt="календарь"/></p>
                    </div>
                    <div className="inputDiv"> <p className="paragraphDiv">До <input className="borderNone" size="6" value={this.formattedTo}></input> <img src={logo} alt="календарь"/></p> </div>
                </div>

                <header>
                    <button className='button1' onClick={this.handlePrevYearButtonClick}></button>
                    <button className='button2' onClick={this.handlePrevMonthButtonClick}></button>

                    <select className="selectedDate" ref={element => this.monthSelect = element} value={this.month}
                            onChange={this.handleSelectChange}>
                        {monthNames.map((name, index) =>
                            <option key={name} value={index}>{name}</option>
                        )}
                    </select>

                    <select className="selectedDate" ref={element => this.yearSelect = element} value={this.year}
                            onChange={this.handleSelectChange}>
                        {years.map(year =>
                            <option key={year} value={year}>{year}</option>
                        )}
                    </select>

                    <button className='button3' onClick={this.handleNextMonthButtonClick}></button>
                    <button className='button4' onClick={this.handleNextYearButtonClick}></button>
                </header>

                <table>
                    <thead>
                    <tr>
                        {weekDayNames.map(name =>
                            <th key={name}>{name}</th>
                        )}
                    </tr>
                    </thead>

                    <tbody>
                    {monthDate.map((week, index) =>
                        <tr key={index} className="week">
                            {week.map((date, index) => date ?
                                <td key={index} className={classnames('day',
                                    {
                                        'today': datePicker.areEqual(date, currentDate),
                                        'selected': datePicker.areEqual(date, selectedDate),
                                        'selectedEnd': datePicker.areEqual(date, selectedEndDate),
                                        'selectedFromTo': this.isInPeriod(date)
                                    })
                                } onClick={() => this.handleDayClick(date)}>{date.getDate()}
                                </td>
                                :
                                <td key={index}/>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>

                <table>
                    <button className='enter'>{'Применить'}</button>
                </table>
            </div>
        );
    }
}
