import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import './ProgressBar.css'

export default function ProgressBarContainer(props) {
  return props.visible ? (
    <div>
      {/* <ProgressBar variant="success"  label={`${props.percentage}%`} /> */}
      <ProgressBar animated now={props.percentage} label={`${props.percentage}%`} />
    </div>
  ) : (
    <div></div>
  )
}
