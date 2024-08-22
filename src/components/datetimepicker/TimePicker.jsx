import React, { Component } from 'react'
import TimePicker from 'rc-time-picker'

import './DateTime.css'
export default class TimePickerContainer extends Component {
  render() {
    const format = 'h:mm a'
    return (
      <TimePicker
        className='form-control react-time-picker'
        id='timepicker'
        placeholder='Select time'
        value={this.props.startTime}
        onChange={this.props.handleTime}
        use12Hours={true}
        showSecond={false}
        format={format}
      ></TimePicker>
    )
  }
}
