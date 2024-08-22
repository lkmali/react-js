import { useState } from 'react'
import LoaderContainer from '../../container/loader/Loader'
import { errorMessage } from '../../helper/errorMessage'
import AvatarPicker from '../avatar-picker/avatarPicker'
const ProfileContainer = (props) => {
  const unEditableFields = props.unEditableFields
  const updateInputValues = props.updateInputValues
  const inputValues = props.inputValues
  const [errors, setErrors] = useState({})
  const [buttonDisable, setButtonDisable] = useState(true)
  const [uploadImgBtnDisabled, setUploadImgBtnDisabled] = useState(true)
  const [checkBoxChecked, setCheckBoxChecked] = useState(false)

  const handleChange = (event) => {
    setButtonDisable(false)
    updateInputValues({ inputValues: { ...inputValues, [event.target.name]: event.target.value } })
  }

  const uploadFile = (e) => {
    updateInputValues({ inputFields: { ...inputValues, image: e } })
    setUploadImgBtnDisabled(false)
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

  const handleUpload = (e) => {
    e.preventDefault()

    if (uploadImgBtnDisabled) {
      return
    }
    // if (!checkBoxChecked) {
    //     // NotificationMessage.showError('please check check box');
    //     setError('Checkbox', errorMessage.checkBox);
    //     return
    // } else {
    //     setUploadImgBtnDisabled(true)
    // }
    props.handleUpload(inputValues)
  }
  return (
    <div>
      <div className='row d-flex'>
        <div className='col-lg-5 col-sm-7 white-box border border-info rounded'>
          <form>
            <div className='row mt-2'>
              <div className='col-sm-12'>
                <div className='form-group'>
                  <label>Full Name</label>
                  <input
                    type='text'
                    name='fullName'
                    value={unEditableFields.fullName}
                    className={'form-control'}
                    disabled
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
                    value={unEditableFields.email}
                    disabled
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
                    disabled
                    value={unEditableFields.phone}
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
                    value={inputValues.address}
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
                    value={inputValues.city}
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
                    value={inputValues.state}
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
                    value={inputValues.country}
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
                    value={inputValues.pinCode}
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
                    value={unEditableFields.org}
                    disabled
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
                  <label>Your role</label>
                  <input
                    type='text'
                    name='role'
                    value={unEditableFields.role}
                    disabled
                    className={'form-control'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-sm-12 form-group'>
                <div className=''>
                  <input type='checkbox' name='checkbox' onChange={handleCheckbox} />
                  <label>
                    I accept the{' '}
                    <a style={{ textDecoration: 'none' }} href='/'>
                      {' '}
                      terms and conditions{' '}
                    </a>
                  </label>
                </div>
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
                    Save
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className='col-lg-7 col-sm-5 shadow' style={{ alignSelf: 'center' }}>
          <div className='d-flex row mt-2 justify-content-center'>
            <AvatarPicker handleChangeImage={uploadFile} avatarImage={unEditableFields?.imageUrl} />
          </div>
          <div className='btn-group-lg mt-4' style={{ textAlign: '-webkit-center' }}>
            <div className='mt-2 pb-3'>
              {props.imageUploading ? (
                <button className='btn btn-primary btn-lg d-block' disabled>
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
                  className='btn btn-primary btn-lg d-block'
                  disabled={uploadImgBtnDisabled ? 'disabled' : ''}
                  onClick={handleUpload}
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileContainer
