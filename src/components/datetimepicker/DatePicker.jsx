import { Component } from 'react'
import DatePicker from 'react-datepicker'
import './DateTime.css'

export default class DatePickerContainer extends Component {
  render() {
    return (
      <DatePicker
        {...this.props}
        className='form-control'
        placeholder='Select Date'
        selected={this.props.startDate}
        onChange={this.props.handleDate}
        maxDate={this.props.maxDate}
      ></DatePicker>
    )
  }
}
