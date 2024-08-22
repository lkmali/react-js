import { Component } from 'react'
import { Link } from 'react-router-dom'
import LoaderContainer from '../../container/loader/Loader'
import { errorMessage, reactGAEvent, validateEmail } from '../../helper'
export default class LoginComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: {},
      errors: {},
      isFormTouched: false,
      passwordType: 'password',
    }
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
   * This method calls whenever any change in input occurs
   */
  handleChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name
    let fields = this.state.fields
    fields[name] = value

    this.setState({ fields, isFormTouched: true })
  }

  /**
   * This handles the blur in input field
   */
  handleBlur = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value
    if (name === 'email') {
      if (!this.state.fields.email) {
        this.setErrors('emailError', errorMessage.emailEmpty)
      } else if (!validateEmail(value)) {
        this.setErrors('emailError', errorMessage.emailFormat)
      } else {
        this.setErrors('emailError', '')
      }
    } else {
      if (!this.state.fields.password) {
        this.setErrors('passwordError', errorMessage.passwordEmpty)
      } else {
        this.setErrors('passwordError', '')
      }
    }
  }

  togglePassword = () => {
    const { passwordType } = this.state
    if (passwordType === 'password') {
      this.setState({ passwordType: 'text' })
    } else {
      this.setState({ passwordType: 'password' })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    reactGAEvent('login', 'login Click', 'signin to poratl')
    const name = this.state.fields.email
    const password = this.state.fields.password
    this.props.handleSubmit(e, { userName: name, password })
  }

  render() {
    const { passwordType } = this.state
    return (
      <div className='container '>
        <div className='row d-flex justify-content-center align-items-center h-100'>
          <div className='col-lg-5 col-sm-8'>
            <div className='white-box border border-info rounded mt-3'>
              <h4 className='font-weight-bold text-center'>Sign in</h4>
              {/* <div className="text-secondary text-center">Access to your dashboard</div> */}
              <form onSubmit={this.handleSubmit}>
                <div className='row mt-2'>
                  <div className='col-sm-12'>
                    <div className='form-group'>
                      <label>Email address</label>
                      <input
                        type='email'
                        name='email'
                        className={`form-control ${
                          this.state.errors?.emailError ? 'is-invalid' : ''
                        }`}
                        placeholder='name@address.com'
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                      />
                      <span className='text-danger'>{this.state.errors?.emailError}</span>
                    </div>
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-sm-12'>
                    <div className='form-group'>
                      <div className='d-flex justify-content-between align-items-center'>
                        <label>Password</label>
                      </div>
                      <div className='input-group'>
                        <input
                          type={passwordType}
                          name='password'
                          className={`form-control ${
                            this.state.errors?.passwordError ? 'is-invalid' : ''
                          }`}
                          placeholder='Enter your password'
                          onChange={this.handleChange}
                          onBlur={this.handleBlur}
                        />
                        <button
                          type='button'
                          className='btn btn-outline-primary'
                          onClick={this.togglePassword}
                        >
                          {passwordType === 'password' ? (
                            <i className='fa-solid fa-eye-slash'></i>
                          ) : (
                            <i className='fa-solid fa-eye'></i>
                          )}
                        </button>
                      </div>
                      <span className='text-danger'>{this.state.errors?.passwordError}</span>
                    </div>
                  </div>
                </div>
                <div className='row mt-4'>
                  <div className='col-sm-12'>
                    {this.props.formLoader ? (
                      <button className='btn btn-primary btn-lg d-block w-100' disabled>
                        <LoaderContainer
                          type={'Circles'}
                          color={'white'}
                          height={20}
                          width={20}
                          visible={true}
                        ></LoaderContainer>
                      </button>
                    ) : (
                      <button
                        disabled={
                          !(this.state.fields.password && validateEmail(this.state.fields.email))
                        }
                        className='btn btn-primary btn-lg d-block w-100 mb-2'
                      >
                        Sign in
                      </button>
                    )}
                  </div>
                </div>
                <div className='d-flex justify-content-between align-items-right'>
                  <label></label>
                  <Link to='/account/set-password' className='font-size-1-5 btn-link'>
                    {' '}
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
