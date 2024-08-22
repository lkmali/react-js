import React, { Component } from 'react'
import LoaderContainer from '../../container/loader/Loader'
import { errorMessage, validateEmail } from '../../helper'

class ForgotPasswordResetLinkComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      errors: {},
    }
  }

  setErrors = (key, value) => {
    let errors = this.state.errors
    errors[key] = value
    this.setState({ errors })
  }

  /**
   * This handles the blur in input field
   */
  handleBlur = (event) => {
    const target = event.target
    const value = target.value
    if (!this.state.email) {
      this.setErrors('emailError', errorMessage.emailEmpty)
    } else if (!validateEmail(value)) {
      this.setErrors('emailError', errorMessage.emailFormat)
    } else {
      this.setErrors('emailError', '')
    }
  }

  handleChange = (event) => {
    const target = event.target
    const value = target.value
    this.setState({ email: value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.resetLink(this.state.email)
  }

  render() {
    return (
      <React.Fragment>
        <h4 className='font-weight-bold text-center'>Forgot Password</h4>
        <div
          style={{ display: this.props.isResponseArrived ? 'none' : '' }}
          className='text-secondary text-center'
        >
          Enter reset password email
        </div>
        {!this.props.isResponseArrived ? (
          <form onSubmit={this.handleSubmit}>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <div className='form-group'>
                  <label>Email address</label>
                  <input
                    type='email'
                    name='email'
                    className={`form-control ${this.state.errors?.emailError ? 'is-invalid' : ''}`}
                    placeholder='name@LKMALI.com'
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                  />
                  <span className='text-danger'>{this.state.errors?.emailError}</span>
                </div>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-sm-12'>
                {this.props.loader ? (
                  <button className='btn btn-primary btn-lg d-block w-100' disabled>
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
                    disabled={!(this.state.email && validateEmail(this.state.email))}
                    className='btn btn-primary btn-lg d-block w-100'
                  >
                    Send Email
                  </button>
                )}
              </div>
            </div>
          </form>
        ) : (
          <p style={{ color: '#186881', fontSize: '16px' }} className=' text-center'>
            Your password request has been accepted, please check your inbox for further steps.
          </p>
        )}
      </React.Fragment>
    )
  }
}

export default ForgotPasswordResetLinkComponent
