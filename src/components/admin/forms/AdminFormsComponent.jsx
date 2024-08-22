import { uniqueId } from 'lodash'
import { Component } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminFormListContainer from '../../../container/admin/forms/AdminFormListContainer'
import ExportFileModalDialog from '../../../container/modal/export-file-model/export-file-Dialog'
import {
  RestUrlHelper,
  downloadXlsx,
  getAuthorizationHeaders,
  getQueryParameter,
} from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import AdminFormAddComponent from './AdminFormAddComponent'
import { FORM } from './constant/form'
class AdminFormsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loader: false,
      totalCount: 0,
      show: false,
      showFileDownloadModel: false,
      headerData: FORM.TABLE_HEADERS,
      filter: FORM.FILTER_OPTIONS,
      search: false,
      searchWithFields: true,
      searchWithFieldsOptions: [
        { name: 'Form Name', value: 'formName' },
        // { name: 'Project Name', value: 'projectName' },
        { name: 'Created By', value: 'createdBy' },
      ],
      isSelect: false,
      parentCheck: false,
      parentCheckBoxId: uniqueId('parentCheckBox-'),
      selectedFormData: [],
      downloadXlsxLoader: false,
      dropdown: false,
    }
  }

  componentDidMount() {
    this.getFormList(this.state.filter)
  }

  getFormList = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(`${RestUrlHelper.GET_FORM_LIST_URL}${getQueryParameter(filter)}`, { headers })
      .then(
        (res) => {
          this.setState({ loader: false })
          const data = res.data.data
          const totalCount = data.length > 0 ? res.data.count : 0
          this.setState({ data, totalCount })
        },
        (err) => {
          this.setState({ loader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }

  handleClose = () => {
    this.setState({ show: false })
  }
  handleShow = () => {
    this.setState({ show: true })
  }

  handelLoader = (value) => {
    this.setState({ loader: value })
  }

  createForm = () => {
    this.setState({ dropdown: false })
    this.props.navigate('/home/forms/create')
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
    if (selectedFormData.length < 10) {
      document.getElementById(this.state.parentCheckBoxId).indeterminate = true
    }
  }
  OnExportButtonSelect = () => {
    this.setState({ dropdown: false })
    this.setState({ isSelect: true, selectedFormData: [], selectCounter: 0 })
  }
  getSelectDiv({ dropdown, selectCounter }) {
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div>
          <h5>Select Forms to export {selectCounter} </h5>
          <small>you can select only 30 field</small>
        </div>

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
                <i
                  style={selectCounter > 0 ? { cursor: 'pointer' } : { display: 'none' }}
                  className='dropdown-item fas fa-file-pdf pointer'
                  onClick={() => this.openDownloadModel()}
                >
                  <span className='ms-2'>xlsx</span>
                </i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  getUnSelectDiv() {
    const { downloadXlsxLoader, dropdown } = this.state
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h5>Forms </h5>
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
              <li
                className='list-group-item py-0 list-group-item-action p-2'
                onClick={() => this.createForm()}
              >
                <i className='dropdown-item fas fa-plus pointer'>
                  <span className='ms-2'>Create Forms</span>
                </i>
              </li>
              <li
                className='list-group-item py-0 list-group-item-action p-2'
                onClick={() => this.OnExportButtonSelect()}
              >
                <i className='dropdown-item fa fa-file status pointer'>
                  <span className='ms-2'> Export Data</span>
                </i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  handleDownloadXlsx = async (body) => {
    this.setState({ downloadXlsxLoader: true })
    const data = await downloadXlsx(body, 'form-data')
    this.setState({ downloadXlsxLoader: false, showFileDownloadModel: false })
    if (data.success) {
      NotificationMessage.showInfo('File downloaded')
      this.setState({ isSelect: false, selectedFormData: [], selectCounter: 0 })
    } else {
      NotificationMessage.showError(`Unable to download file! ${data.exception.message}`)
    }
  }

  openDownloadModel = async () => {
    if (this.state.selectCounter > 0) {
      this.setState({ showFileDownloadModel: true })
    }
  }

  render() {
    const { isSelect } = this.state
    return (
      <>
        {isSelect ? this.getSelectDiv(this.state) : this.getUnSelectDiv()}
        <AdminFormListContainer
          handelLoader={this.handelLoader}
          navigate={this.props.navigate}
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          data={this.state.data}
          isView={true}
          getFormList={this.getFormList}
          location={this.props.location}
          searchWithFields={this.state.searchWithFields}
          searchWithFieldsOptions={this.state.searchWithFieldsOptions}
          search={this.state.search}
          filter={this.state.filter}
          parentCheck={this.state.parentCheck}
          onChildSelect={this.onChildSelect}
          onParentSelect={this.onParentSelect}
          isSelect={isSelect}
          parentCheckBoxId={this.state.parentCheckBoxId}
          selectedFormData={this.state.selectedFormData}
        ></AdminFormListContainer>
        {this.state.show ? (
          <AdminFormAddComponent
            handelLoader={this.handelLoader}
            modalShow={this.state.show}
            handleShow={this.handleShow}
            handleClose={this.handleClose}
          ></AdminFormAddComponent>
        ) : (
          ''
        )}

        {this.state.showFileDownloadModel ? (
          <ExportFileModalDialog
            modalShow={this.state.showFileDownloadModel}
            handleClose={() => {
              this.setState({ showFileDownloadModel: false })
            }}
            downloadXlsxLoader={this.state.downloadXlsxLoader}
            bodyData={{ formFieldId: this.state.selectedFormData }}
            onClickDownload={this.handleDownloadXlsx}
          ></ExportFileModalDialog>
        ) : (
          ''
        )}
      </>
    )
  }
}
function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  const location = useLocation()
  return <AdminFormsComponent {...props} navigate={navigate} location={location} params={params} />
}

export default WithNavigate
