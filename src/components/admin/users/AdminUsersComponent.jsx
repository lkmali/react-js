import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../../../actions'
import restActions from '../../../actions/rest'
import AdminUsersAddContainer from '../../../container/admin/users/AdminUsersAddContainer'
import AdminUsersListContainer from '../../../container/admin/users/AdminUsersListContainer'
import { getQueryParameter, RestUrlHelper } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import { USER } from './constant'
class AdminUsersComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loader: false,
      totalCount: 0,
      show: false,
      headerData: USER.TABLE_HEADERS,
      filter: USER.FILTER_OPTIONS,
      search: true,
    }
  }

  componentDidMount() {
    this.getUserList(this.state.filter)
  }

  getUserList = (filter) => {
    const headers = { Authorization: `Bearer ${storageActions.getItem('token')}` }
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(`${RestUrlHelper.GET_USER_LIST_URL}${getQueryParameter(filter)}`, { headers })
      .then(
        (res) => {
          this.setState({ loader: false })
          const data = res.data.data
          const totalCount = data.length > 0 ? res.data.count : 0
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

  handleClose = (flag) => {
    this.setState({ show: false })
    if (flag) this.getUserList(this.state.filter)
  }

  render() {
    return (
      <div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5>Users </h5>
          <button className='btn btn-primary' onClick={this.handleShow}>
            <span className='d-none d-sm-block px-4'> Add new user </span>
            <span className='d-block d-sm-none'>
              {' '}
              <i className='fas fa-plus'></i>{' '}
            </span>
          </button>
        </div>
        <AdminUsersListContainer
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          search={this.state.search}
          filter={this.state.filter}
          headerData={this.state.headerData}
          data={this.state.data}
          navigate={this.props.navigate}
          getUserList={this.getUserList}
        ></AdminUsersListContainer>
        {this.state.show ? (
          <AdminUsersAddContainer
            modalShow={this.state.show}
            handleShow={this.handleShow}
            handleClose={this.handleClose}
          ></AdminUsersAddContainer>
        ) : (
          ''
        )}
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <AdminUsersComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
