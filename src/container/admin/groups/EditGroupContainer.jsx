import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { errorMessage, validateEmail } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import LoaderContainer from '../../loader/Loader'
const EditGroupContainer = (props) => {
  const [inputValues, setInputValues] = useState(props.inputValues)
  const [errors, setErrors] = useState({})

  const status = (groupId, isActiveGroup) => {
    const updateStatus = isActiveGroup ? 'inActive' : 'active'
    confirmAlert({
      message: isActiveGroup
        ? 'Are you sure you want to deactivate?'
        : 'Are you sure you want to activate?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            props.statusUpdate(groupId, updateStatus)
          },
        },
        {
          label: 'No',
        },
      ],
    })
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
    let required = ['name', 'description']
    required.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        setError(key + 'Error', 'filed is empty')
      } else {
        if (inputValues[key] == null || inputValues[key] === '') {
          setError(key + 'Error', 'filed is empty')
        } else {
          setError(key + 'Error', '')
        }
      }
    })
    if (Object.values(errors).every((value) => !!value)) {
      NotificationMessage.showError('fill all details')
    } else {
      props.handleSubmit(inputValues)
    }
  }
  const viewUserData = (e, property) => {
    e.preventDefault()
    props.navigate(`/home/groups/${props.groupId}/${property}`)
  }
  return (
    <div>
      <div className='row d-flex'>
        <div className='col-lg-5 col-sm-7'>
          <div className='col-sm-12 '>
            <div className='form-group'>
              <label> Group Name</label>
              <input
                type='text'
                name='name'
                value={inputValues?.name}
                className={'form-control'}
                placeholder='Enter Group name'
                onChange={handleChanges}
                onBlur={handleBlur}
                // onKeyUp={handleBlur}
              />
              <span className='text-danger'>{errors?.nameError}</span>
            </div>
          </div>
          <div className='col-sm-12 mt-2'>
            <div className='form-group'>
              <label>Group Description</label>
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
          <div className='col-md-12 col-sm-12 mt-4 text-center pb-3'>
            {props?.formSubmissionLoader ? (
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
              <button onClick={handleSubmit} type='submit' className='btn btn-primary px-5 me-5'>
                Update
              </button>
            )}
            {props?.statusLoader ? (
              <button className='btn btn-primary px-5 ms-5' disabled>
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
                onClick={() => status(inputValues.id, inputValues.isActive)}
                className='btn btn-primary px-5 ms-5'
                style={{ color: 'white' }}
              >
                {inputValues?.isActive ? 'Deactivate' : 'Reactivate'}
              </button>
            )}
          </div>
        </div>
        <div className='col-lg-7 col-sm-5' style={{ alignSelf: 'center' }}>
          <div className='btn-group-lg mt-4' style={{ textAlign: '-webkit-center' }}>
            <div className='mt-2'>
              <button
                className='btn btn-dark btn-lg d-block'
                onClick={(e) => viewUserData(e, 'add-users')}
              >
                Add User
              </button>
            </div>
            <div className='mt-2'>
              <button
                className='btn btn-dark btn-lg d-block'
                onClick={(e) => viewUserData(e, 'delete-users')}
              >
                Delete User
              </button>
            </div>
            <div className='mt-2'>
              <button
                className='btn btn-dark btn-lg d-block'
                onClick={(e) => viewUserData(e, 'projects')}
              >
                View Projects
              </button>
            </div>
            <div className='mt-2'>
              <button
                className='btn btn-dark btn-lg d-block'
                onClick={(e) => viewUserData(e, 'project-forms')}
              >
                View Forms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditGroupContainer
