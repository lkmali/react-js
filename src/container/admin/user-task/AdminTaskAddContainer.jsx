import { Component } from 'react'
import { RiMapPinFill } from 'react-icons/ri'
import Select from 'react-select'
import { Button, Col, Modal, Row } from 'reactstrap'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import DatePickerContainer from '../../../components/datetimepicker/DatePicker'
import { SelectLatLng } from '../../../googleMap/MarkerWithPath'
import { errorMessage } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import LoaderContainer from '../../loader/Loader'
export default class AdminFormAddContainer extends Component {
  constructor(props) {
    super(props)
    // const formId = this.props.match.params?.id
    this.state = {
      show: false,
      modalData: null,
      isValidForm: true,
      errors: {},
      showMap: false,
    }
    this.handleChanges = this.handleChanges.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
  }

  handleFormFiledTabVisible = () => {
    this.props.handleFormFiledTabVisible()
  }
  handleCreateForm = () => {
    this.props.handleCreateForm()
  }
  getValue = (opts, val) => (opts && opts.length ? opts.find((o) => o.value === val) : null)
  handleShow = (key) => {
    // const { state } = this.props;
    this.setState({ show: true, sequence: key.sequence })
  }
  handleClose = () => {
    this.setState({ show: false, modalData: null })
  }
  handleActiveTab = (tab) => {
    this.props.handleActiveTab(tab)
  }
  onSelectClone = (id) => {
    this.props.onSelectClone(id)
    this.setState({ show: false, modalData: null })
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
  handleBack = () => {
    this.props.navigate(-1)
  }
  handleStatus = () => {
    let { inputValues, handleStatus } = this.props
    confirmAlert({
      message: 'Are you sure you want to change task status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleStatus(inputValues.id, inputValues.isActive),
        },
        {
          label: 'No',
        },
      ],
    })
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
  handelMap = (name) => {
    const { showMap } = this.state
    this.setState({ showMap: !showMap })
  }
  render() {
    const {
      formDropDown,
      userDropDown,
      projectDropDown,
      inputValues,
      navigate,
      isUpsert,
      taskId,
      getFormList,
    } = this.props
    const { errors, showMap } = this.state
    const endDate = inputValues?.endDate ? new Date(inputValues.endDate) : new Date()
    const startDate = inputValues?.startDate ? new Date(inputValues.startDate) : new Date()
    return (
      <>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Project Name</label>
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
              isDisabled={isUpsert}
              onChange={(e) => {
                this.handleChanges(e, 'projectId', false)
                this.handleChanges(null, 'projectFormIds', null, true)
                getFormList(e.value)
              }}
            />
          </div>
          <span className='text-danger'>{errors.projectIdError}</span>
        </div>
        {!isUpsert ? (
          <>
            <div className='col-sm-12 mt-2'>
              <div className='form-group'>
                <label>Project Form</label>
                <Select
                  name='projectFormIds'
                  closeOnSelect={false}
                  // key={inputValues?.projectFormIds}
                  // defaultValue={this.getValue(formDropDown, inputValues?.projectFormIds)}
                  value={
                    inputValues?.projectFormIds
                      ? this.getValue(formDropDown, inputValues?.projectFormIds)
                      : null
                  }
                  isSearchable
                  // getOptionLabel={(x) => x.label}
                  // getOptionValue={(x) => x.value}
                  noOptionsMessage={() => 'No project found...'}
                  isMulti
                  // isClearable={true}
                  // filter Options={this.handleFilter}
                  options={formDropDown}
                  onChange={(e) => {
                    this.handleChanges(e, 'projectFormIds', true)
                  }}
                  placeholder='Select project form Type'
                />
                <span className='text-danger'>{errors.projectFormIds}</span>
              </div>
            </div>
            {/* <div className='col-sm-12 mt-2'>
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
            </div> */}
          </>
        ) : (
          ''
        )}
        <div className='col-sm-12 mt-2'>
          <div className='row'>
            <div className='col-sm-6'>
              <label>Priority</label>
              <Select
                name='priority'
                isDisabled={inputValues?.status != 0}
                closeOnSelect={true}
                filterOptions={this.handleFilter}
                value={this.getValue(
                  [
                    { label: 'Select priority level', value: null },
                    { label: 'low', value: parseInt(0) },
                    { label: 'medium', value: 1 },
                    { label: 'high', value: 2 },
                  ],
                  inputValues?.priority,
                )}
                // onBlur={e => this.handleBlur(e.target.value, 'priority')}
                onChange={(e) => this.handleChanges(e, 'priority')}
                options={[
                  { label: 'Select priority level', value: null },
                  { label: 'low', value: parseInt(0) },
                  { label: 'medium', value: 1 },
                  { label: 'high', value: 2 },
                ]}
                placeholder='Select priority level'
              />
            </div>
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Task Name</label>
            <input
              type='text'
              name='name'
              disabled
              placeholder='Enter task name'
              value={inputValues?.name}
              className={'form-control'}
              onChange={this.handleChanges}
              onBlur={this.handleBlur}
              // onKeyUp={handleBlur}
            />
            <span className='text-danger'>{errors?.nameError}</span>
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Task Description</label>
            <input
              type='text'
              name='description'
              disabled
              placeholder='Enter task description'
              value={inputValues?.description}
              className={'form-control'}
              onChange={this.handleChanges}
              onBlur={this.handleBlur}
              // onKeyUp={handleBlur}
            />
            <span className='text-danger'>{errors?.descriptionError}</span>
          </div>
        </div>

        <div className='row mt-2'>
          <label>Task Address</label>
          <div className='form-group col-sm-12' style={{ display: 'flex' }}>
            <input
              type='text'
              name='taskAddress'
              disabled={inputValues?.status != 0}
              placeholder='Enter task address'
              value={inputValues?.taskAddress}
              className={'form-control me-3'}
              onChange={this.handleChanges}
              onBlur={this.handleBlur}
            />
            <Button
              disabled={inputValues?.status != 0}
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
          {showMap ? (
            <Modal isOpen={showMap} size={'xl'} backdrop='static'>
              <Row>
                <Col md={12}>
                  <SelectLatLng
                    handelMap={this.handelMap}
                    clickedLatLng={{ lat: inputValues?.latitude, lng: inputValues?.longitude }}
                    handleChanges={this.handleChanges}
                  />
                </Col>
              </Row>
            </Modal>
          ) : (
            ''
          )}
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
        <div className='col-sm-12 mt-2'>
          <div className='row'>
            {startDate && (
              <div className='col-sm-6'>
                <label>Start Date</label>
                <DatePickerContainer
                  startDate={startDate}
                  disabled
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
                  disabled
                  startDate={endDate}
                  handleDate={(e) => this.handleChanges(e, 'endDate', null, true)}
                  onBlur={(e) => this.handleBlur(e, 'endDate')}
                ></DatePickerContainer>
                <span className='text-danger'>{errors?.endDateError}</span>
              </div>
            )}
          </div>
        </div>
        <div className='form-group col-sm-6'>
          <label>Task Complete Duration In Day</label>
          <input
            type='number'
            disabled={inputValues?.status != 0}
            name='taskCompleteDurationInDay'
            placeholder='taskCompleteDurationInDay'
            value={
              inputValues?.taskCompleteDurationInDay && inputValues?.taskCompleteDurationInDay > 0
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
              disabled={inputValues?.status != 0}
            >
              {`${isUpsert ? 'Update' : 'Save'}`}
            </button>
          )}
          <button
            className='btn btn-primary px-5 me-3'
            onClick={this.handleBack}
            style={{ color: 'white' }}
          >
            Cancel
          </button>
          {/* {isUpsert ? (
            this.props?.taskStatusLoader ? (
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
                onClick={this.handleStatus}
                type='button'
                className='btn btn-primary px-5 me-3'
              >
                {`${inputValues.isActive ? 'Deactive' : 'Reactive'}`}
              </button>
            )
          ) : (
            ''
          )} */}
        </div>

        {/* {isUpsert ? (
          <div
            className='col-sm-6 px-2'
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              className='btn btn-primary px-5 mb-5'
              onClick={(e) => {
                navigate(`/home/user-task/${taskId}/view-users`)
              }}
            >
              View Users
            </button>
            <button
              className='btn btn-primary px-5 mt-5'
              onClick={() =>
                navigate(`/home/task/${taskId}/forms`, {
                  state: { projectId: inputValues?.projectId },
                })
              }
            >
              View Forms
            </button>
          </div>
        ) : (
          ''
        )} */}
      </>
    )
  }
}
