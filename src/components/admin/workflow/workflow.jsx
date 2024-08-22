import { isNil } from 'lodash'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import WorkflowCanvas from '../../../container/admin/workflow/workflow'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import AdminCopyTaskPopup from './TaskPopup'
import WorkflowPopup from './WorkflowPopup'
import { workflowName } from './constant/workflow'
class AdminWorkflowStateComponent extends Component {
  constructor(props) {
    super(props)
    let workflowId = this.props.params?.workflowId
    this.state = {
      workflowId,
      inputValues: {},
      taskData: [],
      nodes: [],
      links: [],
      draggable: false,
      taskSearchLoader: false,
      taskFilter: workflowName.TASK_FILTER_OPTIONS,
      diagramReadOnly: true,
      workflowName: '',
      tempLink: {},
      startedLink: false,
      type: {
        start: 'output_horizontal',
        middle: 'input_output_horizontal',
        end: 'input_horizontal',
      },
      loader: false,
      emptyUserData: false,
      userLoader: true,
      projects: [],
      userDropDown: [],
      modalShow: false,
      show: false,
      sequence: 1,
      taskTotalCount: 0,
      formSubmissionLoader: false,
      showWorkflowPopup: false,
      views: [],
      viewData: {},
      deleteData: {},
      dropDownVales: [
        { label: 'middle', value: 'middle' },
        { label: 'end', value: 'end' },
      ],
    }
    this.handleChanges = this.handleChanges.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.resetState = this.resetState.bind(this)
    this.onLinkStarted = this.onLinkStarted.bind(this)
    this.onLinkEnded = this.onLinkEnded.bind(this)
    this.onViewClick = this.onViewClick.bind(this)

    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onLinkStarted() {
    this.setState({ startedLink: true })
  }

  onLinkEnded() {
    this.setState({ startedLink: false })
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

  componentDidMount() {
    this.getWorkflowData()
    this.getTaskList(this.state.taskFilter)
    this.getUsers()
    this.getProject()
    // this.setState({
    //   // inputValues: {
    //   //   taskTemplateId: '',
    //   // },
    // })
  }

  getTaskList = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ taskSearchLoader: true, taskFilter: filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(
        `${RestUrlHelper.GET_Task_TEMPLATE_CREATE_URL}${getQueryParameter(filter)}&isPublish=true`,
        { headers },
      )
      .then(
        (res) => {
          this.setState({ taskSearchLoader: false })
          const taskData = res.data.data
          const taskTotalCount = taskData.length > 0 ? res.data.count : 0
          this.setState({ taskData, taskTotalCount })
        },
        (err) => {
          this.setState({ taskSearchLoader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }

  setNodesAndLinksOnLoad(data) {
    let nodes = []
    let links = []
    let y = 0
    let dropDownVales = []
    let isFirst = false
    if (data.nodes.length > 0) {
      const sortNodes = this.sortingNodes(data.nodes)
      nodes = sortNodes.map((value) => {
        y = y + 1
        if (!isFirst && value.workflowPosition === 'start') {
          isFirst = true
        }
        return {
          id: value._id ?? value.id,
          label: value.taskName,
          data: { type: 'workflow', ...value },
          position: [100, y * 150],
          type: this.state.type[value.workflowPosition],
        }
      })
    }
    if (data.links.length > 0) {
      links = data.links.map((value) => {
        return {
          source: {
            nodeId: value.startWorkflowStageId,
            portId: 'output',
          },
          target: {
            nodeId: value.endWorkflowStageId,
            portId: 'input',
          },
          type: 'custom_arrow_link',
        }
      })
    }
    if (!isFirst) {
      dropDownVales = [{ label: 'start', value: 'start' }].concat([
        { label: 'middle', value: 'middle' },
        { label: 'end', value: 'end' },
      ])
    } else {
      dropDownVales = [
        { label: 'middle', value: 'middle' },
        { label: 'end', value: 'end' },
      ]
    }

    this.setState({
      show: false,
      links,
      nodes,
      sequence: nodes.length + 1,
      workflowName: data.workflowName,
      dropDownVales,
      diagramReadOnly: data.status !== 'DRAFT',
    })
  }

  sortingNodes(nodes) {
    let index = -1
    let object = {}
    for (let count = 0; count < nodes.length; count++) {
      if (nodes[count].workflowPosition === 'start') {
        index = count
        object = nodes[count]
        break
      }
    }
    if (index < 0) {
      return nodes
    }

    nodes.splice(index, 1)
    return [object].concat(nodes)
  }

  // setNodesOnCopyTask(value) {
  //   let nodes = []; this.state.nodes

  //   nodes.push({
  //     id: value._id ?? value.id,
  //     label: value.taskName,
  //     data: { type: 'workflow', ...value },
  //     position: value.position,
  //     type: this.state.type[value.workflowPosition],
  //   })

  //   this.setState({ show: false, nodes, sequence: nodes.length + 1 })
  // }
  setLinkOnAddAction(value) {
    let links = this.state.links
    links.push({
      source: {
        nodeId: value.startWorkflowStageId,
        portId: 'output',
      },
      target: {
        nodeId: value.endWorkflowStageId,
        portId: 'input',
      },
      type: 'custom_arrow_link',
    })
    this.setState({
      show: false,
      links,
      showWorkflowPopup: false,
      startedLink: false,
      views: [],
      viewData: {},
      deleteData: {},
    })
  }

  getWorkflowData = () => {
    const headers = getAuthorizationHeaders()
    // this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(`${RestUrlHelper.GET_WORKFLOW}/${this.state.workflowId}/stage/action`, { headers }, true)
      .then(
        (res) => {
          if (res.data.length > 0) {
            this.setState({ projectId: res.data[0].projectId })
            this.setNodesAndLinksOnLoad(res.data[0])
          }
        },
        (err) => {
          this.setState({ loader: false })
          NotificationMessage.showError(err.message)
        },
      )
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
          this.setState({ userDropDown: filtered })
        }
        this.setState({ usersLoader: false })
      })
      .catch((exception) => {
        NotificationMessage.showError(exception.message)
        this.setState({ usersLoader: false, users: [] })
      })
  }

  OnSelectedNode(data, draggable = true) {
    if (!draggable) {
      const views = ['view']
      if (!this.state.diagramReadOnly) {
        views.push('delete')
      }
      this.setState({
        showWorkflowPopup: true,
        views,
        viewData: { data, type: 'node' },
        deleteData: { data, type: 'node' },
      })
    }
  }
  OnSelectedLink(data) {
    if (this.state.diagramReadOnly || this.state.startedLink) {
      return
    }
    this.setState({
      showWorkflowPopup: true,
      views: ['delete'],
      viewData: {},
      deleteData: { data, type: 'link' },
    })
  }

  selectedFormTask = (tasks) => {
    if (tasks && tasks.length > 0) {
      if (tasks[0].type === 'workflow') {
        this.OnSelectedNode(tasks[0], this.state.draggable)
        return
      }
      const { projectId } = this.state
      const { coordinates } = tasks[0]?.taskPoint || {}
      const [latitude, longitude] = coordinates || []
      this.setState({
        show: true,
        inputValues: {
          // endDate: new Date(),
          // startDate: new Date(),
          projectId,
          workflowPosition: this.state.dropDownVales[0].value,
          userIds: [],
          projectName: tasks[0]?.name,
          taskTemplateId: tasks[0]?.id,
          ...tasks[0],
          latitude,
          longitude,
        },
      })
    }
  }

  selectedLink = (data) => {
    if (!isNil(data) && data.length > 0) {
      this.OnSelectedLink(data[0])
    }
  }

  onLinkStart = (id) => {
    this.setState({
      tempLink: {
        source: {
          nodeId: id,
          portId: 'output',
        },
      },
    })
  }
  onLinkEnd = (startWorkflowStageId, endWorkflowStageId) => {
    this.saveAction(startWorkflowStageId, endWorkflowStageId)
  }

  handleClose = () => {
    this.setState({ show: false })
  }
  handleDraggable = () => {
    this.setState((prevState) => ({
      draggable: !prevState.draggable,
    }))
  }

  copyTask(requestObject) {
    restActions
      .POST(
        `${RestUrlHelper.ADD_WORKFLOW_STAGE}${this.state.workflowId}`,
        requestObject,
        getAuthorizationHeaders(),
      )
      .then(
        (res) => {
          if (!isNil(res.data)) {
            this.getWorkflowData()
          }
        },
        (err) => {
          NotificationMessage.showWarning(err.message)
          this.setState({ formSubmissionLoader: false })
        },
      )
  }

  onViewClick(requestObject) {
    if (requestObject.type === 'node' && !isNil(requestObject.data)) {
      this.props.navigate(`/home/user-task/view/${requestObject.data.taskId}`)
    }
  }
  onDeleteClick(requestObject) {
    if (requestObject.type === 'node' && !isNil(requestObject.data)) {
      this.removeWorkflowStage(requestObject.data)
    } else if (requestObject.type === 'link' && !isNil(requestObject.data)) {
      this.removeLink(requestObject.data)
    }
  }

  saveAction(startWorkflowStageId, endWorkflowStageId) {
    const requestObject = {
      resourceName: 'workflowStage',
      attributeName: 'status',
      value: 7,
      valueType: 'number',
      condition: 'eq',
    }
    const url = `/api/v1/workflowStage/${startWorkflowStageId}/${endWorkflowStageId}/action`
    restActions.POST(url, requestObject, getAuthorizationHeaders(), true).then(
      (res) => {
        if (!isNil(res.data)) {
          this.setLinkOnAddAction(res.data)
        }
      },
      (err) => {
        NotificationMessage.showWarning(err.message)
        this.setState({ formSubmissionLoader: false })
      },
    )
  }

  removeLink({ startWorkflowStageId, endWorkflowStageId }) {
    if (isNil(startWorkflowStageId) || isNil(endWorkflowStageId)) {
      this.resetState()
      return
    }

    const url = `/api/v1/workflowStage/${startWorkflowStageId}/${endWorkflowStageId}/action`

    restActions.DELETE(url, {}, getAuthorizationHeaders(), true).then(
      (res) => {
        if (!isNil(res.data)) {
          this.getWorkflowData()
          this.resetState()
        }
      },
      (err) => {
        NotificationMessage.showWarning(err.message)
        this.resetState()
      },
    )
  }
  removeWorkflowStage(data) {
    if (!(!isNil(data._id) || !isNil(data.id))) {
      this.resetState()
      return
    }
    const url = `/api/v1/workflowStage/${data._id ?? data.id}`
    restActions.DELETE(url, {}, getAuthorizationHeaders(), true).then(
      (res) => {
        if (!isNil(res.data)) {
          this.getWorkflowData()
          this.resetState()
        }
      },
      (err) => {
        NotificationMessage.showWarning(err.message)
        this.resetState()
      },
    )
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
  handleSubmit = (data) => {
    this.copyTask({
      ...data,
      workflowName: `${this.state.workflowName}-${this.state.sequence}`,
      originalTaskId: data.id,
      position: [100, this.state.sequence * 150],
    })
  }
  handleShow = () => {
    this.setState({ show: true })
  }

  handelLoader = (value) => {
    this.setState({ loader: value })
  }
  resetState = () => {
    this.setState({
      show: false,
      showWorkflowPopup: false,
      inputValues: {},
      views: [],
      viewData: {},
      deleteData: {},
    })
  }

  render() {
    return (
      <>
        <WorkflowCanvas
          taskData={this.state.taskData}
          handleDraggable={this.handleDraggable}
          draggable={this.state.draggable}
          getTaskList={this.getTaskList}
          taskFilter={this.state.taskFilter}
          taskTotalCount={this.state.taskTotalCount}
          nodes={this.state.nodes}
          diagramReadOnly={this.state.diagramReadOnly}
          links={this.state.links}
          onLinkEnd={this.onLinkEnd}
          selectedFormTask={this.selectedFormTask}
          selectedLink={this.selectedLink}
          removeLink={this.removeLink}
          taskSearchLoader={this.state.taskSearchLoader}
          onLinkEnded={this.onLinkEnded}
          onLinkStarted={this.onLinkStarted}
        ></WorkflowCanvas>
        {this.state.show ? (
          <AdminCopyTaskPopup
            state={this.state}
            userLoader={this.state.userLoader}
            modalShow={true}
            handleChanges={this.handleChanges}
            handleShow={this.handleShow}
            formSubmissionLoader={this.state.formSubmissionLoader}
            handleClose={this.props.handleClose}
            userDropDown={this.state.userDropDown}
            inputValues={this.state.inputValues}
            resetState={this.resetState}
            handleSubmit={this.handleSubmit}
            projectDropDown={this.state.projects}
            dropDownVales={this.state.dropDownVales}
          ></AdminCopyTaskPopup>
        ) : (
          ''
        )}
        {this.state.showWorkflowPopup ? (
          <WorkflowPopup
            state={this.state}
            showWorkflowPopup={this.state.showWorkflowPopup}
            onViewClick={this.onViewClick}
            onDeleteClick={this.onDeleteClick}
            viewData={this.state.viewData}
            deleteData={this.state.deleteData}
            resetState={this.resetState}
            views={this.state.views}
          ></WorkflowPopup>
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
  return <AdminWorkflowStateComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
