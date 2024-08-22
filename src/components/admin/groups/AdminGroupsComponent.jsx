import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminGroupAddContainer from '../../../container/admin/groups/AdminGroupAddContainer'
import AdminGroupsListContainer from '../../../container/admin/groups/AdminGroupsListContainer'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import { GROUP } from './constant'

class AdminGroupsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: false,
      totalCount: 0,
      data: [],
      show: false,
      headerData: GROUP.TABLE_HEADERS,
      filter: GROUP.FILTER_OPTIONS,
      search: true,
    }
  }

  componentDidMount() {
    this.getGroupsList(this.state.filter)
  }

  getGroupsList = (filter = this.state.filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(`${RestUrlHelper.GET_GROUPS_LIST_URL}${getQueryParameter(filter)}`, { headers })
      .then(
        (res) => {
          this.setState({ loader: false })
          const data = res.data.data
          const totalCount = data.length > 0 ? res.data.count : filter.pageOffset
          this.setState({ data, totalCount })
        },
        (err) => {
          this.setState({ loader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }

  handleShow = () => {
    this.setState({ show: true })
  }

  statusUpdate = (groupId, updateStatus) => {
    restActions
      .PATCH(
        `/admin/organization/group/${groupId}/status/${updateStatus}`,
        getAuthorizationHeaders(),
      )
      .then(
        (res) => {
          if (res) {
            NotificationMessage.showInfo(`Group Status Updated to ${updateStatus}`)
            this.getGroupsList(this.state.filter)
          }
        },
        (err) => {
          NotificationMessage.showError(err.message)
        },
      )
  }

  handleClose = (flag) => {
    this.setState({ show: false })
    // if (flag) this.getUserList(this.state.itemPerPage, this.state.pageOffset)
  }

  render() {
    return (
      <div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5>Groups </h5>
          <button className='btn btn-primary' onClick={this.handleShow}>
            <span className='d-none d-sm-block px-4'> Add New Group </span>
            <span className='d-block d-sm-none'>
              {' '}
              <i className='fas fa-plus'></i>{' '}
            </span>
          </button>
        </div>
        <AdminGroupsListContainer
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          data={this.state.data}
          navigate={this.props.navigate}
          statusUpdate={this.statusUpdate}
          getGroupsList={this.getGroupsList}
          search={this.state.search}
          filter={this.state.filter}
        ></AdminGroupsListContainer>
        <AdminGroupAddContainer
          navigate={this.props.navigate}
          modalShow={this.state.show}
          handleShow={this.handleShow}
          handleClose={this.handleClose}
          getGroupsList={this.getGroupsList}
        ></AdminGroupAddContainer>
      </div>
    )
  }
}
function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <AdminGroupsComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
