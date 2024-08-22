import { uniqueId } from 'lodash'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../../actions/rest'
import DeleteUserFromGroupContainer from '../../../../container/admin/groups/group-user/DeleteUserFromGroup'
import LoaderContainer from '../../../../container/loader/Loader'
import { RestUrlHelper, getAuthorizationHeaders } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
class AdminGroupDeleteUsersComponent extends Component {
  constructor(props) {
    super(props)
    const groupId = this.props.params?.groupId
    // this.addUsers = this.addUsers.bind(this);
    this.state = {
      groupId,
      data: [],
      loader: false,
      totalCount: 0,
      show: false,
      headerData: [
        { title: 'Name' },
        { title: 'Phone Number' },
        { title: 'Email' },
        { title: 'Status' },
      ],
      filter: {
        search: '',
        sortBy: 'username',
        orderBy: 'ASC',
        pageOffset: 0,
        itemPerPage: 10,
      },
      selectedUser: [],
      alreadyAddedUser: [],
      isEnableAddUserButton: false,
      selectCounter: 0,
      search: false,
      isSelect: true,
      parentCheck: false,
      addButtonFlag: false,
      parentCheckBoxId: uniqueId('parentCheckBox-'),
    }
  }

  componentDidMount() {
    this.getUser(this.state.filter)
  }

  getGroupData = async (filter) => {
    let id = this.state.groupId
    this.setState({ loader: true })
    try {
      const headers = getAuthorizationHeaders()
      const response = await restActions.GET(`${RestUrlHelper.GET_GROUPS_USERS_URL}/${id}/users`, {
        headers,
      })
      if (response?.data?.Users?.length > 0) {
        filter.itemPerPage = response?.data?.Users?.length
        this.setState({
          data: response.data.Users,
          totalCount: response?.data?.Users?.length,
        })
        this.setState({ loader: false, statusLoader: false })
      }
      this.setState({ loader: false })
    } catch (err) {
      NotificationMessage.showError(err.message)
      this.setState({ loader: false })
    }
  }

  getUser = (filter) => {
    ;(async () => {
      await this.getGroupData(filter)
    })()
  }

  onParentSelect = (e) => {
    const selectedUser = this.state.selectedUser
    if (e.target.checked) {
      for (const value of this.state.data) {
        if (
          selectedUser.indexOf(value.userId) < 0 &&
          this.state.alreadyAddedUser.indexOf(value.userId) < 0
        ) {
          selectedUser.push(value.userId)
        }
      }
    } else {
      for (const value of this.state.data) {
        selectedUser.splice(selectedUser.indexOf(value.userId), 1)
      }
    }
    this.setState({
      selectedUser,
      selectCounter: selectedUser.length,
      parentCheck: e.target.checked,
    })
  }
  onChildSelect = (e, value) => {
    const selectedUser = this.state.selectedUser
    const userId = value.userId
    if (userId && e.target.checked) {
      if (selectedUser.indexOf(userId) < 0 && this.state.alreadyAddedUser.indexOf(value.userId)) {
        selectedUser.push(userId)
      }
    } else if (userId && !e.target.checked) {
      selectedUser.splice(selectedUser.indexOf(userId), 1)
      this.setState({ parentCheck: false })
    }
    this.setState({ selectedUser, selectCounter: selectedUser.length })

    document.getElementById(this.state.parentCheckBoxId).indeterminate = true
  }

  deleteUsers = () => {
    const groupId = this.state.groupId
    const data = this.state.selectedUser
    if (data.length <= 0) {
      return
    }
    this.setState({ addButtonFlag: true })
    const headers = getAuthorizationHeaders()
    // this.setState({ formSubmissionLoader: true })
    const URL = `${RestUrlHelper.ADD_GROUP_USERS_URL}/${groupId}/users`
    restActions.DELETE(URL, data, { headers }).then(
      () => {
        this.setState({ addButtonFlag: false })
        NotificationMessage.showInfo('user deleted successfully')
        this.props.navigate(`/home/groups/${groupId}`)
      },
      (err) => {
        // this.setState({ formSubmissionLoader: false });
        NotificationMessage.showError(err.message)
      },
    )
  }

  render() {
    const loaderProperty = {
      type: 'Circles',
      height: 15,
      width: 15,
      color: '#e84546',
      visible: true,
    }
    return (
      <div>
        {this.state.selectedUser.length > 0 ? (
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5>Selected User {this.state.selectCounter} </h5>
            {this.state?.addButtonFlag ? (
              <button className='btn btn-primary px-5 me-5' disabled>
                <LoaderContainer {...loaderProperty}></LoaderContainer>
              </button>
            ) : (
              <button className='btn btn-primary' onClick={this.deleteUsers}>
                <span className='d-none d-sm-block px-4'> Delete User from Group </span>
                <span className='d-block d-sm-none'>
                  {' '}
                  <i className='fas fa-plus'></i>{' '}
                </span>
              </button>
            )}
          </div>
        ) : (
          ''
        )}

        <DeleteUserFromGroupContainer
          loader={this.state.loader}
          parentCheck={this.state.parentCheck}
          totalCount={this.state.totalCount}
          search={this.state.search}
          filter={this.state.filter}
          headerData={this.state.headerData}
          data={this.state.data}
          alreadyAddedUser={this.state.alreadyAddedUser}
          navigate={this.props.navigate}
          selectedUser={this.state.selectedUser}
          onChildSelect={this.onChildSelect}
          onParentSelect={this.onParentSelect}
          getUserList={this.getUser}
          isSelect={this.state.isSelect}
          parentCheckBoxId={this.state.parentCheckBoxId}
        ></DeleteUserFromGroupContainer>
      </div>
    )
  }
}
function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <AdminGroupDeleteUsersComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
