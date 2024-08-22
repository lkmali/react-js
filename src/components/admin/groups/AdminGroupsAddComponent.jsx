import { Component } from 'react'
import { Modal } from 'react-bootstrap'
import LoaderContainer from '../../../container/loader/Loader'
import { errorMessage, validateName } from '../../../helper'
import './Add.css'

export default class AdminGroupsAddComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChanges = this.handleChanges.bind(this)
  }

  /**
   * This method is use to set errors
   */
  setErrors = (key, value) => {
    let errors = this.state.errors
    errors[key] = value
    this.setState({ errors })
  }
  /**
   * This method handles all the changes in the input field
   */
  handleChanges(event) {
    this.props.handleChanges(event)
  }

  /**
   * This method handles when user submits the form
   */
  handleSubmit(event) {
    event.preventDefault()
    this.props.handleSubmit(event)
  }

  handleBlur = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value
    if (name === 'description') {
      if (!this.props.state.description) {
        this.setErrors('nameError', errorMessage.groupDescriptionEmpty)
      } else if (!validateName(value)) {
        this.setErrors('nameError', errorMessage.groupDescription)
      } else {
        this.setErrors('nameError', '')
      }
    }
    // else if (name === "role") {
    //     if (!this.props.state.role) {
    //         this.setErrors('roleError', errorMessage.roleEmpty);
    //     } else {
    //         this.setErrors('roleError', "");
    //     }
    // }
    else {
      const name = this.props.state.name
      if (name && !validateName(name)) {
        this.setErrors('nameError', errorMessage.nameEror)
      } else {
        this.setErrors('nameError', '')
      }
    }
  }

  resetState = () => {
    this.setState({
      errors: {},
    })
    this.props.resetState()
    this.props.handleClose()
  }

  render() {
    return (
      <Modal show={this.props.modalShow} backdrop='static' centered>
        <div className='modal-header'>
          <h5 className='modal-title font-weight-bold'>Add New Group</h5>
          <button
            onClick={this.resetState}
            type='button'
            className='close custome-close'
            data-dismiss='modal'
            aria-label='Close'
          >
            <span aria-hidden='true'>×</span>
          </button>
        </div>
        <Modal.Body>
          <div className='row'>
            <div className='col-sm-12'>
              <form onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  <label>Name</label>
                  <input
                    maxLength={'64'}
                    type='text'
                    name='name'
                    className={`form-control ${this.state.errors?.nameError ? 'is-invalid' : ''}`}
                    onBlur={this.handleBlur}
                    onChange={this.handleChanges}
                    value={this.props.state.name}
                    placeholder='Enter name'
                  />
                  <span className='text-danger'>{this.state.errors?.nameError}</span>
                </div>
                <div className='form-group'>
                  <label>Description</label>
                  <input
                    type='textArea'
                    name='description'
                    onChange={this.handleChanges}
                    onBlur={this.handleBlur}
                    className={`form-control ${
                      this.state.errors?.groupDescription ? 'is-invalid' : ''
                    }`}
                    placeholder='Enter description for your group'
                  />
                  <span className='text-danger'>{this.state.errors?.groupDescription}</span>
                </div>
                <div className='text-right'>
                  {this.props.formSubmissionLoader ? (
                    <button className='btn btn-primary px-5' disabled>
                      <LoaderContainer
                        type={'Circles'}
                        color={'white'}
                        height={15}
                        width={15}
                        visible={true}
                      ></LoaderContainer>
                    </button>
                  ) : (
                    <button
                      disabled={
                        !(
                          (this.props.state.name ? validateName(this.props.state.name) : true) &&
                          this.props.state.description &&
                          validateName(this.props.state.description)
                        )
                      }
                      type='submit'
                      className='btn btn-primary px-5 mt-2'
                    >
                      Add
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
