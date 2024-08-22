import { uniqueId } from 'lodash'
import { Component } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../../../actions'
import restActions from '../../../actions/rest'
import AdminFormDataListContainer from '../../../container/admin/form-data/AdminFormDataListContainer'
import LoaderContainer from '../../../container/loader/Loader'
import {
  SharedResourceData,
  canAccessByUser,
  downloadXlsx,
  getQueryParameter,
  getSharedResourceBody,
  removeTrailingSlash,
} from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import { FORM_DATA } from './constant/constant'

import SharedResourceDialog from '../../../container/modal/shared-resource-model/shared-resource-Dialog'
class AdminFormDataListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loader: false,
      totalCount: 0,
      show: false,
      headerData: FORM_DATA.TABLE_HEADERS,
      filter: FORM_DATA.FILTER_OPTIONS,
      type: '',
      search: false,
      searchWithFieldsOptions: [
        { name: 'title', value: 'title' },
        { name: 'Project Name', value: 'projectName' },
        { name: 'form name', value: 'formName' },
        { name: 'form field by', value: 'fieldBy' },
      ],
      searchWithFields: true,
      isSelect: false,
      parentCheck: false,
      parentCheckBoxId: uniqueId('parentCheckBox-'),
      selectedFormData: [],
      downloadXlsxLoader: false,
      dropdown: false,
      showSharedModel: false,
      sharedLoader: false,
    }
  }

  onParentSelect = (e) => {
    const selectedFormData = this.state.selectedFormData
    if (e.target.checked) {
      for (const value of this.state.data) {
        if (selectedFormData.indexOf(value.id) < 0) {
          if (selectedFormData.length < 30) {
            selectedFormData.push(value.id)
          }
        }
      }
    } else {
      for (const value of this.state.data) {
        selectedFormData.splice(selectedFormData.indexOf(value.id), 1)
      }
    }
    this.setState({
      selectedFormData,
      selectCounter: selectedFormData.length,
      parentCheck: e.target.checked,
    })
  }
  onChildSelect = (e, value) => {
    const selectedFormData = this.state.selectedFormData
    const id = value.id
    if (id && e.target.checked) {
      if (selectedFormData.indexOf(id) < 0) {
        if (selectedFormData.length < 30) {
          selectedFormData.push(id)
        }
      }
    } else if (id && !e.target.checked) {
      selectedFormData.splice(selectedFormData.indexOf(id), 1)
      this.setState({ parentCheck: false })
    }
    this.setState({ selectedFormData, selectCounter: selectedFormData.length })
    if (selectedFormData.length < 30) {
      document.getElementById(this.state.parentCheckBoxId).indeterminate = true
    }
  }
  OnSelectButton = (type) => {
    this.setState({ isSelect: true, selectedFormData: [], selectCounter: 0, type })
  }

  componentDidMount() {
    this.getFormDataList(this.state.filter)
  }

  getFormDataList = async (filter) => {
    // chnage params here
    const headers = { Authorization: `Bearer ${storageActions.getItem('token')}` }
    this.setState({ loader: true, filter })
    restActions.GET(`/admin/user-project-form${getQueryParameter(filter)}`, { headers }).then(
      (res) => {
        this.setState({ loader: false })
        const data = res.data.data
        const totalCount = data.length > 0 ? res.data.count : 0
        this.setState({ data, totalCount, parentCheck: false })
      },
      (err) => {
        this.setState({ loader: false })
        NotificationMessage.showError(err.message)
      },
    )
  }

  handleShow = () => {
    this.setState({ show: true })
  }
  handleDownloadXlsx = async () => {
    const { selectedFormData: userFromId } = this.state
    if (userFromId && userFromId.length) {
      this.setState({ downloadXlsxLoader: true })
      const data = await downloadXlsx({ userFromId }, 'form-data')
      this.setState({ downloadXlsxLoader: false })
      if (data.success) {
        NotificationMessage.showInfo('File downloaded')
        this.setState({ isSelect: false, selectedFormData: [], selectCounter: 0 })
      } else {
        NotificationMessage.showError(`Unable to download file! ${data.exception.message}`)
      }
    }
  }

  onClickShared = async (emails, ids) => {
    const body = getSharedResourceBody(emails, ids)
    this.setState({ sharedLoader: true })
    const data = await SharedResourceData(body, 'form-data')
    this.setState({ sharedLoader: false })
    if (data.success) {
      NotificationMessage.showInfo('Data shared SuccessFully')
    } else {
      NotificationMessage.showError(`Unable to download file! ${data.exception.message}`)
    }
    this.setState({
      sharedLoader: false,
      selectedFormData: [],
      showSharedModel: false,
      selectCounter: 0,
    })
  }

  openSharedModel = async () => {
    if (this.state.selectCounter > 0) {
      this.setState({ showSharedModel: true })
    }
  }
  getSelectDiv({ downloadXlsxLoader, dropdown, selectCounter, type }) {
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div>
          <h5>
            Select Form Data to {type} {selectCounter}{' '}
          </h5>
          <small>you can select only 30 field</small>
        </div>

        {type === 'shared' ? (
          <div
            className='col-xs-12 rounded card-background'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div className='me-2' onClick={() => this.openSharedModel()}>
              <i className='fa fa-share-alt' style={{ color: 'black', cursor: 'pointer' }}>
                {' Shared'}
              </i>
            </div>
          </div>
        ) : (
          <div>
            <div
              className='col-xs-12 rounded card-background'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className='me-2'>
                <i className='fa fa-envelope status' style={{ color: 'black', cursor: 'pointer' }}>
                  {'  Download'}
                </i>
              </div>
              <div
                onClick={() => this.setState({ dropdown: !dropdown })}
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <i
                  className={`fas ${
                    dropdown ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'
                  } status`}
                  style={{ color: 'black' }}
                />
              </div>
            </div>
            <div className={`${dropdown ? 'show' : ''} dropdown-menu dropdown-menu-right`}>
              <ul className='list-group list-group-flush '>
                <li className='list-group-item py-0 list-group-item-action p-2'>
                  {downloadXlsxLoader ? (
                    <LoaderContainer
                      type={'Circles'}
                      color={'white'}
                      height={15}
                      width={15}
                      visible={true}
                    ></LoaderContainer>
                  ) : (
                    <i
                      style={selectCounter > 0 ? { cursor: 'pointer' } : { display: 'none' }}
                      className='dropdown-item fas fa-file-pdf pointer'
                      onClick={() => this.handleDownloadXlsx()}
                    >
                      <span className='ms-2'>xlsx</span>
                    </i>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }

  getUnSelectDiv() {
    const { dropdown } = this.state
    const canShare = canAccessByUser('form-data', ['canShare'])
    return (
      <div className='d-flex justify-content-between align-items-center me-5 mb-3'>
        <h5>Form Data </h5>
        <div>
          <div
            className='col-xs-12 rounded card-background'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div className='me-2'>
              <i className='fa fa-envelope status' style={{ color: 'black' }}>
                {'  Options'}
              </i>
            </div>
            <div
              onClick={() => this.setState({ dropdown: !dropdown })}
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              <i
                className={`fas ${
                  dropdown ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'
                } status`}
                style={{ color: 'black' }}
              />
            </div>
          </div>
          <div className={`${dropdown ? 'show' : ''} dropdown-menu dropdown-menu-right`}>
            <ul className='list-group list-group-flush '>
              {canShare ? (
                <li
                  className='list-group-item py-0 list-group-item-action p-2'
                  onClick={() => this.OnSelectButton('shared')}
                >
                  <i className='dropdown-item fa fa-share-alt pointer'>
                    <span className='ms-2'>{' Shared Resource'}</span>
                  </i>
                </li>
              ) : (
                ''
              )}
              <li
                className='list-group-item py-0 list-group-item-action p-2'
                onClick={() => this.OnSelectButton('export')}
              >
                <i className='dropdown-item fa fa-file status pointer'>
                  <span className='ms-2'> Export Data</span>
                </i>
              </li>
            </ul>
          </div>
        </div>
      </div>

      //     {canShare ? (
      //       <div
      //         className='col-xs-12 rounded card-background'
      //         style={{
      //           display: 'flex',
      //           justifyContent: 'space-between',
      //           alignItems: 'center',
      //         }}
      //       >
      //         <div className='me-2' onClick={() => this.OnSelectButton('shared')}>
      //           <i className='fa fa-share-alt' style={{ color: 'black', cursor: 'pointer' }}>
      //             {' Shared Resource'}
      //           </i>
      //         </div>
      //       </div>
      //     ) : (
      //       <div></div>
      //     )}
      // </div>
    )
  }

  render() {
    let { pathname } = window.location
    const { isSelect } = this.state
    return (
      <div>
        {isSelect ? this.getSelectDiv(this.state) : this.getUnSelectDiv()}
        <AdminFormDataListContainer
          loader={this.state.loader}
          location={this.props.location}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          data={this.state.data}
          pathname={removeTrailingSlash(pathname)}
          search={this.state.search}
          searchWithFields={this.state.searchWithFields}
          searchWithFieldsOptions={this.state.searchWithFieldsOptions}
          filter={this.state.filter}
          show={this.state.show}
          parentCheck={this.state.parentCheck}
          onChildSelect={this.onChildSelect}
          onParentSelect={this.onParentSelect}
          isSelect={isSelect}
          parentCheckBoxId={this.state.parentCheckBoxId}
          selectedFormData={this.state.selectedFormData}
          navigate={this.props.navigate}
          getFormDataList={this.getFormDataList}
        ></AdminFormDataListContainer>

        {this.state.showSharedModel ? (
          <SharedResourceDialog
            modalShow={this.state.showSharedModel}
            handleClose={() => {
              this.setState({ showSharedModel: false })
            }}
            sharedLoader={this.state.sharedLoader}
            ids={this.state.selectedFormData}
            onClickShared={this.onClickShared}
          ></SharedResourceDialog>
        ) : (
          ''
        )}
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  const location = useLocation()
  return (
    <AdminFormDataListComponent
      {...props}
      navigate={navigate}
      location={location}
      params={params}
    />
  )
}

export default WithNavigate
