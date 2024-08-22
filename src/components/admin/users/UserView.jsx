import { useState } from 'react'
import AvatarPicker from '../../../container/avatar-picker/avatarPicker'
import LoaderContainer from '../../../container/loader/Loader'
import { errorMessage } from '../../../helper'
const ProfileComponent = (props) => {
  const updateInputValues = props.updateInputValues
  const inputValues = props.inputValues
  const navigate = props.navigate
  const userId = props.userId
  const [errors, setErrors] = useState({})
  const [buttonDisable, setButtonDisable] = useState(true)
  const [checkBoxChecked, setCheckBoxChecked] = useState(false)
  const handleChange = (event) => {
    setButtonDisable(false)
    updateInputValues({ inputFields: { ...inputValues, [event.target.name]: event.target.value } })
  }
  const uploadFile = (e) => {
    updateInputValues({ inputFields: { ...inputValues, image: e } })
  }
  const handleCheckbox = () => {
    if (!checkBoxChecked) {
      setError('Checkbox', '')
    }
    setCheckBoxChecked(!checkBoxChecked)
  }

  const handleBlur = () => {
    // const target = event.target;
  }

  const viewUserData = (e, property) => {
    e.preventDefault()
    navigate(`/home/users/${userId}/${property}`)
  }

  const setError = (key, value) => {
    errors[key] = value
    setErrors((prevState) => ({ ...prevState, errors }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (buttonDisable) {
      return
    }
    if (!checkBoxChecked) {
      // NotificationMessage.showError('please check check box');
      setError('Checkbox', errorMessage.checkBox)
      return
    }
    props.handleSubmit(inputValues)
  }
  const handleStatus = (e) => {
    e.preventDefault()
    props.handleStatus(inputValues)
  }

  return (
    <div>
      <div className='row d-flex'>
        <div className='col-lg-5 col-sm-7'>
          <form>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <div className='form-group'>
                  <label>Full Name</label>
                  <input
                    type='text'
                    name='username'
                    value={inputValues?.username}
                    className={'form-control'}
                    placeholder='Full name'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <div className='form-group'>
                  <label>Email Address</label>
                  <input
                    type='email'
                    name='email'
                    value={inputValues?.email}
                    className={'form-control'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <div className='form-group'>
                  <label>Phone Number</label>
                  <input
                    type='tel'
                    name='phone'
                    value={inputValues?.phone}
                    className={'form-control'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <div className='form-group'>
                  <label>Address</label>
                  <textarea
                    name='address'
                    className='form-control'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={inputValues?.address}
                    cols={30}
                    rows={2}
                    placeholder='Enter Address'
                  />
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-3'>
                <div className='form-group'>
                  <label>City</label>
                  <input
                    type='text'
                    name='city'
                    className={'form-control'}
                    value={inputValues?.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='form-group'>
                  <label>State</label>
                  <input
                    type='text'
                    name='state'
                    value={inputValues?.state}
                    className={'form-control'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='form-group'>
                  <label>Country</label>
                  <input
                    type='text'
                    name='country'
                    value={inputValues?.country}
                    className={'form-control'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='form-group'>
                  <label>Pincode</label>
                  <input
                    type='text'
                    name='pinCode'
                    value={inputValues?.pinCode}
                    className={'form-control'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <div className='form-group'>
                  <label>Organization</label>
                  <input
                    type='text'
                    name='org'
                    value={inputValues?.org}
                    className={'form-control'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <label>
                  <span className='row'>
                    <span className='col-5 role-label'>
                      {props.roleLoader ? 'Fetching Your role' : 'Role'}
                    </span>
                    <span className='col-7 row-loader' style={{ paddingLeft: '0px' }}>
                      <LoaderContainer
                        type={'Circles'}
                        className='role-loader'
                        color={'#186881'}
                        height={15}
                        width={15}
                        visible={props.roleLoader}
                      ></LoaderContainer>
                    </span>
                  </span>
                </label>
                <select
                  disabled={props.roleLoader}
                  name='role'
                  value={inputValues?.role}
                  className={`form-control custom-select ${errors.roleError ? 'is-invalid' : ''}`}
                  onChange={handleChange}
                >
                  <option defaultValue value=''>
                    Select Role
                  </option>
                  {props &&
                    props.roles &&
                    props.roles.length &&
                    props.roles.map((item, i) => {
                      return (
                        <option key={i} value={item}>
                          {item ? item.charAt(0).toUpperCase() + item.slice(1) : ''}
                        </option>
                      )
                    })}
                </select>
                <span className='text-danger'>{errors.roleError}</span>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-12 form-group'>
                <input type='checkbox' name='checkbox' className='me-1' onChange={handleCheckbox} />
                <label>
                  I accept the{' '}
                  <a style={{ textDecoration: 'none' }} href='/'>
                    {' '}
                    terms and conditions{' '}
                  </a>
                </label>
                <span className='text-danger'>{errors.Checkbox && errors.Checkbox}</span>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-4'>
                {props.updateLoader ? (
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
                    disabled={buttonDisable ? 'disabled' : ''}
                    onClick={handleSubmit}
                    className='btn btn-primary btn-lg d-block w-100'
                    style={{ color: 'white' }}
                  >
                    Update
                  </button>
                )}
              </div>
              <div className='col-sm-4'></div>
              <div className='col-sm-4'>
                {props.activeButtonLoader ? (
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
                    onClick={handleStatus}
                    className='btn btn-primary btn-lg d-block w-100'
                    style={{ color: 'white' }}
                  >
                    {inputValues?.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className='col-lg-7 col-sm-5' style={{ alignSelf: 'center' }}>
          <div className='d-flex row mt-2 justify-content-center'>
            <AvatarPicker
              handleChangeImage={uploadFile}
              avatarImage={inputValues.imageUrl ? inputValues.imageUrl : inputValues?.Image}
            />
          </div>
          <div className='btn-group-lg mt-4' style={{ textAlign: '-webkit-center' }}>
            <div className='mt-2'>
              <button
                className='btn btn-dark btn-lg d-block'
                onClick={(e) => viewUserData(e, 'groups')}
              >
                View Associated Groups
              </button>
            </div>
            <div className='mt-2'>
              <button
                className='btn btn-dark btn-lg d-block'
                onClick={(e) => viewUserData(e, 'projects')}
              >
                View Associated Projects
              </button>
            </div>
            <div className='mt-2'>
              <button
                className='btn btn-dark btn-lg d-block'
                // onClick={() =>
                //   props.navigate('/home/formData', {
                //     state: { search: inputValues?.username, searchBy: 'fieldBy' },
                //   })
                // }
                onClick={(e) => viewUserData(e, 'project-forms')}
              >
                View Associated Form Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileComponent
