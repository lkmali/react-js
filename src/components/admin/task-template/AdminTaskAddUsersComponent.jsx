import { uniqueId } from 'lodash'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../../../actions'
import restActions from '../../../actions/rest'
import EditTaskUser from '../../../container/admin/task-template/EditTaskUser'
import LoaderContainer from '../../../container/loader/Loader'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
class AdminTaskAddUsersComponent extends Component {
  constructor(props) {
    super(props)
    const taskId = this.props.params?.taskId
    this.state = {
      taskId,
      userData: [],
      loader: false,
      totalCount: 0,
      show: false,
      headerData: [],
      filter: {
        search: '',
        sortBy: 'username',
        orderBy: 'ASC',
        pageOffset: 0,
        itemPerPage: 10,
      },
      alreadyAddedUser: [],
      selectedUser: [],
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
    if (this.props.screenType === 'view-users') {
      this.setState({
        headerData: [
          { title: 'Name', fieldName: 'username', sorting: true },
          { title: 'Phone Number', fieldName: 'phone', sorting: true },
          { title: 'Email', fieldName: 'email', sorting: true },
          { title: 'Status' },
        ],
      })
    } else {
      ;(async () => {
        await Promise.all([this.getUserList(this.state.filter)])
      })()
      this.setState({
        headerData: [
          { title: 'Name', fieldName: 'username', sorting: true },
          { title: 'Role' },
          { title: 'Phone Number', fieldName: 'phone', sorting: true },
          { title: 'Email', fieldName: 'email', sorting: true },
          { title: 'Status' },
        ],
      })
    }
    ;(async () => {
      await Promise.all([this.getTaskData()])
    })()
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.screenType !== prevProps.screenType) {
      if (this.props.screenType === 'view-users') {
        this.setState({
          headerData: [
            { title: 'Name', fieldName: 'username', sorting: true },
            { title: 'Phone Number', fieldName: 'phone', sorting: true },
            { title: 'Email', fieldName: 'email', sorting: true },
            { title: 'Status' },
          ],
        })
      } else {
        ;(async () => {
          await Promise.all([this.getUserList(this.state.filter)])
        })()
        this.setState({
          headerData: [
            { title: 'Name', fieldName: 'username', sorting: true },
            { title: 'Role' },
            { title: 'Phone Number', fieldName: 'phone', sorting: true },
            { title: 'Email', fieldName: 'email', sorting: true },
            { title: 'Status' },
          ],
        })
      }
    }
  }
  getTaskData = async () => {
    let id = this.state.taskId
    try {
      const headers = getAuthorizationHeaders()
      const response = await restActions.GET(
        `${RestUrlHelper.GET_Task_TEMPLATE_CREATE_URL}/${id}/users`,
        {
          headers,
        },
      )
      if (response.data.length > 0) {
        const data = response.data.map((value) => {
          return value.userId
        })
        if (data.length) {
          document.getElementById(this.state.parentCheckBoxId).indeterminate = true
        }
        this.setState({
          selectedUser: data,
          alreadyAddedUser: response.data,
          selectCounter: response.data.length,
        })
      }
    } catch (err) {
      //
    }
  }

  navigateAddUser = () => {
    this.props.navigate(`/home/task-template/${this.props.params?.taskId}/add-users`, {
      fromMyComponent: true,
    })
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
      const data = res.data && res.data.data ? res.data.data : []
      const totalCount = data.length > 0 && res.data.count ? res.data.count : 0
      this.setState({ userData: data, totalCount, parentCheck: false })
    } catch (err) {
      this.setState({ loader: false })
      // NotificationMessage.showError(err.message)
    }
  }

  onParentSelect = (e) => {
    const selectedUser = this.state.selectedUser
    if (e.target.checked) {
      for (const value of this.state.data) {
        if (selectedUser.indexOf(value.userId) < 0) {
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
      if (selectedUser.indexOf(userId) < 0) {
        selectedUser.push(userId)
      }
    } else if (userId && !e.target.checked) {
      selectedUser.splice(selectedUser.indexOf(userId), 1)
      this.setState({ parentCheck: false })
    }
    this.setState({ selectedUser, selectCounter: selectedUser.length })
    document.getElementById(this.state.parentCheckBoxId).indeterminate = true
  }

  addUsers = () => {
    let { alreadyAddedUser, selectedUser, taskId } = this.state
    let deletedUSer = alreadyAddedUser.filter((item) => selectedUser.indexOf(item.userId) == -1)
    const url = `${RestUrlHelper.POST_Task_TEMPLATE_CREATE_URL}/${taskId}/users`
    this.setState({ addButtonFlag: true })
    restActions.PUT(url, selectedUser).then(
      async () => {
        if (deletedUSer && deletedUSer.length) {
          deletedUSer = deletedUSer.map(({ userTaskId }) => userTaskId)
          await restActions.DELETE(url, deletedUSer)
        }
        this.setState({ addButtonFlag: false })
        NotificationMessage.showInfo('Updated User\'s into task ')
        this.props.navigate(`/home/task-template/view/${taskId}`)
      },
      (err) => {
        this.setState({ addButtonFlag: false })
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
            ) : this.props.screenType == 'view-users' ? (
              <button
                className='btn btn-primary'
                onClick={() => this.navigateAddUser(this.state.filter)}
              >
                <span className='d-none d-sm-block px-4'> Reassign User </span>
                <span className='d-block d-sm-none'>
                  {' '}
                  <i className='fas fa-plus'></i>{' '}
                </span>
              </button>
            ) : (
              <button className='btn btn-primary' onClick={this.addUsers}>
                <span className='d-none d-sm-block px-4'> Edit User </span>
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
        <EditTaskUser
          screenType={this.props.screenType}
          loader={this.state.loader}
          parentCheck={this.state.parentCheck}
          totalCount={this.state.totalCount}
          search={this.state.search}
          filter={this.state.filter}
          headerData={this.state.headerData}
          data={
            this.props.screenType === 'view-users'
              ? this.state.alreadyAddedUser
              : this.state.userData
          }
          navigate={this.props.navigate}
          selectedUser={this.state.selectedUser}
          onChildSelect={this.onChildSelect}
          onParentSelect={this.onParentSelect}
          getUserList={this.getUserList}
          alreadyAddedUser={this.state.alreadyAddedUser}
          isSelect={this.state.isSelect}
          parentCheckBoxId={this.state.parentCheckBoxId}
        ></EditTaskUser>
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  let screenType = 'view-users'
  if (params && params.screenType) {
    if (params.screenType === 'add-users') {
      screenType = 'add-users'
    }
  }
  props = { ...props, screenType }
  return <AdminTaskAddUsersComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
