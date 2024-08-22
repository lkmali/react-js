import { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../../actions/rest'
import AdminProjectViewContainer from '../../../../container/admin/projects/view-project/AdminProjectViewContainer'
import LoaderContainer from '../../../../container/loader/Loader'
import { RestUrlHelper, errorMessage, getAuthorizationHeaders } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
class ViewProjectComponent extends Component {
  constructor(props) {
    super(props)
    const projectId = this.props.params?.id
    this.state = {
      projectId,
      formLoader: true,
      inputFields: {
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        username: '',
        email: '',
        phone: '',
        org: '',
        role: '',
        isActive: false,
      },
      emptyUserData: false,
      userLoader: true,
      userDropDown: [],
      emptyData: false,
      statusLoader: false,
      formSubmissionLoader: false,
    }
    this.updateInputValues = this.updateInputValues.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  updateInputValues(nextState) {
    this.setState(nextState)
  }
  componentDidMount() {
    this.getProjectData()
    const headers = getAuthorizationHeaders()
    restActions
      .GET(`${RestUrlHelper.ADD_USER_URL}?withoutPagination=true`, { headers })
      .then((response) => {
        this.setState({
          userDropDown: response.data.data.map((x) => {
            return { name: x.username, value: x.userId, email: x.email }
          }),
        })
        this.setState({ userLoader: false })
      })
      .catch((e) => {
        NotificationMessage.showError(e.message)
        this.setState({ userLoader: false, emptyUserData: true })
      })
  }
  handleSubmit(data) {
    this.setState({ formSubmissionLoader: true })
    const requestObject = {
      name: data.name,
      description: data.description,
      projectOwner: data.projectOwnerId,
      startDate: data.startDate,
      endDate: data.endDate,
      priority: parseInt(data.priority),
    }
    restActions
      .PUT(`${RestUrlHelper.POST_PROJECT_URL}/${data.id}`, requestObject, getAuthorizationHeaders())
      .then(
        (res) => {
          if (res.status === 208) {
            NotificationMessage.showWarning(errorMessage.userAlreadyExists)
          } else {
            NotificationMessage.showInfo('Project Updated Successfully!!')
            this.getProjectData()
          }
          this.setState({ formSubmissionLoader: false })
        },
        (err) => {
          NotificationMessage.showWarning(err.message ?? 'something went wrong during update')
          this.setState({ formSubmissionLoader: false })
        },
      )
  }
  getProjectData = () => {
    let id = this.state.projectId
    this.setState({ formLoader: true })
    const headers = getAuthorizationHeaders()
    restActions
      .GET(`${RestUrlHelper.GET_PROJECT_LIST}/${id}`, { headers })
      .then((response) => {
        this.setState({
          inputFields: response.data,
        })
        this.setState({ formLoader: false, statusLoader: false })
      })
      .catch((e) => {
        NotificationMessage.showError(e.message)
        this.setState({ formLoader: false, emptyData: true, statusLoader: false })
      })
  }
  handleStatus = (inputValues) => {
    const status = inputValues?.isActive ? 'inActive' : 'active'
    confirmAlert({
      message: inputValues?.isActive
        ? 'Are you sure you want to deactivate?'
        : 'Are you sure you want to activate?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({ statusLoader: true })
            restActions
              .PATCH(`/admin/project/${inputValues.id}/status/${status}`, getAuthorizationHeaders())
              .then(
                (res) => {
                  if (res) {
                    NotificationMessage.showInfo(
                      `project ${inputValues?.isActive ? 'deactivate' : 'active'} Successfully!`,
                    )
                    this.getProjectData()
                  }
                },
                (err) => {
                  NotificationMessage.showError(err.message)
                },
              )
          },
        },
        {
          label: 'No',
        },
      ],
    })
  }

  render() {
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#186881',
      visible: true,
    }
    return (
      <>
        {this.state.formLoader ? (
          <LoaderContainer {...loaderProperty}></LoaderContainer>
        ) : this.state.emptyData ? (
          ''
        ) : (
          <AdminProjectViewContainer
            navigate={this.props.navigate}
            formSubmissionLoader={this.state.formSubmissionLoader}
            statusLoader={this.state.statusLoader}
            userDropDown={this.state.userDropDown}
            userLoader={this.state.userLoader}
            formLoader={this.state.formLoader}
            inputValues={this.state.inputFields}
            match={this.props.match}
            projectId={this.state.projectId}
            location={this.props.location}
            handleSubmit={this.handleSubmit}
            handleStatus={this.handleStatus}
          ></AdminProjectViewContainer>
        )}
      </>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <ViewProjectComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
