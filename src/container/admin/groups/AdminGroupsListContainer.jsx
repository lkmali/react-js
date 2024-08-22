import { format } from 'date-fns'
import { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { DataTableComponent } from '../../../components/dataTable/data-table'
import { ellipsis } from '../../../helper'
export default class AdminGroupsListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: ['view'], // add all your actions here and handle accordingly
    }
  }

  group = (id) => {
    this.props.navigate(`/home/groups/${id}`)
  }
  showDropDown = (id) => {
    if (this.state.id === id) {
      this.setState({ show: !this.state.show, id })
    } else {
      this.setState({ show: true, id })
    }
  }

  status = (groupId, isActiveGroup) => {
    const updateStatus = isActiveGroup ? 'inActive' : 'active'
    confirmAlert({
      message: isActiveGroup
        ? 'Are you sure you want to deactivate?'
        : 'Are you sure you want to activate?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.props.statusUpdate(groupId, updateStatus)
          },
        },
        {
          label: 'No',
        },
      ],
    })
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
          <tr key={item.id}>
            <td>{ellipsis(item.name, 15)}</td>
            <td>{ellipsis(item.description, 15)}</td>
            <td>{item?.createdByUser?.username.toUpperCase()}</td>
            <td>{format(new Date(item.createdAt), 'dd/MM/yyyy')}</td>
            <td>{format(new Date(item.updatedAt), 'dd/MM/yyyy')}</td>
            <td style={{ textAlign: 'left' }}>
              <span>{item.isActive ? activateIcon : deactivateIcon} </span>
            </td>
            <td>
              <div className='btn-group px-2'>
                <div
                  onClick={() => this.showDropDown(item.id)}
                  className='text-decoration-none color-black me-1 font-weight-bold d-flex align-items-center justify-content-between'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  {/* <span className="img-cricle me-0 me-sm-1">
                                <img width="100%" className="rounded-circle" alt="" />
                            </span> */}
                  {/* <span className='d-none d-sm-block'>. . .</span> */}
                  {this.state.actions.length > 1 ? (
                    <span className='d-none d-sm-block'>...</span>
                  ) : (
                    <i onClick={() => this.group(item.id)} className='fa-solid fa-eye'>
                      <div className='tooltip'>
                        <span className='tooltiptext'>View Project</span>
                      </div>{' '}
                    </i>
                  )}
                </div>
                <div
                  className={`${
                    this.state.show && this.state.id && this.state.id === item.id ? 'show' : ''
                  } dropdown-menu dropdown-menu-right p-0`}
                >
                  <ul className='list-group list-group-flush '>
                    <li
                      className='list-group-item py-0 list-group-item-action'
                      onClick={() => this.group(item.id)}
                    >
                      <button className='btn font-85 ' type='button'>
                        View Group
                      </button>
                    </li>
                    <li
                      className='list-group-item py-0 list-group-item-action'
                      onClick={() => this.status(item.id, item.isActive)}
                    >
                      <button className='btn font-85 ' type='button'>
                        {item.isActive ? 'De-Active' : 'Active'}
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
        updateGroupStatus={this.props.updateGroupStatus}
        handleClick={this.props.getGroupsList}
      ></DataTableComponent>
    )
  }
}
