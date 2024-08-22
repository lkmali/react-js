import { Component } from 'react'
import Select from 'react-select'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
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
    inputValues.isPublish
      ? 'published'
      : confirmAlert({
          message: 'Are you sure you want to pubish task template?',
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
    const { errors } = this.state
    let { inputValues, handleSubmit } = this.props
    event.preventDefault()
    let required = [
      'name',
      'description',
      'priority',
      'endDate',
      'startDate',
      'taskAcceptanceCriteria',
    ]
    required.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        this.setError(key + 'Error', 'filed is empty')
      } else {
        if (inputValues[key] == null || inputValues[key] === '') {
          this.setError(key + 'Error', 'filed is empty')
        } else if (key == 'endDate' && inputValues['endDate'] < inputValues['startDate']) {
          this.setError(key + 'Error', 'enddate should be grater then start date')
        } else {
          this.setError(key + 'Error', '')
        }
      }
    })
    if (Object.values(errors).every((value) => !!value)) {
      NotificationMessage.showError('fill all details')
    } else {
      // Object.keys(inputValues).forEach((key) => {
      //   if (key == 'longitude' || key == 'latitude') {
      //     inputValues[key] = inputValues[key].toString()
      //   }
      // })
      handleSubmit(inputValues)
    }
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
        {/* <div className='col-sm-12 mt-2'>
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
        </div> */}
        {!isUpsert ? (
          <>
            <div className='col-sm-12 mt-2'>
              <div className='form-group'>
                <label>Project Form</label>
                <Select
                  name='projectFormId'
                  closeOnSelect={false}
                  // key={inputValues?.projectFormIds}
                  // defaultValue={this.getValue(formDropDown, inputValues?.projectFormId)}
                  value={
                    inputValues?.projectFormId
                    // ? this.getValue(formDropDown, inputValues?.projectFormId)
                    // : null
                  }
                  isSearchable
                  // getOptionLabel={(x) => x.label}
                  // getOptionValue={(x) => x.value}
                  noOptionsMessage={() => 'No project found...'}
                  // isMulti
                  // isClearable={true}
                  // filter Options={this.handleFilter}
                  options={formDropDown}
                  onChange={(e) => {
                    this.handleChanges(e, 'projectFormId', false, true)
                  }}
                  placeholder='Select project form Type'
                />
                <span className='text-danger'>{errors.projectFormId}</span>
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
        {/* <div className='col-sm-12 mt-2'>
          <div className='row'>
            <div className='col-sm-6'>
              <label>Priority</label>
              <Select
                name='priority'
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
        </div> */}
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Task Name</label>
            <input
              type='text'
              name='name'
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
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Acceptance Criteria</label>
            <input
              type='text'
              name='taskAcceptanceCriteria'
              placeholder='Enter task scceptance criteria'
              value={inputValues?.taskAcceptanceCriteria}
              className={'form-control'}
              onChange={this.handleChanges}
              onBlur={this.handleBlur}
              // onKeyUp={handleBlur}
            />
            <span className='text-danger'>{errors?.taskAcceptanceCriteriaError}</span>
          </div>
        </div>
        {/* <div className='row mt-2'>
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
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 col-sm-12 mt-4 text-center pb-3'>
              {this.props?.taskSubmissionLoader ? (
                <button className='btn btn-primary px-3   me-2 my-3' disabled>
                  <LoaderContainer
                    type={'Circles'}
                    color={'white'}
                    height={15}
                    width={15}
                    visible={true}
                  ></LoaderContainer>
                </button>
              ) : !inputValues.isPublish ? (
                <button
                  onClick={this.handleSubmit}
                  type='submit'
                  className='my-3 btn btn-primary px-3 me-2'
                >
                  {`${isUpsert ? 'Update' : 'Save'}`}
                </button>
              ) : (
                ''
              )}
              <button
                className='btn btn-primary px-3   me-2 my-3'
                onClick={this.handleBack}
                style={{ color: 'white' }}
              >
                Cancel
              </button>
              {isUpsert ? (
                this.props?.taskStatusLoader ? (
                  <button className='my-3 btn btn-primary px-3  me-2' disabled>
                    <LoaderContainer
                      type={'Circles'}
                      color={'white'}
                      height={15}
                      width={15}
                      visible={true}
                    ></LoaderContainer>
                  </button>
                ) : !inputValues.isPublish ? (
                  <>
                    <button
                      onClick={this.handleStatus}
                      type='button'
                      style={inputValues.isPublish ? { backgroundColor: 'gray !important' } : {}}
                      className='my-3 btn btn-primary px-3  me-2'
                    >
                      {`${'publish'}`}
                    </button>
                  </>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
            </div>
          </div>
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
                navigate(`/home/task-template/${taskId}/view-users`)
              }}
            >
              View Users
            </button>
            <button
              className='btn btn-primary px-5 mt-5'
              onClick={() =>
                navigate(`/home/task-template/${taskId}/forms`, {
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
