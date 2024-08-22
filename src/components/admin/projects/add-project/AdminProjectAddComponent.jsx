import { Component } from 'react'
import { Modal } from 'react-bootstrap'
import SelectSearch from 'react-select-search'
import LoaderContainer from '../../../../container/loader/Loader'
import { errorMessage, validateName } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
import DatePickerContainer from '../../../datetimepicker/DatePicker'
import './Add.css'
export default class AdminProjectAddComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      inputValues: {},
      isValidForm: true,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChanges = this.handleChanges.bind(this)
  }

  setErrors = (key, value) => {
    let errors = this.state.errors
    errors[key] = value
    this.setState({ errors })
  }
  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return items
      }
      const updatedItems = items.filter((list) => {
        // const newItems = list?.items.filter((item) => {
        return list?.name.toLowerCase().includes(searchValue.toLowerCase())
        // });
        // return { ...list, items: newItems };
      })
      return updatedItems
    }
  }
  handleChanges(event, filedName) {
    let name = ''
    let inputValues = this.state.inputValues
    if (filedName) {
      name = filedName
      inputValues[name] = event
    } else {
      name = event.target.name
      inputValues[name] = event.target.value
    }
    this.setState((prevState) => ({
      ...prevState,
      inputValues,
    }))
  }

  handleSubmit(event) {
    event.preventDefault()
    let required = ['name', 'description', 'projectOwner', 'priority', 'endDate', 'startDate']
    const inputValues = this.state.inputValues
    let isValidForm = true
    let errors = {}
    required.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        isValidForm = false
        errors[key + 'Error'] = `Missing field ${key}`
      } else {
        if (inputValues[key] == null || inputValues[key] === '') {
          isValidForm = false
          errors[key + 'Error'] = 'Field is empty'
        }
      }
    })
    this.setState({ isValidForm, errors })
    if (!isValidForm) {
      NotificationMessage.showError('Fill All Details')
    } else {
      this.props.handleSubmit(this.state.inputValues)
    }
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
    // ["name", "description", "projectOwner", "priority", "endDate", "startDate"]
    if (name === 'name') {
      if (!this.state.inputValues.name) {
        this.setState({ isValidForm: false })
        this.setErrors('nameError', errorMessage.nameEmpty)
      } else if (!validateName(value)) {
        this.setState({ isValidForm: false })
        this.setErrors('nameError', errorMessage.projectNameFormat)
      } else {
        this.setState({ isValidForm: true })
        this.setErrors('nameError', '')
      }
    }
    // if (name === 'email') {
    //   if (!this.state.inputValues.email) {
    //     this.setErrors('emailError', errorMessage.emailEmpty)
    //   } else if (!Validator.validateEmail(value)) {
    //     this.setErrors('emailError', errorMessage.emailFormat)
    //   } else {
    //     this.setErrors('emailError', '')
    //   }
    // }
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
    const { userLoader } = this.props
    return (
      <Modal show={this.props.modalShow} backdrop='static' centered>
        <div className='modal-header'>
          <h5 className='modal-title font-weight-bold'>Add New Project</h5>
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
          {userLoader ? (
            <LoaderContainer {...loaderProperty}></LoaderContainer>
          ) : (
            <form>
              <div className='row'>
                <div className='col-sm-12'>
                  <div className='col-sm-12'>
                    <div className='form-group'>
                      <label>Project Name</label>
                      <input
                        type='text'
                        name='name'
                        value={this.state.inputValues.name}
                        className={'form-control'}
                        placeholder='Enter project name'
                        onChange={this.handleChanges}
                        onBlur={this.handleBlur}
                      />
                      <span className='text-danger'>{this.state.errors?.nameError}</span>
                    </div>
                  </div>
                  <div className='col-sm-12 mt-2'>
                    <div className='form-group'>
                      <label>Project Description</label>
                      <input
                        type='text'
                        name='description'
                        placeholder='Enter project description'
                        value={this.state.inputValues.description}
                        className={'form-control'}
                        onChange={this.handleChanges}
                        onBlur={this.handleBlur}
                      />
                      <span className='text-danger'>{this.state.errors?.descriptionError}</span>
                    </div>
                  </div>
                  <div className='col-sm-12 mt-2'>
                    <div className='form-group'>
                      <label>Project Owner</label>
                      {/* <input type="text"
                                                name="projectOwner"
                                                placeholder="Enter project owner"
                                                value={this.state.inputValues.projectOwner}
                                                className={`form-control`}
                                                onChange={this.handleChanges}
                                                onBlur={this.handleBlur}
                                            /> */}
                      <SelectSearch
                        name='projectOwner'
                        closeOnSelect={true}
                        search
                        filterOptions={this.handleFilter}
                        onBlur={(e) => this.handleBlur(e.target.value, 'projectOwner')}
                        options={this?.props?.userDropDown}
                        value={this?.state?.inputValues?.projectOwner}
                        placeholder='Select Owner'
                        onChange={(e) => this.handleChanges(e, 'projectOwner')}
                      />
                      <span className='text-danger'>{this.state.errors?.projectOwnerError}</span>
                    </div>
                  </div>
                  <div className='col-sm-12 mt-2'>
                    <div className='row'>
                      <div className='col-sm-6'>
                        <label>Start Date</label>
                        <DatePickerContainer
                          startDate={this.state?.inputValues?.startDate}
                          handleDate={(e) => this.handleChanges(e, 'startDate')}
                          onBlur={(e) => this.handleBlur(e, 'startDate')}
                        ></DatePickerContainer>
                        <span className='text-danger'>{this.state.errors?.startDateError}</span>
                      </div>
                      <div className='col-sm-6'>
                        <label>End Date</label>
                        <DatePickerContainer
                          startDate={this.state?.inputValues?.endDate}
                          handleDate={(e) => this.handleChanges(e, 'endDate')}
                          onBlur={(e) => this.handleBlur(e, 'endDate')}
                        ></DatePickerContainer>
                        <span className='text-danger'>{this.state.errors?.endDateError}</span>
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-12 mt-2'>
                    <div className='row'>
                      <div className='col-sm-6'>
                        <label>Priority</label>
                        <SelectSearch
                          name='priority'
                          closeOnSelect={true}
                          filterOptions={this.handleFilter}
                          onBlur={(e) => this.handleBlur(e.target.value, 'priority')}
                          options={[
                            { name: 'Select priority level', value: null },
                            { name: 'low', value: 1 },
                            { name: 'medium', value: 2 },
                            { name: 'high', value: 3 },
                          ]}
                          value={this?.state?.inputValues?.priority}
                          placeholder='Select priority level'
                          onChange={(e) => this.handleChanges(e, 'priority')}
                        />
                        {/* <select name="priority" value={this.state.inputValues.priority} className={`form-control `} onChange={this.handleChanges} onBlur={this.handleBlur}>
                                                    <option defaultValue value="">Select Priority</option>
                                                    {
                                                        [{ label: 'low', value: 0 }, { label: 'medium', value: 1 }, { label: 'high', value: 2 }].map((item, i) => {
                                                            return <option key={i} value={item.value}>{item ? item.label.charAt(0).toUpperCase() + item.label.slice(1) : ''}</option>
                                                        })
                                                    }
                                                </select> */}
                        <span className='text-danger'>{this.state.errors?.priorityError}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-4'>
                <div className='col-sm-12'>
                  <div className='col-sm-12'>
                    <div className='row '>
                      <div className='col-md-12 text-center'>
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
                          <button onClick={this.handleSubmit} className='btn btn-primary px-5 me-5'>
                            Create
                          </button>
                        )}
                        <button
                          onClick={() => {
                            this.props.resetState(true)
                          }}
                          className='btn btn-primary px-5 '
                          style={{ color: 'white' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    )
  }
}
