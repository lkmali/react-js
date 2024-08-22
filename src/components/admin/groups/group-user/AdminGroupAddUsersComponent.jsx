import { uniqueId } from 'lodash'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../../../../actions'
import restActions from '../../../../actions/rest'
import AddGroupsUser from '../../../../container/admin/groups/group-user/AddUserToGroup'
import LoaderContainer from '../../../../container/loader/Loader'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
class AdminGroupAddUsersComponent extends Component {
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
        { title: 'Name', fieldName: 'username', sorting: true },
        { title: 'Role' },
        { title: 'Phone Number', fieldName: 'phone', sorting: true },
        { title: 'Email', fieldName: 'email', sorting: true },
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
      search: true,
      isSelect: true,
      parentCheck: false,
      addButtonFlag: false,
      parentCheckBoxId: uniqueId('parentCheckBox-'),
    }
  }

  componentDidMount() {
    ;(async () => {
      await Promise.all([this.getGroupData(), this.getUserList(this.state.filter)])
    })()
  }

  getGroupData = async () => {
    let id = this.state.groupId
    try {
      const headers = getAuthorizationHeaders()
      const response = await restActions.GET(`${RestUrlHelper.GET_GROUPS_USERS_URL}/${id}/users`, {
        headers,
      })
      if (response.data.Users.length > 0) {
        const data = response.data.Users.map((value) => {
          return value.email
        })
        this.setState({ alreadyAddedUser: data })
      }
    } catch (err) {
      //
    }
  }

  getUser = (filter) => {
    ;(async () => {
      await this.getUserList(filter)
    })()
  }

  getUserList = async (filter) => {
    try {
      const headers = { Authorization: `Bearer ${storageActions.getItem('token')}` }
      this.setState({ loader: true, filter })
      const res = await restActions.GET(
        `${RestUrlHelper.GET_USER_LIST_URL}${getQueryParameter(filter)}`,
        { headers },
      )
      this.setState({ loader: false })
      const data = res.data.data
      const totalCount = data && data.length > 0 ? res.data.count : 0
      this.setState({ data, totalCount, parentCheck: false })
    } catch (err) {
      this.setState({ loader: false })
      NotificationMessage.showError(err.message)
    }
  }

  onParentSelect = (e) => {
    const selectedUser = this.state.selectedUser
    if (e.target.checked) {
      for (const value of this.state.data) {
        if (
          selectedUser.indexOf(value.email) < 0 &&
          this.state.alreadyAddedUser.indexOf(value.email) < 0
        ) {
          selectedUser.push(value.email)
        }
      }
    } else {
      for (const value of this.state.data) {
        selectedUser.splice(selectedUser.indexOf(value.email), 1)
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
    const email = value.email
    if (email && e.target.checked) {
      if (selectedUser.indexOf(email) < 0 && this.state.alreadyAddedUser.indexOf(value.email)) {
        selectedUser.push(email)
      }
    } else if (email && !e.target.checked) {
      selectedUser.splice(selectedUser.indexOf(email), 1)
      this.setState({ parentCheck: false })
    }
    this.setState({ selectedUser, selectCounter: selectedUser.length })

    document.getElementById(this.state.parentCheckBoxId).indeterminate = true
  }

  addUsers = () => {
    const groupId = this.state.groupId
    const data = this.state.selectedUser
    if (data.length <= 0) {
      return
    }
    this.setState({ addButtonFlag: true })
    // this.setState({ formSubmissionLoader: true })
    const URL = `${RestUrlHelper.ADD_GROUP_USERS_URL}/${groupId}/users`
    restActions.PUT(URL, data).then(
      () => {
        this.setState({ addButtonFlag: false })
        NotificationMessage.showInfo('Added User\'s into group ')
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
              <button className='btn btn-primary' onClick={this.addUsers}>
                <span className='d-none d-sm-block px-4'> Add User To Group </span>
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

        <AddGroupsUser
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
        ></AddGroupsUser>
      </div>
    )
  }
}
function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <AdminGroupAddUsersComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
