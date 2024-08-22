import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import SelectSearch from 'react-select-search'
import DatePickerContainer from '../../../../components/datetimepicker/DatePicker'
import { errorMessage, validateEmail } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
import LoaderContainer from '../../../loader/Loader'
const AdminProjectViewContainer = (props) => {
  const [inputValues, setInputValues] = useState(props.inputValues)
  const [errors, setErrors] = useState({})
  const userLoader = props.userLoader
  const handleBack = () => {
    props.navigate(-1)
  }
  const handleFilter = (items) => {
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

  const setError = (key, value) => {
    errors[key] = value
    setErrors((prevState) => ({ ...prevState, errors }))
  }

  const handleBlur = (event, filedName) => {
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
    if (name === 'email') {
      if (!inputValues.email) {
        setError('emailError', errorMessage.emailEmpty)
      } else if (!validateEmail(value)) {
        setError('emailError', errorMessage.emailFormat)
      } else {
        setError('emailError', '')
      }
    } else {
      if (!inputValues[name]) {
        setError(name + 'Error', errorMessage[[name] + 'Empty'])
      } else {
        setError(name + 'Error', '')
      }
    }
  }

  const handleChanges = (event, filedName) => {
    let name = ''
    if (filedName) {
      name = filedName
      inputValues[name] = event
    } else {
      name = event.target.name
      inputValues[name] = event.target.value
    }
    setInputValues((prevState) => ({
      ...prevState,
      inputValues,
    }))
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    let required = ['name', 'description', 'projectOwnerId', 'priority', 'endDate', 'startDate']
    let newErrors = {}
    required.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        newErrors = {
          ...newErrors,
          [key + 'Error']: `Missing field ${key}`,
        }
      } else if (inputValues[key] == null || inputValues[key] === '') {
        newErrors = {
          ...newErrors,
          [key + 'Error']: 'field is empty',
        }
      }
    })
    setErrors(newErrors)
    if (Object.values(newErrors).some((value) => !!value)) {
      NotificationMessage.showError('fill all details')
    } else {
      const userDetail = props?.userDropDown.find((x) => inputValues.projectOwnerId === x.value)
      inputValues.projectOwnerId = userDetail.email
      setInputValues((prevState) => ({
        ...prevState,
        inputValues,
      }))
      props.handleSubmit(inputValues)
    }
  }
  const handleStatus = (e) => {
    e.preventDefault()
    props.handleStatus(inputValues)
  }
  const endDate = inputValues?.endDate ? new Date(inputValues.endDate) : null
  const startDate = inputValues?.startDate ? new Date(inputValues.startDate) : null
  const loaderProperty = {
    type: 'Circles',
    height: 100,
    width: 100,
    color: '#186881',
    visible: true,
  }
  return (
    <div className='row'>
      {userLoader ? <LoaderContainer {...loaderProperty}></LoaderContainer> : ''}
      <div className='col-sm-6 border  card border-info box-shadow rounded px-2'>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Project Name</label>
            <input
              type='text'
              name='name'
              value={inputValues?.name}
              className={'form-control'}
              placeholder='Enter project name'
              onChange={handleChanges}
              onBlur={handleBlur}
              // onKeyUp={handleBlur}
            />
            <span className='text-danger'>{errors?.nameError}</span>
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Project Description</label>
            <input
              type='text'
              name='description'
              placeholder='Enter project description'
              value={inputValues?.description}
              className={'form-control'}
              onChange={handleChanges}
              onBlur={handleBlur}
              // onKeyUp={handleBlur}
            />
            <span className='text-danger'>{errors?.descriptionError}</span>
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Project Owner</label>
            <SelectSearch
              name='projectOwner'
              closeOnSelect={true}
              filterOptions={handleFilter}
              onBlur={(e) => handleBlur(e.target.value, 'projectOwnerId')}
              onChange={(e) => handleChanges(e, 'projectOwnerId')}
              options={props?.userDropDown}
              value={inputValues?.projectOwnerId}
              placeholder='Select Owner'
            />
            <span className='text-danger'>{errors?.projectOwnerError}</span>
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='row'>
            {startDate && (
              <div className='col-sm-6'>
                <label>Start Date</label>
                <DatePickerContainer
                  startDate={startDate}
                  // handleDate={(e) => handleChanges(e, 'startDate')}
                  // onBlur={(e) => handleBlur(e, 'startDate')}
                ></DatePickerContainer>
                <span className='text-danger'>{errors?.startDateError}</span>
              </div>
            )}
            {endDate && (
              <div className='col-sm-6'>
                <label>End Date</label>

                <DatePickerContainer
                  startDate={endDate}
                  handleDate={(e) => handleChanges(e, 'endDate')}
                  onBlur={(e) => handleBlur(e, 'endDate')}
                ></DatePickerContainer>
                <span className='text-danger'>{errors?.endDateError}</span>
              </div>
            )}
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='row'>
            <div className='col-sm-6'>
              <label>Priority</label>
              <SelectSearch
                name='priority'
                closeOnSelect={true}
                filterOptions={handleFilter}
                // onBlur={e => handleBlur(e.target.value, 'priority')}
                onChange={(e) => handleChanges(e, 'priority')}
                options={[
                  { name: 'Select priority level', value: null },
                  { name: 'low', value: parseInt(0) },
                  { name: 'medium', value: 1 },
                  { name: 'high', value: 2 },
                ]}
                value={inputValues?.priority}
                placeholder='Select priority level'
              />
              <span className='text-danger'>{errors?.priorityError}</span>
              {/* <select name="priority" value={inputValues?.priority} className={`form-control`} >
                            <option defaultValue value="">Select Priority</option>
                            {
                                [{ label: 'low', value: 0 }, { label: 'medium', value: 1 }, { label: 'high', value: 2 }].map((item, i) => {
                                    return <option key={i} value={item.value}>{item ? item.label.charAt(0).toUpperCase() + item.label.slice(1) : ''}</option>
                                })
                            }
                        </select> */}
            </div>
          </div>
        </div>
        <div className='col-md-12 col-sm-12 mt-4 text-center pb-3'>
          {props?.formSubmissionLoader ? (
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
            <button onClick={handleSubmit} type='submit' className='btn btn-primary px-5 me-3'>
              Update
            </button>
          )}
          <button
            className='btn btn-primary px-5 me-3'
            onClick={handleBack}
            style={{ color: 'white' }}
          >
            Cancel
          </button>
          {props?.statusLoader ? (
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
              onClick={handleStatus}
              className='btn btn-primary px-5 me-3'
              style={{ color: 'white' }}
            >
              {inputValues?.isActive ? 'Deactivate' : 'Reactivate'}
            </button>
          )}
        </div>
      </div>
      <div
        className='col-sm-6 px-2'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <button
          className='btn btn-primary px-5 me-3'
          onClick={() =>
            props.navigate('/home/task/create', { state: { projectId: props.projectId } })
          }
        >
          Create Task
        </button>
        <button
          className='btn btn-primary px-5 me-3'
          onClick={() =>
            props.navigate('/home/task', {
              state: { search: inputValues?.name, searchBy: 'projectName' },
            })
          }
        >
          View Task
        </button>
        <button
          className='btn btn-primary px-5 me-3'
          onClick={() =>
            props.navigate('/home/forms/create', { state: { projectId: props.projectId } })
          }
        >
          Create Form
        </button>
        <button
          className='btn btn-primary px-5 me-3'
          onClick={() =>
            props.navigate('/home/forms', {
              state: { search: inputValues?.name, searchBy: 'formName' },
            })
          }
        >
          View Form
        </button>
      </div>
    </div>
  )
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  const location = useLocation()
  return <AdminProjectViewContainer {...props} navigate={navigate} params={params} />
}

export default WithNavigate
