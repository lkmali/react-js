import { Component } from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
  Button,
  Form,
  FormGroup,
  Input,
  // FormLabel,
  // Typography,
  Label,
} from 'reactstrap'
import LoaderContainer from '../../container/loader/Loader'
import { errorMessage, validateEmail } from '../../helper'
export default class RegisterComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      check: false,
      fields: {},
      errors: {},
      isFormTouched: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChanges = this.handleChanges.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  setErrors = (key, value) => {
    let errors = this.state.errors
    errors[key] = value
    this.setState({ errors })
  }

  handleChanges(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    let fields = this.state.fields
    fields[name] = value ? value.trim() : value
    this.setState({ fields, isFormTouched: true })
  }

  handleCheckbox(event) {
    const value = event.target.checked
    const check = value
    this.setState({ check, isFormTouched: true })
  }

  handleSubmit(event) {
    event.preventDefault()
    if (!this.state.check) {
      this.setErrors('Checkbox', errorMessage.checkBox)
      return true
    }
    let isFormValid = true
    let fields = this.state.fields
    let errors = this.state.errors
    for (const item of event.target) {
      if (!fields[item.name] && item.name !== '') fields[item.name] = ''
    }
    for (const key in errors) {
      /**
       * Reset value of errors
       */
      if (errors && Object.prototype.hasOwnProperty.call(errors, key)) {
        errors[key] = ''
      }
    }
    for (const key in fields) {
      if (key === 'checkbox' || key === 'phoneCountry') {
        continue
      }
      if (!fields[key]) {
        isFormValid = false
        // if (key === 'password') {
        //     isPasswordErrorSet = true;
        // } else if (key === 'confirmPassword') {
        //     isConfirmPasswordErrorSet = true;
        // }
        const errorMessage = key + ' empty'
        this.setErrors(key + 'Error', errorMessage)
      } else {
        if (key === 'email' && !validateEmail(fields['email'])) {
          isFormValid = false
          this.setErrors('emailError', errorMessage.emailFormat)
        }
        // if (key === 'confirmPassword' && !Validator.isMatched(fields['password'], fields['confirmPassword'])) {
        //     isFormValid = false;
        //     this.setErrors('confirmPasswordError', errorMessage.passwordMatch)
        // }
        // if (key === 'firstName' && !Validator.validateName(fields['firstName'])) {
        //     isFormValid = false;
        //     this.setErrors('firstNameError', errorMessage.nameEror);
        // }
        // if (key === 'lastName' && !Validator.validateName(fields['lastName'])) {
        //     isFormValid = false;
        //     this.setErrors('lastNameError', errorMessage.nameEror);
        // }
      }
    }
    if (isFormValid && this.state.isFormTouched) {
      this.props.handleSubmit(this.state.fields)
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='row d-flex justify-content-center align-items-center h100-vh'>
          <div className='col-lg-6 col-sm-8'>
            <div className='white-box border border-info rounded mt-3'>
              <div className='d-flex justify-content-center align-items-center mb-3 pb-2'>
                <Label>
                  <b>Please fill the following details for registration</b>
                </Label>
              </div>
              <Form onSubmit={this.handleSubmit}>
                <div className='row'>
                  <div className='col-sm-6'>
                    <FormGroup>
                      <Label>Company Name</Label>
                      <Input
                        onChange={this.handleChanges}
                        type='input'
                        name='companyName'
                        id='companyName'
                        placeholder='Company Name'
                      />
                      <span className='text-danger'>{this.state.errors?.companyNameError}</span>
                    </FormGroup>
                  </div>
                  <div className='col-sm-6'>
                    <FormGroup>
                      <Label>Company WebSite</Label>
                      <Input
                        onChange={this.handleChanges}
                        type='input'
                        name='companyURL'
                        id='companyURL'
                        placeholder='https://url.com'
                      />
                      <span className='text-danger'>{this.state.errors?.companyURLError}</span>
                    </FormGroup>
                  </div>
                  <div className='col-sm-6'>
                    <FormGroup>
                      <Label>Your Name</Label>
                      <Input
                        type='input'
                        id='name'
                        value={this.state.name}
                        name='name'
                        placeholder='Jone'
                        onChange={this.handleChanges}
                      />
                      <span className='text-danger'>{this.state.errors?.nameError}</span>
                    </FormGroup>
                  </div>
                  <div className='col-sm-6'>
                    <FormGroup>
                      <Label>Your Phone Number</Label>
                      <PhoneInput
                        placeholder='Enter phone number'
                        defaultCountry='IN'
                        max={10}
                        name='phone'
                        value={this.state.phone}
                        onChange={(phone) =>
                          this.setState((prevState) => ({
                            fields: {
                              ...prevState.fields,
                              phone,
                            },
                          }))
                        }
                      />
                      <span className='text-danger'>{this.state.errors?.phoneError}</span>
                    </FormGroup>
                  </div>
                  <div className='col-sm-6'>
                    <FormGroup>
                      <Label>Your Email Id</Label>
                      <Input
                        type='input'
                        id='email'
                        name='email'
                        placeholder='abc@company.com'
                        onChange={this.handleChanges}
                      />
                      <span className='text-danger'>{this.state.errors?.emailError}</span>
                    </FormGroup>
                  </div>

                  <div className='col-sm-6'>
                    <FormGroup>
                      <Label>Your Role</Label>
                      <Input
                        type='input'
                        id='role'
                        name='role'
                        placeholder='Role'
                        onChange={this.handleChanges}
                      />
                      <span className='text-danger'>{this.state.errors?.roleError}</span>
                    </FormGroup>
                  </div>
                  <div className='col-sm-12'>
                    <FormGroup>
                      <Label for='exampleText'>Message for executives</Label>
                      <Input
                        type='textarea'
                        id='companyMessageExecutive'
                        name='companyMessageExecutive'
                        placeholder='I want to see some demo'
                        onChange={this.handleChanges}
                      />
                      <span className='text-danger'>
                        {this.state.errors?.companyMessageExecutiveError}
                      </span>
                    </FormGroup>
                  </div>
                </div>

                <FormGroup check>
                  <Input type='checkbox' name='checkbox' onChange={this.handleCheckbox} />
                  <Label>
                    {' '}
                    I accept the{' '}
                    <a style={{ textDecoration: 'none' }} href='/'>
                      {' '}
                      terms and conditions{' '}
                    </a>
                  </Label>
                </FormGroup>
                <span className='text-danger'>{this.state.errors?.Checkbox}</span>
                <FormGroup className='mt-3' style={{ textAlign: 'right' }}>
                  {this.props.formLoader ? (
                    <Button className='btn btn-primary px-5' disabled>
                      <LoaderContainer
                        type={'Circles'}
                        color={'white'}
                        height={15}
                        width={15}
                        visible={true}
                      ></LoaderContainer>
                    </Button>
                  ) : (
                    <Button type='submit' className='btn btn-primary px-5'>
                      Register
                    </Button>
                  )}
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
