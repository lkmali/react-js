import { uniqueId } from 'lodash'
import { Component } from 'react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminTaskAddContainer from '../../../container/admin/user-task/AdminTaskAddContainer'
import EditTaskForm from '../../../container/admin/user-task/EditTaskForm'
import EditTaskUser from '../../../container/admin/user-task/EditTaskUser'
import { RestUrlHelper, getAuthorizationHeaders } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import './Add.css'
class AdminTaskAddComponent extends Component {
  constructor(props) {
    super(props)
    let taskId = ''
    if (this.props.params?.id) {
      taskId = this.props.params?.id
    }
    this.state = {
      taskId,
      inputValues: {
        userIds: [],
        taskDescription: '',
        alreadyAddedUser: [],
        taskSubmissionLoader: false,
        taskStatusLoader: false,
        taskAddress: '',
        startDate: new Date(),
        endDate: new Date(),
        longitude: 0,
        latitude: 0,
        projectId: '',
      },
      users: [],
      projects: [],
      isUpsert: false,
      cloneData: [],
      createTask: {},
      createTaskFields: [],
      taskTabActive: false,
      taskFiledTabVisible: true,
      taskFiledSubmissionLoader: false,
      taskDetails: null,
      taskFiledType: [],
      formHeaderData: [
        { title: 'Name', fieldName: 'Formname', sorting: true },
        { title: 'Created At', fieldName: 'CreatedAt', sorting: true },
        {
          title: 'Updated At',
          fieldName: 'UpdatedAt',
          sorting: true,
        },
        { title: 'Status' },
        { title: 'Expand' },
      ],
      userHeaderData: [
        { title: 'Name', fieldName: 'username', sorting: true },
        // { title: 'Phone Number', fieldName: 'phone', sorting: true },
        { title: 'Email', fieldName: 'email', sorting: true },
        { title: 'Status' },
      ],

      userParentCheckBoxId: uniqueId('parentCheckBox-'),
      formParentCheckBoxId: uniqueId('parentCheckBox-'),
    }
    this.handleChanges = this.handleChanges.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
  }

  componentDidMount() {
    this.getProject()
    const { state } = this?.props?.location || {}
    if (state) {
      if (state.projectId) {
        let { inputValues } = this.state
        this.getFormList(state.projectId)
        inputValues.projectId = state.projectId
        this.setState((prevState) => ({
          ...prevState,
          inputValues,
        }))
      }
    }
    this.getUsers()
    if (this.props.params?.id) {
      this.getTaskData(this.props.params?.id)
      this.getFormData(this.props.params?.id)
      this.getTaskDetails(this.props.params?.id)
    }
  }
  getFormData = async (taskId = this.state.taskId) => {
    try {
      const headers = getAuthorizationHeaders()
      const response = await restActions.GET(
        `${RestUrlHelper.GET_Task_CREATE_URL}/${taskId}/project-forms`,
        {
          headers,
        },
      )
      if (response.data.length > 0) {
        const data = response.data.map((value) => {
          return value.id
        })
        this.setState({
          selectedForm: data,
          selectCounter: response.data.length,
          alreadyAddedForm: response.data,
        })
        if (data.length) {
          document.getElementById(this.state.formParentCheckBoxId).indeterminate = true
        }
      }
    } catch (err) {
      //
    }
  }

  handleChanges(event, filedName, multi, direct) {
    let name = ''
    let { inputValues } = this.state
    if (filedName) {
      name = filedName
      if (multi) {
        inputValues[filedName] = event.map((x) => x.value)
      } else if (direct) {
        inputValues[filedName] = event
      } else {
        inputValues[filedName] = event.value
      }
    } else {
      name = event.target.name
      if (event.target.type == 'number') {
        if (event.target.valueAsNumber >= 0) {
          inputValues[name] = event.target.value
        }
      } else {
        inputValues[name] = event.target.value
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      inputValues,
    }))
  }
  getTaskDetails = async (taskId) => {
    try {
      let taskDetails = await restActions.GET(
        `${RestUrlHelper.GET_Task_CREATE_URL}?id=${taskId}`,
        getAuthorizationHeaders(),
      )
      let filtered = taskDetails?.data?.data
      let inputValues = {}
      if (filtered && filtered[0]) {
        filtered = filtered[0]
        inputValues = {
          ...filtered,
          latitude: filtered?.taskPoint?.coordinates?.[0],
          longitude: filtered?.taskPoint?.coordinates?.[1],
        }
      }
      // this.getFormList(inputValues.projectId)
      this.setState({
        inputValues,
        projectsLoader: false,
        isUpsert: true,
      })
    } catch (exception) {
      NotificationMessage.showError('Unable to GET !!')
    }
  }

  getProject() {
    this.setState({ projectsLoader: true })
    restActions
      .GET(RestUrlHelper.GET_PROJECT_NAME_LIST_URL, getAuthorizationHeaders())
      .then((projects) => {
        const filtered = projects?.data.map((element) => {
          return { label: element?.name.toUpperCase(), value: element.id }
        })
        this.setState({ projects: filtered, projectsLoader: false })
      })
      .catch((exception) => {
        NotificationMessage.showError(exception.message)
        this.setState({ projectsLoader: false, projects: [] })
      })
  }

  getUsers() {
    this.setState({ usersLoader: true })
    restActions
      .GET(`${RestUrlHelper.ADD_USER_URL}?withoutPagination=true`, getAuthorizationHeaders())
      .then((response) => {
        if (response && response.data && response.data.data && response.data.data.length) {
          const filtered = response?.data.data.map((element) => {
            return { label: element.username.toUpperCase(), value: element.userId }
          })
          this.setState({ users: filtered })
        }
        this.setState({ usersLoader: false })
      })
      .catch((exception) => {
        NotificationMessage.showError(exception.message)
        this.setState({ usersLoader: false, users: [] })
      })
  }

  getFormList = (projectId) => {
    const headers = getAuthorizationHeaders()
    this.setState({ formLoader: true })
    restActions
      .GET(
        `${RestUrlHelper.GET_FORM_LIST_URL_BY_PROJECTID}?projectId=${projectId}&isPublish=true`,
        { headers },
      )
      .then(
        (response) => {
          if (response && response.data && response.data.length) {
            const filtered = response?.data.map((element) => {
              return { label: element?.name.toUpperCase(), value: element.id }
            })
            this.setState({ forms: filtered })
          } else {
            this.setState({ forms: [] })
          }
          this.setState({ formLoader: false })
        },
        (err) => {
          this.setState({ formLoader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }
  getTaskData = async (id = this.state.taskId) => {
    try {
      const headers = getAuthorizationHeaders()
      const response = await restActions.GET(`${RestUrlHelper.GET_Task_CREATE_URL}/${id}/users`, {
        headers,
      })
      if (response.data.length > 0) {
        const data = response.data.map((value) => {
          return value.userId
        })
        this.setState({
          selectedUser: data,
          alreadyAddedUser: response.data,
          selectCounter: response.data.length,
        })
        if (data.length) {
          document.getElementById(this.state.userParentCheckBoxId).indeterminate = true
        }
      }
    } catch (err) {
      //
    }
  }
  handleStatus = async (taskId, status) => {
    try {
      this.setState({ taskStatusLoader: true })
      status = status ? 'inActive' : 'active'
      let response = ''
      response = await restActions.PATCH(
        `${RestUrlHelper.PATCH_Task_URL}/${taskId}/status/${status}`,
        getAuthorizationHeaders(),
      )
      if (response && response.status == 200) {
        NotificationMessage.showInfo(
          `Task ${status == 'inActive' ? 'Decative' : 'Active'} Successfully!!`,
        )
      }
      this.getTaskDetails(taskId)
      this.setState({ taskStatusLoader: false })
    } catch (exception) {
      this.getTaskDetails(taskId)
      this.setState({ taskStatusLoader: false })
      NotificationMessage.showError(exception.message)
    }
  }
  handleSubmit = async (requestObject) => {
    const { isUpsert } = this.state
    let message = ''
    let redirection = false
    try {
      this.setState({ taskSubmissionLoader: true })
      let response = ''

      if (isUpsert) {
        message = 'updation'
        response = await restActions.PUT(
          `${RestUrlHelper.POST_Task_CREATE_URL}/${this?.state?.taskId}`,
          requestObject,
          getAuthorizationHeaders(),
        )
      } else {
        redirection = true
        message = 'creation'
        response = await restActions.POST(
          RestUrlHelper.POST_Task_CREATE_URL,
          requestObject,
          getAuthorizationHeaders(),
        )
      }
      let id = response?.data?.id ? response?.data?.id : this?.state?.taskId
      this.setState(
        {
          taskId: id,
          taskSubmissionLoader: false,
        },
        () => {
          NotificationMessage.showInfo(`Task ${message} Successfully!!`)
          if (redirection) {
            this.props.navigate(`/home/user-task/view/${this?.state?.taskId}`)
            this.setState({ isUpsert: true })
          }
          return true
        },
      )
    } catch (exception) {
      this.setState({ taskSubmissionLoader: false })
      NotificationMessage.showError(exception.message)
      // NotificationMessage.showError(`Something went wrong while task ${message} .`);
      this.setState(
        {
          taskId: this?.state?.taskId,
          taskFiledTabVisible: false,
          taskTabActive: true,
        },
        () => {
          // NotificationMessage.showInfo(`Task ${message} Successfully!!`);
          return false
        },
      )
    }
  }
  render() {
    const { isUpsert, taskId } = this.state
    return (
      <>
        <div
          className='mb-3'
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-around',
          }}
        >
          <div className='col-sm-6 border  card box-shadow rounded px-2'>
            <AdminTaskAddContainer
              {...this.state}
              getTaskField={this.getTaskField}
              isPublished={this.state.isPublished}
              isUpsert={this.state.isUpsert}
              updateTaskFiledData={this.updateTaskFiledData}
              getTaskDetails={this.getTaskDetails}
              handleActiveTab={this.handleActiveTab}
              taskSubmissionLoader={this.state.taskSubmissionLoader}
              taskStatusLoader={this.state.taskStatusLoader}
              handleTaskFiledTabVisible={this.handleTaskFiledTabVisible}
              state={this.state}
              formDropDown={this.state.forms}
              updatePublishState={this.updatePublishState}
              userDropDown={this.state.users}
              projectDropDown={this.state.projects}
              navigate={this.props.navigate}
              handleChanges={this.handleChanges}
              handleSubmit={this.handleSubmit}
              handleStatus={this.handleStatus}
              getFormList={this.getFormList}
            ></AdminTaskAddContainer>
          </div>
          <div className='col-sm-6'>
            <div className='mb-3 border box-shadow rounded'>
              <p className='script'>
                <span>Users Assigned</span>
              </p>
              <EditTaskUser
                screenType={this.props.screenType}
                loader={this.state.loader}
                parentCheck={this.state.parentCheck}
                totalCount={this.state.totalCount}
                search={this.state.search}
                filter={this.state.filter}
                headerData={this.state.userHeaderData}
                data={this.state.alreadyAddedUser}
                navigate={this.props.navigate}
                selectedUser={this.state.selectedUser}
                onChildSelect={this.onChildSelect}
                onParentSelect={this.onParentSelect}
                getUserList={this.getUserList}
                alreadyAddedUser={this.state.alreadyAddedUser}
                isSelect={this.state.isSelect}
                userParentCheckBoxId={this.state.userParentCheckBoxId}
              ></EditTaskUser>
            </div>
            {isUpsert && this.state?.inputValues?.status == 0 && taskId && (
              <div style={{ textAlign: '-webkit-center' }}>
                <button
                  disabled={this.state?.inputValues?.status != 0}
                  onClick={(e) => {
                    this.props.navigate(`/home/user-task/${taskId}/add-users`, {
                      fromMyComponent: true,
                    })
                  }}
                  className='btn btn-primary btn-sm d-block w-30'
                  style={{ color: 'white' }}
                >
                  Edit Users
                </button>
              </div>
            )}
          </div>
          <div className='col-sm-9 border box-shadow rounded mt-3'>
            <p className='script'>
              <span>Task Assigned</span>
            </p>
            <EditTaskForm
              loader={this.state.loader}
              parentCheck={this.state.parentCheck}
              totalCount={this.state.totalCount}
              search={this.state.search}
              filter={this.state.filter}
              headerData={this.state.formHeaderData}
              data={this.state.alreadyAddedForm}
              navigate={this.props.navigate}
              selectedForm={this.state.selectedForm}
              onChildSelect={this.onChildSelect}
              onParentSelect={this.onParentSelect}
              getFormList={this.getFormList}
              isSelect={this.state.isSelect}
              formParentCheckBoxId={this.state.formParentCheckBoxId}
            ></EditTaskForm>
          </div>
        </div>
      </>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  const location = useLocation()
  return (
    <AdminTaskAddComponent {...props} navigate={navigate} location={location} params={params} />
  )
}

export default WithNavigate
