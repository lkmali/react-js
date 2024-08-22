import { Component } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminWorkflowListContainer from '../../../container/admin/workflow/AdminWorkflowListContainer'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import WorkflowAddEdit from './workflowAddEdit'
// import AdminFormAddComponent from './AdminFormAddComponent'
import { workflowName } from './constant/workflow'
class AdminFormsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workflowData: [],
      loader: false,
      totalCount: 0,
      show: false,
      showFileDownloadModel: false,
      headerData: workflowName.TABLE_HEADERS,
      filter: workflowName.FILTER_OPTIONS,
      search: true,
      searchWithFields: false,
      searchWithFieldsOptions: [],
      selectedData: [],
      downloadXlsxLoader: false,
      showModal: false,
      newModal: false,
      formSubmissionLoader: false,
      isValidForm: false,
      inputValues: {
        workflowName: '',
        status: '',
      },
      errors: {
        workflowName: '',
        status: '',
      },
    }
    this.handleChanges = this.handleChanges.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.activeWorkflow = this.activeWorkflow.bind(this)
  }

  componentDidMount() {
    this.getWorkflowList(this.state.filter)
  }

  handleChanges(event, filedName, multi, direct, label) {
    let name = ''
    let { inputValues } = this.state
    if (filedName) {
      name = filedName
      if (multi) {
        inputValues[filedName] = event.map((x) => x.value)
      } else if (direct) {
        inputValues[filedName] = event
      } else if (label) {
        inputValues[filedName] = event.label
      } else {
        inputValues[filedName] = event.value
      }
    } else {
      name = event.target.name
      inputValues[name] = event.target.value
    }
    this.setState((prevState) => ({
      ...prevState,
      inputValues,
    }))
  }

  activeWorkflow(workflowId) {
    restActions
      .PATCH(
        `${RestUrlHelper.GET_WORKFLOW}/${workflowId}/active`,
        {},
        getAuthorizationHeaders(),
        true,
      )
      .then(
        (res) => {
          if (res) {
            NotificationMessage.showInfo('Workflow Active Successfully')
            this.props.navigate(`/home/workflow/edit/${workflowId}`)
          }
          this.setState({ formSubmissionLoader: false })
        },
        (err) => {
          this.setState({ formSubmissionLoader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }

  handleSubmit(event) {
    event.preventDefault()
    let required = ['workflowName']
    const inputValues = this.state.inputValues
    const errors = {}
    required.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(inputValues, key)) {
        errors[key] = `Missing field ${key}`
      } else {
        if (inputValues[key] == null || inputValues[key] === '') {
          errors[key] = 'Field is empty'
        }
      }
    })
    if (Object.keys(errors).length > 0) {
      this.setState({ errors, isValidForm: false })
      NotificationMessage.showError('Fill All Details')
    } else {
      const headers = getAuthorizationHeaders()
      this.setState({ formSubmissionLoader: true })
      if (this.state.newModal) {
        restActions
          .POST(
            `${RestUrlHelper.GET_WORKFLOW}`,
            this.state.inputValues,
            getAuthorizationHeaders(),
            true,
          )
          .then(
            (res) => {
              if (res) {
                NotificationMessage.showInfo('Workflow created Successfully')
                this.props.navigate(`/home/workflow/edit/${res.data.id}`)
                this.handelModel()
              }
              this.setState({ formSubmissionLoader: false })
            },
            (err) => {
              this.setState({ formSubmissionLoader: false })
              NotificationMessage.showError(err.message)
            },
          )
      } else {
        restActions
          .PUT(
            `${RestUrlHelper.GET_WORKFLOW}/${this.state.inputValues.id}`,
            this.state.inputValues,
            getAuthorizationHeaders(),
            true,
          )
          .then(
            (res) => {
              if (res) {
                NotificationMessage.showInfo('Workflow updated Successfully')
                this.handelModel()
              }
              this.getWorkflowList(this.state.filter)
              this.setState({ formSubmissionLoader: false })
            },
            (err) => {
              this.getWorkflowList(this.state.filter)
              this.setState({ formSubmissionLoader: false })
              NotificationMessage.showError(err.message)
            },
          )
      }
    }
  }

  getWorkflowList = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    //  ${ getQueryParameter(filter) }
    restActions
      .GET(`${RestUrlHelper.GET_WORKFLOW}${getQueryParameter(filter)}`, { headers }, true)
      .then(
        (res) => {
          this.setState({ loader: false })
          const workflowData = res.data.data
          const totalCount = workflowData.length > 0 ? res.data.count : 0
          this.setState({ workflowData, totalCount })
        },
        (err) => {
          this.setState({ loader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }
  handelModel = (item) => {
    const { showModal } = this.state
    if (item) {
      this.setState({
        inputValues: {
          workflowName: item.workflowName,
          projectId: item.projectId,
          projectName: item.projectName,
          status: item.status,
          id: item.id,
        },
        newModal: false,
      })
    } else {
      this.setState({
        inputValues: {
          workflowName: '',
          status: '',
        },
        newModal: true,
      })
    }
    this.setState({ showModal: !showModal })
  }
  getUnSelectDiv() {
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h5>Work Flows</h5>
        <div>
          <div
            className='col-xs-12 rounded  '
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button className='btn btn-primary' onClick={() => this.handelModel()}>
              <span className='d-none d-sm-block px-4'> Add New Workflow </span>
              <span className='d-block d-sm-none'>
                {' '}
                <i className='fas fa-plus'></i>{' '}
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { isSelect } = this.state
    return (
      <>
        {this.getUnSelectDiv()}
        <AdminWorkflowListContainer
          handelLoader={this.handelLoader}
          navigate={this.props.navigate}
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          data={this.state.workflowData}
          isView={true}
          getWorkflowList={this.getWorkflowList}
          location={this.props.location}
          searchWithFields={this.state.searchWithFields}
          searchWithFieldsOptions={this.state.searchWithFieldsOptions}
          search={this.state.search}
          filter={this.state.filter}
          handelModel={this.handelModel}
          parentCheck={this.state.parentCheck}
          onChildSelect={this.onChildSelect}
          onParentSelect={this.onParentSelect}
          isSelect={isSelect}
          parentCheckBoxId={this.state.parentCheckBoxId}
          selectedData={this.state.selectedData}
          activeWorkflow={this.activeWorkflow}
        ></AdminWorkflowListContainer>

        {this.state.showModal && (
          <WorkflowAddEdit
            {...this.props}
            {...this.state}
            handleSubmit={this.handleSubmit}
            handleChanges={this.handleChanges}
            showModal={this.state.showModal}
            handelModel={this.handelModel}
            newModal={this.state.newModal}
          />
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
