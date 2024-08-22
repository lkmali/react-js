import { Component } from 'react'
import './Add.css'
import AdminFormDetailsContainer from './AdminFormDetailsContainer'
import AdminFormFieldContainer from './AdminFormFieldContainer'
import AdminFormsModalDialog from './view-from-data-modal/AdminFormsModalDialog'
export default class AdminFormAddContainer extends Component {
  constructor(props) {
    super(props)
    // const formId = this.props.match.params?.id
    this.state = {
      show: false,
      modalData: null,
      isValidForm: true,
      newForm: false,
    }
  }

  handleFormFiledTabVisible = () => {
    this.props.handleFormFiledTabVisible()
  }
  handleCreateForm = () => {
    this.props.handleCreateForm()
  }

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
    const { newForm } = this.state
    this.props.onSelectClone(id, newForm)
    this.setState({ show: false, modalData: null, newForm: false })
  }
  onSelectClone2 = (id) => {
    const { newForm } = this.state
    this.props.onSelectClone(id, newForm)
    this.setState({ show: false, modalData: null, newForm: false })
  }
  render() {
    const {
      state,
      updatePublishState,
      isPublished,
      handleCreateForm,
      handleCreateFormFiled,
      handleChanges,
      publishForm,
    } = this.props
    return (
      <>
        {this.props.isUpsert ? (
          <div className='align-items-center mb-3'>
            {isPublished ? (
              <div className='row mt-2'>
                <div className='col-md-4 col-lg-6 col-sm-3'></div>
                <div
                  className='col-md-8 col-lg-6 col-sm-9'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <button className='btn btn-primary' title='Form is already published'>
                    {''}
                    Published{' '}
                  </button>
                  <button
                    className='btn btn-primary'
                    onClick={() => this.setState({ show: true, newForm: true })}
                  >
                    <span className='d-none d-sm-block px-4'> Clone Another Form </span>
                    <span className='d-block d-sm-none'>
                      {' '}
                      <i className='fa-solid fa-angles-up'></i>{' '}
                    </span>
                  </button>
                  <button
                    className='btn btn-primary'
                    onClick={() =>
                      this.setState({ newForm: true }, () => this.onSelectClone2(this.props.formId))
                    }
                  >
                    <span className='d-none d-sm-block px-4'> Clone this form </span>
                    <span className='d-block d-sm-none'>
                      {' '}
                      <i className='fa-solid fa-angles-up'></i>{' '}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className='row mt-2'>
                <div className='col-3 me-2'>
                  <button
                    className='btn btn-primary'
                    title='Publish To Final Change'
                    onClick={() => publishForm(state?.formId)}
                  >
                    <span className='d-none d-sm-block px-4'> Publish </span>
                    <span className='d-block d-sm-none'>
                      {' '}
                      <i className='fa-solid fa-angles-up'></i>{' '}
                    </span>
                  </button>
                </div>
                <div className='col-8'>
                  <button className='btn btn-primary' onClick={() => this.setState({ show: true })}>
                    <span className='d-none d-sm-block px-4'> Clone Form </span>
                    <span className='d-block d-sm-none'>
                      {' '}
                      <i className='fa-solid fa-angles-up'></i>{' '}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div></div>
        )}
        <div className='Tabs-dev'>
          <ul className='borderNav'>
            <li
              className={this.props.activeTab === 'tab1' ? 'active' : ''}
              onClick={() => this.handleActiveTab('tab1')}
            >
              {state.formId ? 'Update Form' : 'Create Form'}
            </li>
            <li
              className={this.props.activeTab === 'tab2' ? 'active' : ''}
              onClick={() => {
                state.formId ? this.handleActiveTab('tab2') : this.handleActiveTab('tab1')
              }}
            >
              Add Fields To Form
            </li>
          </ul>
          <div className='outlet'>
            {this.props.activeTab === 'tab1' ? (
              <AdminFormDetailsContainer
                {...this.state}
                {...this.props}
                handleCreateForm={handleCreateForm}
                state={state}
                updatePublishState={updatePublishState}
                navigate={this.props.navigate}
                handleChanges={handleChanges}
                handleFormFiledTabVisible={this.handleFormFiledTabVisible}
              ></AdminFormDetailsContainer>
            ) : (
              <AdminFormFieldContainer
                {...this.state}
                {...this.props}
                updateFormFiledData={this.props.updateFormFiledData}
                handleCreateFormFiled={handleCreateFormFiled}
                state={state}
                handleClose={this.handleClose}
                cloneData={this.props.cloneData}
                navigate={this.props.navigate}
              ></AdminFormFieldContainer>
            )}
          </div>
          {this.state.show ? (
            <AdminFormsModalDialog
              handelLoader={this.handelLoader}
              modalShow={this.state.show}
              navigate={this.props.navigate}
              onSelectClone={this.onSelectClone}
              handleShow={this.handleShow}
              handleClose={this.handleClose}
            ></AdminFormsModalDialog>
          ) : (
            ''
          )}
        </div>
      </>
    )
  }
}
