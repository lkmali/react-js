import { Component } from 'react'
import restActions from '../../../actions/rest'
import { DataTableComponent } from '../../../components/dataTable/data-table'
import { RestUrlHelper } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'

export default class AdminUsersListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonLoader: {},
      modifiedEmailMap: {},
      actions: ['view'], // add all your actions here and handle accordingly
    }
  }

  handleAccount = (isDeleted, email) => {
    let buttonLoader = {}
    buttonLoader[email] = true
    this.setState({ buttonLoader })
    restActions
      .PUT(isDeleted ? RestUrlHelper.ACTIVATE_USER_URL : RestUrlHelper.DEACTIVATE_USER_URL, {
        email: email,
      })
      .then(
        () => {
          NotificationMessage.showInfo(
            isDeleted ? 'User activated successfully' : 'User deactivated successfully',
          )
          let modifiedEmailMap = this.state.modifiedEmailMap
          modifiedEmailMap[email] = isDeleted ? 'Activate' : 'Deactivate'
          buttonLoader = {}
          this.setState({ buttonLoader, modifiedEmailMap })
        },
        (err) => {
          buttonLoader = {}
          this.setState({ buttonLoader })
          NotificationMessage.showError(err.message)
        },
      )
  }

  addActions = (userId) => {
    if (this.state.userId === userId) {
      this.setState({ show: !this.state.show, userId })
    } else {
      this.setState({ show: true, userId })
    }
  }
  profile = (userId) => {
    this.props.navigate(`/home/users/${userId}`)
  }

  getHtml = (data) => {
    if (data.length > 0) {
      let deactivateIcon = (
        <i style={{ fontSize: '15px' }} className='text-danger fas fa-times-circle'></i>
      )
      let activateIcon = (
        <i style={{ fontSize: '15px' }} className='text-success fas fa-check-circle'></i>
      )
      return this.props.data.map((item) => {
        return (
          <tr key={item.userId}>
            {/* <td>{(item.profileImageUrl ? item.profileImageUrl : '')}</td> */}
            <td>
              {item.username
                ? item.username
                : (item.firstName ? item.firstName : '') +
                  ' ' +
                  (item.lastName ? item.lastName : '')}
            </td>
            <td>{item.Roles[0]?.name}</td>
            <td>{item?.phone}</td>
            <td>{item?.email}</td>
            <td style={{ textAlign: 'center' }}>
              <span>{item?.isActive ? activateIcon : deactivateIcon} </span>
            </td>
            <td>
              <div className='btn-group px-2'>
                <div
                  onClick={() => this.addActions(item.userId)}
                  className='text-decoration-none color-black me-1 font-weight-bold d-flex align-items-center justify-content-between'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  {/* <span className="img-cricle me-0 me-sm-1">
                                        <img width="100%" className="rounded-circle" alt="" />
                                    </span> */}
                  {this.state.actions.length > 1 ? (
                    <span className='d-none d-sm-block'>...</span>
                  ) : (
                    <i onClick={() => this.profile(item.userId)} className='fa-solid fa-eye'>
                      <div className='tooltip'>
                        <span className='tooltiptext'>View Project</span>
                      </div>{' '}
                    </i>
                  )}
                </div>
                <div
                  className={`${
                    this.state.show && this.state.userId && this.state.userId === item.userId
                      ? 'show'
                      : ''
                  } dropdown-menu dropdown-menu-right p-0`}
                >
                  <ul className='list-group list-group-flush '>
                    <li
                      className='list-group-item py-0 list-group-item-action'
                      onClick={() => this.profile(item.userId)}
                    >
                      <button className='btn font-85 ' type='button'>
                        View Profile
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        )
      })
    } else {
      return ''
    }
  }

  render() {
    const pageCount = Math.ceil(this.props.totalCount / this.props.filter.itemPerPage)
    return (
      <DataTableComponent
        count={this.props.totalCount}
        pageCount={pageCount}
        search={this.props.search}
        navigate={this.props.navigate}
        filter={this.props.filter}
        loader={this.props.loader}
        headerData={this.props.headerData}
        data={this.props.data}
        html={this.getHtml(this.props.data)}
        handleClick={this.props.getUserList}
      ></DataTableComponent>
    )
  }
}
