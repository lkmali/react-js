import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../../actions/rest'
import AdminGroupAddContainer from '../../../../container/admin/groups/AdminGroupAddContainer'
import AdminGroupsListContainer from '../../../../container/admin/groups/AdminGroupsListContainer'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'

class AdminUserGroupsComponent extends Component {
  constructor(props) {
    super(props)
    const userId = this.props.params?.userId
    this.state = {
      loader: false,
      totalCount: 0,
      userId,
      data: [],
      show: false,

      headerData: [
        { title: 'Group Name' },
        { title: 'Description' },
        { title: 'Created By' },
        { title: 'Created On', fieldName: 'createdAt', sorting: true },
        { title: 'Updated On', fieldName: 'updatedAt', sorting: true },
        { title: 'Status' },
        { title: 'Actions' },
      ],
      filter: {
        search: '',
        sortBy: 'name',
        orderBy: 'ASC',
        pageOffset: 0,
        itemPerPage: 10,
      },
      search: false,
    }
  }

  componentDidMount() {
    this.getUserGroups(this.state.filter)
  }

  getUserGroups = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(
        `${RestUrlHelper.GET_USERS_INFORMATION}/${this.state.userId}/groups${getQueryParameter(
          filter,
        )}`,
        { headers },
      )
      .then(
        (res) => {
          if (res.data && res.data.Groups) {
            this.setState({ data: res.data.Groups, totalCount: res.data.Groups.length })
            filter.itemPerPage = res.data.Groups.length
          }
          this.setState({ loader: false, filter })
        },
        (err) => {
          this.setState({ loader: false, filter })
          NotificationMessage.showError(err.message)
        },
      )
  }

  handleShow = () => {
    this.setState({ show: true })
  }

  handleClose = (flag) => {
    this.setState({ show: false })
    if (flag) this.getUserList(this.state.itemPerPage, this.state.pageOffset)
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
          itemPerPage={this.state.itemPerPage}
          getUserList={this.getUserList}
          getGroupsList={this.getUserGroups}
          search={this.state.search}
          filter={this.state.filter}
        ></AdminGroupsListContainer>
        <AdminGroupAddContainer
          navigate={this.props.navigate}
          modalShow={this.state.show}
          handleShow={this.handleShow}
          handleClose={this.handleClose}
        ></AdminGroupAddContainer>
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <AdminUserGroupsComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
