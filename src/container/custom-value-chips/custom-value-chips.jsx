import { Component } from 'react'
import './styles.css'
export default class CustomValueChips extends Component {
  constructor(props) {
    super(props)
  }
  handleKeyDown = (evt) => {
    if (['Enter', 'Tab', ','].includes(evt.key)) {
      evt.preventDefault()
      var value = this.props.value.trim()
      this.props.handleKeyDown(value)
    }
  }

  handleChange = (evt) => {
    this.props.handleChange(evt.target.value)
  }

  handleDelete = (item) => {
    this.handlePaste.handleDelete(item)
  }

  handlePaste = (evt) => {
    evt.preventDefault()

    var paste = evt.clipboardData.getData('text')
    this.props.handlePaste(paste)
  }

  render() {
    return (
      <>
        {this.props.items.map((item) => (
          <div className='tag-item' key={item}>
            {item}
            <button type='button' className='button' onClick={() => this.handleDelete(item)}>
              &times;
            </button>
          </div>
        ))}

        <input
          className={'input ' + (this.props.error && ' has-error')}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
        />

        {this.props.error && <p className='error'>{this.props.error}</p>}
      </>
    )
  }
}
