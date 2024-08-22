import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../../actions/rest'
import AdminFormListContainer from '../../../../container/admin/forms/AdminFormListContainer'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
import AdminFormAddContainer from '../../forms/AdminFormAddComponent'
class AdminUserProjectFormsContainer extends Component {
  constructor(props) {
    super(props)
    const userId = this.props.params?.userId
    this.state = {
      data: [],

      loader: false,
      totalCount: 0,
      show: false,
      userId,

      headerData: [
        { title: 'Form Name' },
        { title: 'Project Name' },
        { title: 'Form Created By' },
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
      search: true,
    }
  }

  componentDidMount() {
    this.getFormList(this.state.filter)
  }

  getFormList = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(
        `${RestUrlHelper.GET_USERS_INFORMATION}/${
          this.state.userId
        }/project-forms${getQueryParameter(filter)}`,
        { headers },
      )
      .then(
        (res) => {
          if (res.data && res.data.projectForms) {
            this.setState({ data: res.data.projectForms, totalCount: res.data.projectForms.length })
            // filter.itemPerPage = res.data.projectForms.length
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

  createForm = () => {
    this.props.navigate('/home/forms/create')
  }

  render() {
    return (
      <>
        <div
          className='d-flex justify-content-between align-items-center mb-3'
          style={{ flexDirection: 'row-reverse' }}
        >
          <button className='btn btn-primary' onClick={() => this.createForm()}>
            <span className='d-none d-sm-block px-4'> Create Form </span>
            <span className='d-block d-sm-none'>
              {' '}
              <i className='fas fa-plus'></i>{' '}
            </span>
          </button>
        </div>
        <AdminFormListContainer
          handelLoader={this.handelLoader}
          navigate={this.props.navigate}
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          data={this.state.data}
          getFormList={this.getFormList}
          isView={true}
          search={this.state.search}
          filter={this.state.filter}
        ></AdminFormListContainer>
        {this.state.show ? (
          <AdminFormAddContainer
            handelLoader={this.handelLoader}
            modalShow={this.state.show}
            handleShow={this.handleShow}
            handleClose={this.handleClose}
          ></AdminFormAddContainer>
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
  return <AdminUserProjectFormsContainer {...props} navigate={navigate} params={params} />
}

export default WithNavigate
