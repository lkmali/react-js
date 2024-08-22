import { Component } from 'react'
// import { withRouter } from 'react-router'
import LoaderContainer from '../../../container/loader/Loader'
export default class AdminFormDetailsAddComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
    }
    this.handleChanges = this.handleChanges.bind(this)
  }
  setErrors = (key, value) => {
    this.props.setErrors(key, value)
  }
  handleBlur = (event, filedName) => {
    this.props.handleBlur(event, filedName)
  }

  handleChanges(event, filedName) {
    this.props.handleChanges(event, filedName)
  }
  handleCreateForm(event, isUpsert) {
    this.props.handleCreateForm(event, isUpsert)
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

  render() {
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#e84546',
      visible: true,
    }
    const { projectDropDown, formId, internalState, isPublished, formSubmissionLoader } = this.props
    let inputValues = this.props?.inputValues
    let button
    if (formId) {
      button = (
        <button
          onClick={(e) => this.handleCreateForm(e, true)}
          className='btn btn-primary btn-lg d-block w-100'
          style={{ color: 'white' }}
        >
          {' '}
          Update{' '}
        </button>
      )
    } else {
      button = (
        <button
          onClick={(e) => this.handleCreateForm(e, false)}
          className='btn btn-primary btn-lg d-block w-100'
          style={{ color: 'white' }}
        >
          {' '}
          Create{' '}
        </button>
      )
    }
    return (
      <div className='FirstTab'>
        {formSubmissionLoader ? (
          <LoaderContainer {...loaderProperty}></LoaderContainer>
        ) : (
          <div className='row d-flex mt-3'>
            {/* //style={{ placeContent: 'center' }}> */}
            <div className='col-lg-5 col-sm-7'>
              <form>
                <fieldset
                  disabled={isPublished ? 'disabled' : ''}
                  className={isPublished ? 'form-diasble' : ''}
                >
                  {/* <div className='row mt-2'>
                    <div className='col-sm-12'>
                      <div className='form-group'>
                        <label>Project Name</label>
                        <SelectSearch
                          name='projectName'
                          closeOnSelect={true}
                          search
                          filterOptions={this.handleFilter}
                          onBlur={(e) => this.handleBlur(e.target.value, 'projectName')}
                          options={projectDropDown}
                          value={inputValues?.projectName}
                          placeholder='Select Project'
                          onChange={(e) => this.handleChanges(e, 'projectName')}
                        />
                      </div>
                      <span className='text-danger'>{internalState.errors.projectNameError}</span>
                    </div>
                  </div> */}
                  <div className='row mt-2'>
                    <div className='col-sm-12'>
                      <div className='form-group'>
                        <label>Form Name</label>
                        <input
                          type='text'
                          name='formName'
                          value={inputValues?.formName}
                          className={'form-control'}
                          placeholder='Enter project name'
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                        />
                        <span className='text-danger'>{internalState.errors.formNameError}</span>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-sm-12'>
                      <div className='form-group'>
                        <label>Form Description</label>
                        <input
                          type='text'
                          name='formDescription'
                          value={inputValues?.formDescription}
                          className={'form-control'}
                          onChange={this.handleChanges}
                          onBlur={this.handleBlur}
                        />
                        <span className='text-danger'>
                          {internalState.errors.formDescriptionError}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-sm-4 mb-3 me-5'>
                      {this.props.formSubmissionLoader ? (
                        <button className='btn btn-primary px-5 ' disabled>
                          <LoaderContainer
                            type={'Circles'}
                            color={'white'}
                            height={15}
                            width={15}
                            visible={true}
                          ></LoaderContainer>
                        </button>
                      ) : (
                        button
                      )}
                    </div>
                    <div className='col-sm-4'>
                      <button
                        onClick={() => {
                          this.props.navigate('/home/forms')
                        }}
                        className='btn btn-primary btn-lg d-block w-100'
                        style={{ color: 'white' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }
}
// export default withRouter(AdminFormDetailsAddComponent)
