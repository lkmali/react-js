import { Component } from 'react'
import AdminFormDetailsAddComponent from '../../../components/admin/forms/AdminFormDetailsAddComponent'
import { errorMessage, validateName } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
export default class AdminFormDetailsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      isValidForm: true,
    }
    this.handleChanges = this.handleChanges.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleCreateForm = this.handleCreateForm.bind(this)
  }
  handleChanges(event, filedName) {
    if (this.props?.state?.isPublished) {
      return
    }
    let name = ''
    let inputValues = this.props.inputValues
    if (filedName) {
      name = filedName
      inputValues[name] = event
    } else {
      event.preventDefault()
      name = event.target.name
      inputValues[name] = event.target.value
    }
    this.setState((prevState) => ({
      ...prevState,
      inputValues,
    }))
  }
  setErrors = (key, value) => {
    let errors = this.state.errors
    errors[key] = value
    this.setState({ errors })
  }
  handleBlur = (event, filedName) => {
    let name = ''
    let value = ''
    if (filedName) {
      name = filedName
      value = event
    } else {
      name = event.target.name
      value = event.target.value
    }
    if (name === 'name') {
      if (!this.props.inputValues.name) {
        this.setState({ isValidForm: false })
        this.setErrors('nameError', errorMessage.formName)
      } else if (!validateName(value)) {
        this.setState({ isValidForm: false })
        this.setErrors('nameError', errorMessage.projectNameFormat)
      }
      //  else {
      //   this.state.isValidForm = true;
      //   this.setErrors('nameError', '')
      // }
    } else {
      if (!this.props.inputValues[name]) {
        this.setState({ isValidForm: false })
        this.setErrors(name + 'Error', errorMessage[[name] + 'Empty'])
      } else {
        this.setState({ isValidForm: true })
        this.setErrors(name + 'Error', '')
      }
    }
  }
  handleCreateForm = async (event, isUpsert) => {
    event.preventDefault()
    if (this.props?.state?.isPublished) {
      return
    }
    let required = ['formName', 'projectName', 'formDescription']
    const inputValues = this.props.inputValues
    required.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        this.setState({ isValidForm: false })
        this.setErrors(key + 'Error', `Missing field ${key}`)
      } else {
        if (inputValues[key] == null || inputValues[key] === '') {
          this.setState({ isValidForm: false })
          this.setErrors(key + 'Error', 'filed is empty')
        } else {
          this.setState({ isValidForm: true })
          this.setErrors(key + 'Error', '')
        }
      }
    })
    if (!this.state.isValidForm) {
      NotificationMessage.showError('fill all details')
    } else {
      let payload = this.props.inputValues
      const requestObject = {
        name: payload.formName,
        projectId: payload.projectName,
        description: payload?.formDescription,
        groups: [],
      }
      this.props.handleCreateForm(requestObject, isUpsert)
    }
  }

  render() {
    return (
      <AdminFormDetailsAddComponent
        state={this.props.state}
        {...this.props}
        {...this.state}
        internalState={this.state}
        navigate={this.props.navigate}
        projectDropDown={this.props.projects}
        handleCreateForm={this.handleCreateForm}
        handleChanges={this.handleChanges}
        handleBlur={this.handleBlur}
        setErrors={this.setErrors}
      ></AdminFormDetailsAddComponent>
    )
  }
}
