import { uniqueId } from 'lodash'
import { Component } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminTaskListContainer from '../../../container/admin/task-template/AdminTaskListContainer'
import LoaderContainer from '../../../container/loader/Loader'
import {
  RestUrlHelper,
  canAccessByUser,
  downloadXlsx,
  getAuthorizationHeaders,
  getCacheFilter,
  getQueryParameter,
} from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import { FORM } from './constant/form'
class AdminFormsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loader: false,
      totalCount: 0,
      show: false,
      dropdown: false,
      showFileDownloadModel: false,
      headerData: FORM.TABLE_HEADERS,
      filter: getCacheFilter(FORM.FILTER_OPTIONS, 'task'),
      search: false,
      searchWithFieldsOptions: [
        { name: 'Task Name', value: 'taskName' },
        { name: 'Created By', value: 'createdBy' },
      ],
      searchWithFields: true,
      isSelect: false,
      parentCheck: false,
      parentCheckBoxId: uniqueId('parentCheckBox-'),
      selectedFormData: [],
      downloadXlsxLoader: false,
      isPaginationStore: true,
      tablePageName: 'Task',
    }
  }

  componentDidMount() {
    this.getFormList(this.state.filter)
  }
  getFormList = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // console.log("getFormList", filter.pageNumber)
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(
        `${RestUrlHelper.GET_Task_TEMPLATE_CREATE_URL}${getQueryParameter({
          ...filter,
          cacheKey: 'task',
          needToSaveCache: true,
          pageNumber: filter.pageNumber,
          isWorkflowTask: false,
        })}`,
        { headers },
      )
      .then(
        (res) => {
          this.setState({ loader: false })
          const data = res.data.data
          const totalCount = data.length > 0 ? res.data.count : 0
          this.setState({ data, totalCount })
          // //  console.log('totalCount', totalCount, filter.pageNumber)
          // if (data && data.length) {
          //   this.setState({ data, totalCount })
          // } else {
          //   this.setState({ filter: { ...filter, pageNumber: filter.pageNumber - 1 } })
          // }
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

  createTask = () => {
    this.setState({ dropdown: false })
    this.props.navigate('/home/task-template/create')
  }

  onParentSelect = (e) => {
    const selectedFormData = this.state.selectedFormData
    if (e.target.checked) {
      for (const value of this.state.data) {
        if (selectedFormData.indexOf(value.id) < 0) {
          if (selectedFormData.length < 10) {
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
        if (selectedFormData.length < 10) {
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

  getUnSelectDiv() {
    const { downloadXlsxLoader, dropdown } = this.state
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h5>Task Template </h5>
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
              {/* {canShare && (
                  <li
                    className='list-group-item py-0 list-group-item-action p-2'
                    onClick={() => this.OnSelectButton('shared')}
                  >
                    <i className='dropdown-item fa fa-share-alt pointer'>
                      <span className='ms-2'>{' Shared Resource'}</span>
                    </i>
                  </li>
                )} */}
              <li
                className='list-group-item py-0 list-group-item-action p-2'
                onClick={this.createTask}
              >
                <i className='dropdown-item fas fa-plus status pointer'>
                  <span className='ms-2'>Create Task</span>
                </i>
              </li>
            </ul>
          </div>
        </div>
        {/* <button className='btn btn-primary' onClick={this.createTask}>
            <span className='d-none d-sm-block px-4'> Create Task </span>
            <span className='d-block d-sm-none'>
              {' '}
              <i className='fas fa-plus'></i>{' '}
            </span>
          </button> */}
      </div>
    )
  }
  handleDownloadXlsx = async (body) => {
    this.setState({ downloadXlsxLoader: true })
    const { selectedFormData: userFromId } = this.state
    const data = await downloadXlsx({ userFromId }, 'task-template')
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
  OnSelectButton = (type) => {
    this.setState({ isSelect: true, selectedFormData: [], selectCounter: 0, type })
  }

  getSelectDiv({ downloadXlsxLoader, dropdown, selectCounter, type }) {
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div>
          <h5>
            Select Task Data to {type} {selectCounter}{' '}
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

  render() {
    const { isSelect, dropdown } = this.state
    const canShare = canAccessByUser('task', ['canShare'])
    return (
      <>
        {isSelect ? this.getSelectDiv(this.state) : this.getUnSelectDiv()}
        <AdminTaskListContainer
          handelLoader={this.handelLoader}
          navigate={this.props.navigate}
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          data={this.state.data}
          isView={true}
          location={this.props.location}
          getFormList={this.getFormList}
          currentPage={this.state.filter.pageNumber}
          isPaginationStore={this.state.isPaginationStore}
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
        ></AdminTaskListContainer>
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
