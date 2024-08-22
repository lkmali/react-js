import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminProjectAddContainer from '../../../container/admin/projects/add-project/AdminProjectAddContainer'
import AdminProjectListContainer from '../../../container/admin/projects/AdminProjectListContainer'
import ExportFileModalDialog from '../../../container/modal/export-file-model/export-file-Dialog'
import {
  downloadXlsx,
  getAuthorizationHeaders,
  getQueryParameter,
  RestUrlHelper,
} from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import { PROJECT } from './constant'
class AdminProjectsListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: false,
      totalCount: 0,
      data: [],
      show: false,
      headerData: PROJECT.TABLE_HEADERS,
      filter: PROJECT.FILTER_OPTIONS,
      search: true,
      downloadXlsxLoader: false,
      selectedProjectId: '',
    }
  }

  componentDidMount() {
    this.getProjectList(this.state.filter)
  }

  getProjectList = (filter = this.state.filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(`${RestUrlHelper.GET_PROJECT_LIST}${getQueryParameter(filter)}`, { headers })
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

  handleDownloadXlsx = async (body) => {
    this.setState({ downloadXlsxLoader: true })
    const data = await downloadXlsx(body, 'project-data')
    this.setState({ downloadXlsxLoader: false, showFileDownloadModel: false })
    if (data.success) {
      NotificationMessage.showInfo('File downloaded')
      this.setState({ isSelect: false, selectedFormData: [], selectCounter: 0 })
    } else {
      NotificationMessage.showError(`Unable to download file! ${data.exception.message}`)
    }
  }

  openDownloadModel = async (selectedProjectId) => {
    this.setState({ showFileDownloadModel: true, selectedProjectId })
  }

  render() {
    return (
      <>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5>Projects </h5>
          <button className='btn btn-primary' onClick={() => this.setState({ show: true })}>
            <span className='d-none d-sm-block px-4'> Create Project </span>
            <span className='d-block d-sm-none'>
              {' '}
              <i className='fas fa-plus'></i>{' '}
            </span>
          </button>
        </div>
        <AdminProjectListContainer
          handelLoader={this.handelLoader}
          navigate={this.props.navigate}
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          itemPerPage={this.state.itemPerPage}
          data={this.state.data}
          getProjectList={this.getProjectList}
          search={this.state.search}
          filter={this.state.filter}
          downloadFile={true}
          openDownloadModel={this.openDownloadModel}
        ></AdminProjectListContainer>
        {this.state.show ? (
          <AdminProjectAddContainer
            handelLoader={this.handelLoader}
            modalShow={this.state.show}
            handleShow={this.handleShow}
            handleClose={this.handleClose}
            getProjectList={this.getProjectList}
          ></AdminProjectAddContainer>
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
            bodyData={{ projectId: this.state.selectedProjectId }}
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
  return <AdminProjectsListComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
