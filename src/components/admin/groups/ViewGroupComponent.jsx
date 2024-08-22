import { omit } from 'lodash'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import EditGroupContainer from '../../../container/admin/groups/EditGroupContainer'
import ViewGroupUser from '../../../container/admin/groups/group-user/ViewGroupUser'
import LoaderContainer from '../../../container/loader/Loader'
import { getAuthorizationHeaders, RestUrlHelper } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
class ViewGroupComponent extends Component {
  constructor(props) {
    super(props)
    const groupId = this.props.params?.groupId
    this.state = {
      groupId,
      loader: false,
      totalCount: 0,
      show: false,
      headerData: [
        { title: 'Name' },
        { title: 'Phone Number' },
        { title: 'Email' },
        { title: 'Status' },
        { title: 'Actions' },
      ],
      filter: {
        search: '',
        sortBy: 'username',
        orderBy: 'ASC',
        pageOffset: 0,
        itemPerPage: 10,
      },
      emptyData: true,
      statusLoader: false,
      formSubmissionLoader: false,
      search: false,
    }
    this.updateInputValues = this.updateInputValues.bind(this)
  }

  updateInputValues(nextState) {
    this.setState(nextState)
  }

  componentDidMount() {
    this.getGroupData(this.state.filter)
  }

  getGroupData = (filter) => {
    this.setState({ formLoader: true, emptyData: true, loader: true })
    let id = this.state.groupId
    const headers = getAuthorizationHeaders()
    restActions
      .GET(`${RestUrlHelper.GET_GROUPS_USERS_URL}/${id}/users`, { headers })
      .then((response) => {
        const inputFields = omit(response.data, ['Users'])
        filter.itemPerPage = response?.data?.Users?.length
        this.setState({
          inputFields,
          emptyData: false,
          data: response.data.Users,
          totalCount: response?.data?.Users?.length,
        })
        this.setState({ loader: false })
      })
      .catch((e) => {
        NotificationMessage.showError(e.message)
        this.setState({ loader: false, emptyData: true })
      })
  }

  updateGroup = (inputValues) => {
    this.setState({ formSubmissionLoader: true })
    let id = this.state.groupId
    restActions
      .PUT(
        `${RestUrlHelper.GET_GROUPS_USERS_URL}/${id}`,
        {
          groupName: inputValues.name,
          description: inputValues.description,
        },
        getAuthorizationHeaders(),
      )
      .then(
        (res) => {
          if (res) {
            NotificationMessage.showInfo('Group Update Successfully')
            this.getGroupData(this.state.filter)
          }
          this.setState({ formSubmissionLoader: false })
        },
        (err) => {
          this.setState({ formSubmissionLoader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }
  statusUpdate = (groupId, updateStatus) => {
    this.setState({ statusLoader: true })
    restActions
      .PATCH(
        `/admin/organization/group/${groupId}/status/${updateStatus}`,
        getAuthorizationHeaders(),
      )
      .then(
        (res) => {
          if (res) {
            NotificationMessage.showInfo(
              `Group Status Updated to ${updateStatus === 'active' ? 'active' : 'deactivate'}`,
            )
          }
          this.setState({ statusLoader: false })
          this.getGroupData(this.state.filter)
        },
        (err) => {
          this.setState({ statusLoader: false })
          NotificationMessage.showError(err.message)
        },
      )
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
        {this.state.loader ? (
          <LoaderContainer {...loaderProperty}></LoaderContainer>
        ) : this.state.emptyData ? (
          'No User Found In System'
        ) : (
          <div>
            <EditGroupContainer
              navigate={this.props.navigate}
              formSubmissionLoader={this.state.formSubmissionLoader}
              statusLoader={this.state.statusLoader}
              formLoader={this.state.loader}
              inputValues={this.state.inputFields}
              match={this.props.match}
              location={this.props.location}
              handleSubmit={this.updateGroup}
              statusUpdate={this.statusUpdate}
              groupId={this.state.groupId}
            ></EditGroupContainer>

            <ViewGroupUser
              loader={this.state.loader}
              totalCount={this.state.totalCount}
              search={this.state.search}
              navigate={this.props.navigate}
              filter={this.state.filter}
              headerData={this.state.headerData}
              data={this.state.data}
              getUserList={this.getGroupData}
            ></ViewGroupUser>
          </div>
        )}
      </>
    )
  }
}
function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <ViewGroupComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
