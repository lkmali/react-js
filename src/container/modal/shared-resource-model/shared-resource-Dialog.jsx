import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import { validateEmail } from '../../../helper'
import CustomValueChips from '../../custom-value-chips/custom-value-chips'
import LoaderContainer from '../../loader/Loader'
export default class SharedResourceDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      error: null,
      value: '',
    }
  }

  handleKeyDown = (value) => {
    if (value && this.isValid(value)) {
      this.setState({
        items: [...this.state.items, value],
        value: '',
      })
    }
  }

  handleChange = (value) => {
    this.setState({
      value,
      error: null,
    })
  }

  handleDelete = (item) => {
    this.setState({
      items: this.state.items.filter((i) => i !== item),
    })
  }

  handlePaste = (paste) => {
    const pattern = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g
    var emails = paste.match(pattern)

    if (emails) {
      var toBeAdded = emails.filter((email) => !this.isInList(email))

      this.setState({
        items: [...this.state.items, ...toBeAdded],
      })
    }
  }

  isValid(email) {
    let error = null
    if (this.isInList(email)) {
      error = `${email} has already been added.`
    }

    if (!validateEmail(email)) {
      error = `${email} is not a valid email address.`
    }

    if (error) {
      this.setState({ error })

      return false
    }

    return true
  }

  isInList(email) {
    return this.state.items.includes(email)
  }

  isEmail(email) {
    const pattern = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g
    return pattern.test(email)
  }

  onClickShared = () => {
    if (this.state.items.length > 0) {
      this.props.onClickShared(this.state.items, this.props.ids)
    }
  }

  render() {
    return (
      <Modal show={this.props.modalShow} onHide={() => this.props.handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Add User Email to share your Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomValueChips
            handleKeyDown={this.handleKeyDown}
            handleChange={this.handleChange}
            handleDelete={this.handleDelete}
            handlePaste={this.handlePaste}
            items={this.state.items}
            error={this.state.error}
            value={this.state.value}
          ></CustomValueChips>
        </Modal.Body>

        <Modal.Footer>
          {this.props.sharedLoader ? (
            <button className='btn btn-primary px-5 me-5' disabled>
              <LoaderContainer
                type={'Circles'}
                color={'white'}
                height={15}
                width={15}
                visible={true}
              ></LoaderContainer>
            </button>
          ) : (
            <div
              className='col-xs-12 rounded card-background'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className='me-2' onClick={() => this.onClickShared()}>
                <i className='fa fa-envelope status' style={{ color: 'black', cursor: 'pointer' }}>
                  {'  Share'}
                </i>
              </div>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    )
  }
}
