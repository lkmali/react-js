import { Component } from 'react'
import { Modal } from 'react-bootstrap'
import LoaderContainer from '../../../container/loader/Loader'
import { errorMessage, validateEmail } from '../../../helper'
import './Add.css'
export default class AdminUsersAddComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      inputValues: {},
      roles: [],
      image: null,
      checkBoxChecked: false,
      roleLoader: true,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChanges = this.handleChanges.bind(this)
  }

  handleChanges(event) {
    let name = event.target.name
    let inputValues = this.state.inputValues
    inputValues[name] = event.target.value
    this.setState((prevState) => ({
      ...prevState,
      inputValues,
    }))
  }
  handleCheckbox = () => {
    if (!this.state.checkBoxChecked) {
      this.setErrors('Checkbox', '')
    }
    this.setState({ checkBoxChecked: !this.state.checkBoxChecked })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const requiredFields = [
      'address',
      'city',
      'country',
      'email',
      'fullName',
      'phone',
      'pincode',
      'role',
      'state',
    ]
    const inputValues = this.state.inputValues
    let errors = {}
    requiredFields.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        errors[key + 'Error'] = 'field is empty'
      } else if (inputValues[key] === null || inputValues[key] === '') {
        errors[key + 'Error'] = 'field is empty'
      }
    })
    if (!this.state.checkBoxChecked) {
      errors.Checkbox = errorMessage.checkBox
    } else {
      delete errors.Checkbox
    }

    this.setState({ errors }, () => {
      if (Object.values(this.state.errors).every((value) => !value)) {
        this.props.handleSubmit(this.state.inputValues)
      }
    })
  }

  handleBlur = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value

    switch (name) {
      case 'email':
        if (!value) {
          this.setErrors('emailError', errorMessage.emailEmpty)
        } else if (!validateEmail(value)) {
          this.setErrors('emailError', errorMessage.emailFormat)
        } else {
          this.setErrors('emailError', '')
        }
        break
      case 'role':
        if (!value) {
          this.setErrors('roleError', errorMessage.roleEmpty)
        } else {
          this.setErrors('roleError', '')
        }
        break
      case 'fullName':
        if (!value) {
          this.setErrors('fullNameError', errorMessage.fullNameEmpty)
        } else if (!/^[a-zA-Z]+$/.test(value)) {
          this.setErrors('fullNameError', errorMessage.fullNameEror)
        } else {
          this.setErrors('fullNameError', '')
        }
        break
      case 'address':
      case 'city':
      case 'state':
      case 'country':
        if (!value) {
          this.setErrors(`${name}Error`, errorMessage[`${name}Empty`])
        } else {
          this.setErrors(`${name}Error`, '')
        }
        break
      case 'pinCode':
        if (!value) {
          this.setErrors('pinCodeError', errorMessage.pincodeEmpty)
        } else {
          this.setErrors('pinCodeError', '')
        }
        break
      case 'phone':
        if (!value) {
          this.setErrors('phoneError', errorMessage.phoneEmpty)
        } else {
          this.setErrors('phoneError', '')
        }
        break
      default:
        break
    }
  }

  setErrors = (field, message) => {
    this.setState((prevState) => ({
      errors: {
        ...prevState.errors,
        [field]: message,
      },
    }))
  }

  resetState = () => {
    this.setState({
      errors: {},
    })
    this.props.resetState()
    this.props.handleClose()
  }

  render() {
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#186881',
      visible: true,
    }
    const { roleLoader } = this.props
    return (
      <Modal show={this.props.modalShow} backdrop='static' centered>
        <div className='modal-header'>
          <h5 className='modal-title font-weight-bold'>Add new user</h5>
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
          {roleLoader ? (
            <LoaderContainer {...loaderProperty}></LoaderContainer>
          ) : (
            <form onSubmit={this.handleSubmit}>
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <div className='form-group'>
                        <label>Full Name</label>
                        <input
                          type='text'
                          name='fullName'
                          value={this.state.inputValues.fullName}
                          className={`form-control ${
                            this.state.errors?.fullNameError ? 'is-invalid' : ''
                          }`}
                          placeholder='Enter Full name'
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                          // onKeyUp={this.handleBlur}
                        />
                        <span className='text-danger'>{this.state.errors?.fullNameError}</span>
                      </div>
                    </div>
                    <div className='col-sm-12 mt-2'>
                      <div className='form-group'>
                        <label>Email Address</label>
                        <input
                          type='email'
                          name='email'
                          placeholder='Enter email address'
                          value={this.state.inputValues.email}
                          className={'form-control'}
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                          // onKeyUp={this.handleBlur}
                        />
                        <span className='text-danger'>{this.state.errors?.emailError}</span>
                      </div>
                    </div>
                    <div className='col-sm-12 mt-2'>
                      <div className='form-group'>
                        <label>Phone Number</label>
                        <input
                          type='tel'
                          name='phone'
                          placeholder='Enter phone number'
                          value={this.state.inputValues.phone}
                          className={'form-control'}
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                          // onKeyUp={this.handleBlur}
                        />
                        <span className='text-danger'>{this.state.errors?.phoneError}</span>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-sm-12'>
                      <label>Role</label>
                      <select
                        name='role'
                        className={`form-group form-control custom-select ${
                          this.state.errors?.roleError ? 'is-invalid' : ''
                        }`}
                        placeholder='Select role'
                        onBlur={this.handleBlur}
                        onKeyUp={this.handleBlur}
                        onChange={this.handleChanges}
                      >
                        <option defaultValue value=''>
                          Select Role
                        </option>
                        {this.props.roles &&
                          this.props.roles.length &&
                          this.props.roles.map((item, i) => {
                            return (
                              <option key={i} value={item}>
                                {item ? item.charAt(0).toUpperCase() + item.slice(1) : ''}
                              </option>
                            )
                          })}
                      </select>
                      <span className='text-danger'>{this.state.errors?.roleError}</span>
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-sm-4'></div>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <div className='form-group'>
                        <label>City</label>
                        <input
                          type='text'
                          name='city'
                          placeholder='Enter city name'
                          className={'form-control'}
                          value={this.state.inputValues.city}
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                          // onKeyUp={this.handleBlur}
                        />
                        <span className='text-danger'>{this.state.errors?.cityError}</span>
                      </div>
                    </div>
                    <div className='col-sm-12 mt-2'>
                      <div className='form-group'>
                        <label>State</label>
                        <input
                          type='text'
                          name='state'
                          value={this.state.inputValues.state}
                          className={'form-control'}
                          placeholder='Enter state name'
                          onBlur={this.handleBlur}
                          // onKeyUp={this.handleBlur}
                          onChange={this.handleChanges}
                        />
                        <span className='text-danger'>{this.state.errors?.stateError}</span>
                      </div>
                    </div>
                    <div className='col-sm-12 mt-2'>
                      <div className='form-group'>
                        <label>Country</label>
                        <input
                          type='text'
                          name='country'
                          placeholder='Enter country name'
                          value={this.state.inputValues.country}
                          className={'form-control'}
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                          // onKeyUp={this.handleBlur}
                        />
                        <span className='text-danger'>{this.state.errors?.countryError}</span>
                      </div>
                    </div>
                    <div className='col-sm-12 mt-2'>
                      <div className='form-group'>
                        <label>Pincode</label>
                        <input
                          type='text'
                          name='pincode'
                          value={this.state.inputValues.pincode}
                          className={'form-control'}
                          placeholder='Enter pincode'
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                          // onKeyUp={this.handleBlur}
                        />
                        <span className='text-danger'>{this.state.errors?.pincodeError}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='col-sm-6'>
                  <label>Address</label>
                  <textarea
                    name='address'
                    className='form-control'
                    onChange={this.handleChanges}
                    onBlur={this.handleBlur}
                    // onKeyUp={this.handleBlur}
                    value={this.state.inputValues.address}
                    cols={30}
                    rows={2}
                    placeholder='Enter Address'
                  />
                  <span className='text-danger'>{this.state.errors?.addressError}</span>
                </div>
                {/* <div className="col-sm-6">
                  <label>Image</label>
                  <div className="image-upload">
                    <label htmlFor="file-input">
                      <image
                        src={
                          this.state.image
                            ? this.state.image
                            : process.env.REACT_APP_PUBLIC_URL + "/images/upload.jpg"
                        }
                        alt="upload png"
                      />
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      onChange={this.uploadFile}
                    />
                  </div>
                  <AvatarPicker
                    handleChangeImage={this.uploadFile}
                    avatarImage={this.state.image}
                  />
                  <div className="avatar-wrapper">
                    <image
                      alt="upload png"
                      className="profile-pic"
                      src={
                        this.state.image
                          ? this.state.image
                          : process.env.REACT_APP_PUBLIC_URL + "/images/upload.jpg"
                      }
                    />
                    <div className="upload-button">
                      <i
                        className="fa fa-arrow-circle-up"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <input
                      className="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={this.uploadFile}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <div className="image-upload">
                      <image
                        src={process.env.REACT_APP_PUBLIC_URL + "/images/upload.jpg"}
                        alt="upload png"
                        className="mt-2"
                      />
                      <label className="my-3 d-block">
                        {" "}
                        Upload document (.jpg,.png)
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        name="fileUrl"
                        value={this.state.image ? this.state.image : ""}
                        accept=".jpg,.png"
                        onChange={this.uploadFile}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
              <div className='row mt-2'>
                <div className='col-sm-12'>
                  <div className=''>
                    <input
                      type='checkbox'
                      name='checkbox'
                      className='me-2'
                      onChange={this.handleCheckbox}
                    />
                    <label>
                      I accept the{' '}
                      <a style={{ textDecoration: 'none' }} href='/'>
                        {' '}
                        terms and conditions{' '}
                      </a>
                    </label>
                  </div>
                  <span className='text-danger'>
                    {this.state.errors?.Checkbox && this.state.errors?.Checkbox}
                  </span>
                </div>
                <div className='col-sm-4'>
                  {this.props.formSubmissionLoader ? (
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
                    <button
                      className='btn btn-primary btn-lg d-block w-100'
                      style={{ color: 'white' }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    )
  }
}
