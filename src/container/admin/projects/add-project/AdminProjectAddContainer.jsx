import { Component } from 'react'
import restActions from '../../../../actions/rest'
import AdminProjectAddComponent from '../../../../components/admin/projects/add-project/AdminProjectAddComponent'
import { errorMessage, getAuthorizationHeaders, RestUrlHelper } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'

export default class AdminProjectAddContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValues: {
        name: '',
        description: '',
        projectOwner: '',
        priority: '',
        endDate: '',
        startDate: '',
      },
      emptyUserData: false,
      userLoader: true,
      userDropDown: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const headers = getAuthorizationHeaders()
    restActions
      .GET(`${RestUrlHelper.ADD_USER_URL}?withoutPagination=true`, { headers })
      .then((response) => {
        this.setState({
          userDropDown: response.data.data.map((x) => {
            return { name: x.username, value: x.email, email: x.email }
          }),
        })
        this.setState({ userLoader: false })
      })
      .catch((e) => {
        NotificationMessage.showError(e.message)
        this.setState({ userLoader: false, emptyUserData: true })
      })
  }

  handleChanges = (event) => {
    const target = event.target
    let value = target.value
    const name = target.name

    if (name === 'name') {
      // value = value.trim();
      if (!value.trim()) {
        value = value.trim()
      } else value = value.replace(/  +/g, ' ')
    }
    this.setState({
      [name]: value,
    })
  }

  handleSubmit(data) {
    this.setState({ formSubmissionLoader: true })
    const requestObject = {
      name: data.name,
      description: data.description,
      projectOwner: data.projectOwner,
      startDate: data.startDate,
      endDate: data.endDate,
      priority: parseInt(data.priority),
    }
    restActions.POST(RestUrlHelper.POST_PROJECT_URL, requestObject, getAuthorizationHeaders()).then(
      (res) => {
        if (res.status === 208) {
          NotificationMessage.showWarning(errorMessage.userAlreadyExists)
        } else {
          NotificationMessage.showInfo('Project Created Successfully!!')
          this.resetState(true)
        }
        this.props.getProjectList() //  Reloading project list after new creation
        this.setState({ formSubmissionLoader: false })
      },
      (err) => {
        NotificationMessage.showWarning(
          err.message ?? 'Unable to create project, Try after sometime',
        )
        this.setState({ formSubmissionLoader: false })
      },
    )
  }

  resetState = (flag) => {
    this.setState({
      inputValues: {
        name: '',
        description: '',
        projectOwner: '',
        priority: '',
        endDate: '',
        startDate: '',
      },
    })
    this.props.handleClose(flag)
  }

  render() {
    return (
      <AdminProjectAddComponent
        state={this.state}
        userLoader={this.state.userLoader}
        modalShow={this.props.modalShow}
        handleChanges={this.handleChanges}
        handleShow={this.props.handleShow}
        formSubmissionLoader={this.props.formSubmissionLoader}
        handleClose={this.props.handleClose}
        userDropDown={this.state.userDropDown}
        resetState={this.resetState}
        handleSubmit={this.handleSubmit}
      ></AdminProjectAddComponent>
    )
  }
}
