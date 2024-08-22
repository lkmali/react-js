// import { errorMessage } from '../../../helper'
import SelectSearch from 'react-select-search'
import LoaderContainer from '../../../container/loader/Loader'
import DatePickerContainer from '../../datetimepicker/DatePicker'
// import LoaderContainer from '../../../container/loader/Loader'
const AdminFormViewComponent = (props) => {
  const inputValues = props.inputValues
  // const [errors, setErrors] = useState({})
  // const [buttonDisable, setButtonDisable] = useState(true)
  // const [checkBoxChecked, setCheckBoxChecked] = useState(false)
  const userLoader = props.userLoader
  // const handleChange = (event) => {
  //     setButtonDisable(false)
  //     updateInputValues({ inputFields: { ...inputValues, [event.target.name]: event.target.value } });
  // }

  // const handleCheckbox = () => {
  //     if (!checkBoxChecked) {
  //         setError('Checkbox', '');
  //     }
  //     setCheckBoxChecked(!checkBoxChecked);
  // }

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

  // const setError = (key, value) => {
  //     errors[key] = value;
  //     setErrors((prevState) => ({ ...prevState, errors }));
  // }

  // const handleSumbit = (e) => {
  //     e.preventDefault();
  //     if (buttonDisable) {
  //         return
  //     }
  //     if (!checkBoxChecked) {
  //         // NotificationMessage.showError('please check check box');
  //         setError('Checkbox', errorMessage.checkBox);
  //         return
  //     } else {
  //         setButtonDisable(true)
  //     }
  //     props.handleSubmit(inputValues)
  // }
  // const handleStatus = (e) => {
  //     e.preventDefault();
  //     props.handleStatus(inputValues)
  // }
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
    <>
      {userLoader ? <LoaderContainer {...loaderProperty}></LoaderContainer> : ''}
      <div className='col-sm-6 border border-info rounded'>
        <div className='col-sm-12 '>
          <div className='form-group'>
            <label>Form Name</label>
            <input
              type='text'
              name='name'
              value={inputValues?.name}
              className={'form-control'}
              placeholder='Enter form name'
              // onChange={this.handleChanges}
              //  onBlur={this.handleBlur}
              // onKeyUp={this.handleBlur}
            />
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Form Description</label>
            <input
              type='text'
              name='description'
              placeholder='Enter form description'
              value={inputValues?.description}
              className={'form-control'}
              // onChange={this.handleChanges}
              //  onBlur={this.handleBlur}
              // onKeyUp={this.handleBlur}
            />
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='form-group'>
            <label>Form Owner</label>
            <SelectSearch
              name='formOwner'
              closeOnSelect={true}
              filterOptions={handleFilter}
              //  onBlur={e => handleBlur(e.target.value, 'formOwner')}
              // onChange={e => this.handleChanges(e, 'formOwner')}
              options={props?.userDropDown}
              value={inputValues?.formOwnerId}
              placeholder='Select Owner'
            />
          </div>
        </div>
        <div className='col-sm-12 mt-2'>
          <div className='row'>
            {startDate && (
              <div className='col-sm-6'>
                <label>Start Date</label>
                <DatePickerContainer
                  startDate={startDate}
                  // handleDate={(e) => this.handleChanges(e, 'startDate')}
                  // onBlur={(e) => this.handleBlur(e, 'startDate')}
                ></DatePickerContainer>
              </div>
            )}
            {endDate && (
              <div className='col-sm-6'>
                <label>End Date</label>

                <DatePickerContainer
                  startDate={endDate}
                  handleDate={(e) => this.handleChanges(e, 'endDate')}
                  onBlur={(e) => this.handleBlur(e, 'endDate')}
                ></DatePickerContainer>
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
                // onBlur={e => this.handleBlur(e.target.value, 'priority')}
                // onChange={e => this.handleChanges(e, 'priority')}
                options={[
                  { name: 'Select priority level', value: null },
                  { name: 'low', value: parseInt(0) },
                  { name: 'medium', value: 1 },
                  { name: 'high', value: 2 },
                ]}
                value={inputValues?.priority}
                placeholder='Select priority level'
              />
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
            <button
              // disabled={}
              type='submit'
              className='btn btn-primary px-5 me-5'
            >
              Save
            </button>
          )}
          <button className='btn btn-primary px-5 ' style={{ color: 'white' }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminFormViewComponent
