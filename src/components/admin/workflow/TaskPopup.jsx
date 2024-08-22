import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import { RiMapPinFill } from 'react-icons/ri'
import Select from 'react-select'
import { Button } from 'reactstrap'
import LoaderContainer from '../../../container/loader/Loader'
import { SelectLatLng } from '../../../googleMap/MarkerWithPath'
import { errorMessage } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'

export default class AdminCopyTaskPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalData: null,
      isValidForm: true,
      errors: {},
      showMap: false,
    }
    this.handleChanges = this.handleChanges.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getValue = (opts, val) => (opts && opts.length ? opts.find((o) => o.value === val) : null)

  handelMap = (name) => {
    const { showMap } = this.state
    this.setState({ showMap: !showMap })
  }

  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return items
      }
      const updatedItems = items.filter((list) => {
        return list?.name.toLowerCase().includes(searchValue.toLowerCase())
      })
      return updatedItems
    }
  }
  handleBlur = (event, filedName) => {
    const { inputValues } = this.props
    let name = ''
    let value = ''
    if (filedName) {
      name = filedName
      value = event
    } else {
      name = event.target.name
      value = event.target.value
    }
    if (!inputValues[name]) {
      this.setError(name + 'Error', errorMessage[[name] + 'Empty'])
    } else {
      this.setError(name + 'Error', '')
    }
  }
  setError = (key, value) => {
    const { errors } = this.state
    errors[key] = value
    this.setState((prevState) => ({ ...prevState, errors }))
  }
  handleSubmit = (event) => {
    let { inputValues, handleSubmit } = this.props
    event.preventDefault()

    let required = [
      'workflowPosition',
      'longitude',
      'latitude',
      'taskCompleteDurationInDay',
      'userIds',
    ]
    const newErrors = {}
    required.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        newErrors[key + 'Error'] = 'field is empty'
      } else {
        if (inputValues[key] == null || inputValues[key] === '') {
          newErrors[key + 'Error'] = 'field is empty'
        } else if (
          key === 'taskCompleteDurationInDay' &&
          inputValues['taskCompleteDurationInDay'] <= 0
        ) {
          newErrors[key + 'Error'] = 'shuold be grater then 0'
        } else if (key === 'userIds' && !inputValues['userIds'].length) {
          newErrors[key + 'Error'] = 'user is required'
        } else {
          newErrors[key + 'Error'] = ''
        }
      }
    })

    this.setState({ errors: newErrors }, () => {
      if (Object.values(newErrors).some((value) => !!value)) {
        NotificationMessage.showError('Fill in all details or correct errors')
      } else {
        Object.keys(inputValues).forEach((key) => {
          if (key === 'taskCompleteDurationInDay') {
            inputValues[key] = parseInt(inputValues[key])
          }
          if (key === 'longitude' || key === 'latitude') {
            inputValues[key] =
              inputValues[key] && inputValues[key].toString()
                ? inputValues[key].toString()
                : inputValues[key]
          }
        })
        handleSubmit(inputValues)
      }
    })
  }

  handleChanges(event, filedName, multi, direct) {
    this.props.handleChanges(event, filedName, multi, direct)
  }
  render() {
    const { userDropDown, inputValues, dropDownVales, projectDropDown } = this.props
    const { errors, showMap } = this.state
    const { endDate, startDate } = inputValues || {}
    return (
      <>
        {showMap ? (
          <Modal show={showMap} size={'xl'} backdrop='static'>
            <Modal.Body>
              <SelectLatLng
                handelMap={this.handelMap}
                clickedLatLng={{ lat: inputValues?.latitude, lng: inputValues?.longitude }}
                handleChanges={this.handleChanges}
              />
            </Modal.Body>
          </Modal>
        ) : (
          ''
        )}
        <Modal
          show={this.props.modalShow}
          size={'lg'}
          backdrop='static'
          onHide={() => this.props.resetState(false)}
          centered
        >
          <div className='modal-header'>
            <h5 className='modal-title font-weight-bold'>Add Task</h5>
          </div>
          <Modal.Body>
            <div>
              {/* <div className='col-sm-12 mt-2'>
                <div className='form-group'>
                  <label>Project Name</label>
                  <input
                    type='text'
                    name='name'
                    disabled={true}
                    placeholder='Enter task name'
                    value={inputValues?.projectName}
                    className={'form-control'}
                  />
                </div>
              </div> */}
              <div className='col-sm-12 mt-2'>
                <div className='form-group'>
                  <label>Project Name :</label>
                  <Select
                    name='projectId'
                    key='projectId'
                    closeOnSelect={true}
                    search
                    filterOptions={this.handleFilter}
                    onBlur={(e) => this.handleBlur(e.target.value, 'projectId')}
                    options={projectDropDown}
                    value={this.getValue(projectDropDown, inputValues?.projectId)}
                    placeholder='Select Project'
                    isDisabled={true}
                    // onChange={(e) => {
                    //   this.props.handleChanges(e, 'projectId', false)
                    //   this.props.handleChanges(e, 'projectName', null, false, true)
                    //   // getFormList(e.value)
                    // }}
                  />
                </div>
                <span className='text-danger'>{errors.projectIdError}</span>
              </div>
              <div className='col-sm-12 mt-2'>
                <div className='form-group'>
                  <label>Task Name</label>
                  <input
                    type='text'
                    name='name'
                    placeholder='Enter task name'
                    value={inputValues?.name}
                    className={'form-control'}
                    disabled={true}

                    // onKeyUp={handleBlur}
                  />
                </div>
              </div>
              <div className='col-sm-12 mt-2'>
                <div className='form-group'>
                  <label>Task Description</label>
                  <input
                    type='text'
                    name='description'
                    placeholder='Enter task description'
                    value={inputValues?.description}
                    className={'form-control'}
                    disabled={true}
                  />
                </div>
              </div>

              <div className='row mt-2'>
                <label>Task Address</label>
                <div className='form-group col-sm-12' style={{ display: 'flex' }}>
                  <input
                    type='text'
                    name='taskAddress'
                    placeholder='Enter task address'
                    value={inputValues?.taskAddress}
                    className={'form-control me-3'}
                    onChange={this.handleChanges}
                    onBlur={this.handleBlur}
                  />
                  <Button
                    style={{ color: 'black', backgroundColor: 'white', fontSize: '20px' }}
                    className=''
                    onClick={(e) => {
                      this.handelMap('taskAddress')
                    }}
                    type='button'
                  >
                    <RiMapPinFill />
                  </Button>
                  <span className='text-danger'>{errors?.taskAddressError}</span>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='form-group col-sm-6'>
                  <label>latitude</label>
                  <input
                    type='text'
                    name='latitude'
                    disabled
                    placeholder='latitude'
                    value={inputValues?.latitude}
                    className={'form-control'}
                    onChange={this.handleChanges}
                    onBlur={this.handleBlur}
                    // onKeyUp={handleBlur}
                  />
                  <span className='text-danger'>{errors?.latitudeError}</span>
                </div>
                <div className='form-group col-sm-6'>
                  <label>longitude</label>
                  <input
                    type='text'
                    name='longitude'
                    disabled
                    placeholder='longitude'
                    value={inputValues?.longitude}
                    className={'form-control'}
                    onChange={this.handleChanges}
                    onBlur={this.handleBlur}
                  />
                  <span className='text-danger'>{errors?.longitudeError}</span>
                </div>
              </div>
              {/* <div className='col-sm-12 mt-2'>
                <div className='row'>
                  {startDate && (
                    <div className='col-sm-6'>
                      <label>Start Date</label>
                      <DatePickerContainer
                        startDate={startDate}
                        selectsStart
                        handleDate={(e) => this.handleChanges(e, 'startDate', null, true)}
                      // onBlur={(e) => this.handleBlur(e, 'startDate')}
                      ></DatePickerContainer>
                      <span className='text-danger'>{errors?.startDateError}</span>
                    </div>
                  )}
                  {endDate && (
                    <div className='col-sm-6'>
                      <label>End Date</label>
                      <DatePickerContainer
                        startDate={endDate}
                        handleDate={(e) => this.handleChanges(e, 'endDate', null, true)}
                        onBlur={(e) => this.handleBlur(e, 'endDate')}
                      ></DatePickerContainer>
                      <span className='text-danger'>{errors?.endDateError}</span>
                    </div>
                  )}
                </div>
              </div> */}
              <div className='form-group col-sm-6'>
                <label>Task Complete Duration In Day</label>
                <input
                  type='number'
                  name='taskCompleteDurationInDay'
                  placeholder='taskCompleteDurationInDay'
                  value={
                    inputValues?.taskCompleteDurationInDay &&
                    inputValues?.taskCompleteDurationInDay > 0
                      ? inputValues?.taskCompleteDurationInDay
                      : 0
                  }
                  className={'form-control'}
                  onChange={this.handleChanges}
                  onBlur={this.handleBlur}
                  min={0}
                />
                <span className='text-danger'>{errors?.longitudeError}</span>
              </div>
              <div className='col-sm-12 mt-2'>
                <div className='form-group'>
                  <label>Task Person</label>
                  <Select
                    name='userIds'
                    closeOnSelect={false}
                    value={this.getValue(userDropDown, inputValues?.userIds)}
                    defaultValue={[]}
                    isSearchable
                    noOptionsMessage={() => 'No match found...'}
                    isMulti
                    filterOptions={this.handleFilter}
                    options={userDropDown}
                    onChange={(e) => this.handleChanges(e, 'userIds', true)}
                    placeholder='Select users'
                  />
                  <span className='text-danger'>{errors.userIdsError}</span>
                </div>
              </div>
              <div className='col-sm-12 mt-2'>
                <div className='row'>
                  <div className='col-sm-6'>
                    <label>Workflow Position</label>
                    <Select
                      name='workflowPosition'
                      closeOnSelect={true}
                      filterOptions={this.handleFilter}
                      value={this.getValue(dropDownVales, inputValues?.workflowPosition)}
                      // onBlur={e => this.handleBlur(e.target.value, 'priority')}
                      onChange={(e) => this.handleChanges(e, 'workflowPosition')}
                      options={dropDownVales}
                      placeholder='Select workflowPosition '
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-12 col-sm-12 mt-4 text-center pb-3'>
                {this.props?.taskSubmissionLoader ? (
                  <button className='btn btn-primary px-5 me-3' disabled>
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
                    onClick={this.handleSubmit}
                    type='submit'
                    className='btn btn-primary px-5 me-3'
                  >
                    save
                  </button>
                )}
                <button
                  className='btn btn-primary px-5 me-3'
                  onClick={this.props.resetState}
                  style={{ color: 'white' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}
