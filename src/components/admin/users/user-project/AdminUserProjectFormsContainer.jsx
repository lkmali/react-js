import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../../actions/rest'
import AdminProjectListContainer from '../../../../container/admin/projects/AdminProjectListContainer'
import AdminProjectAddContainer from '../../../../container/admin/projects/add-project/AdminProjectAddContainer'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
class AdminUserProjectsContainer extends Component {
  constructor(props) {
    super(props)
    const userId = this.props.params?.userId
    this.state = {
      loader: false,
      userId,
      totalCount: 0,
      data: [],
      show: false,
      headerData: [
        { title: 'Project Name' },
        { title: 'Project Description' },
        { title: 'Project Created By' },
        { title: 'Project Owner' },
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
    this.getProjectList(this.state.filter)
  }

  getProjectList = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(
        `${RestUrlHelper.GET_USERS_INFORMATION}/${this.state.userId}/projects${getQueryParameter(
          filter,
        )}`,
        { headers },
      )
      .then(
        (res) => {
          if (res.data && res.data.projects) {
            this.setState({ data: res.data.projects, totalCount: res.data.projects.length })
            filter.itemPerPage = res.data.projects.length
          }
          this.setState({ loader: false, filter })
        },
        (err) => {
          this.setState({ loader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }

  handleClose = () => {
    this.setState({ show: false })
  }
  handleShow = () => {
    this.setState({ show: true })
  }

  handelLoader = (value) => {
    this.setState({ loader: value })
  }

  render() {
    return (
      <>
        <div
          className='d-flex justify-content-between align-items-center mb-3'
          style={{ flexDirection: 'row-reverse' }}
        >
          <button className='btn btn-primary' onClick={() => this.setState({ show: true })}>
            <span className='d-none d-sm-block px-4'> Create Project </span>
            <span className='d-block d-sm-none'>
              {' '}
              <i className='fas fa-plus'></i>{' '}
            </span>
          </button>
        </div>
        <AdminProjectListContainer
          handelLoader={this.handelLoader}
          navigate={this.props.navigate}
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          itemPerPage={this.state.itemPerPage}
          data={this.state.data}
          getProjectList={this.getProjectList}
          search={this.state.search}
          filter={this.state.filter}
        ></AdminProjectListContainer>
        {this.state.show ? (
          <AdminProjectAddContainer
            handelLoader={this.handelLoader}
            modalShow={this.state.show}
            handleShow={this.handleShow}
            handleClose={this.handleClose}
          ></AdminProjectAddContainer>
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
  return <AdminUserProjectsContainer {...props} navigate={navigate} params={params} />
}

export default WithNavigate
