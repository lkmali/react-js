import { uniqueId } from 'lodash'
import { Component } from 'react'
import { DataTableComponent } from '../../../components/dataTable/data-table'

export default class EditTaskUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: {
        Draft: 1,
        Submitted: 2,
        Verified: 3,
        Rejected: 4,
        Pending: 5,
      },
    }
  }
  getHtml = (data) => {
    const { screenType } = this.props
    if (data && data.length > 0) {
      let deactivateIcon = (
        <i style={{ fontSize: '15px' }} className='text-danger fas fa-times-circle'></i>
      )
      let activateIcon = (
        <i style={{ fontSize: '15px' }} className='text-success fas fa-check-circle'></i>
      )
      return data.map((item) => {
        return (
          <tr
            key={item.userId}
            style={
              this.props.selectedUser.indexOf(item.userId) >= 0
                ? {
                    background: '#dddddd',
                    // pointerEvents: 'none',
                  }
                : {}
            }
          >
            {screenType === 'add-users' && (
              <td>
                {' '}
                <input
                  type='checkbox'
                  name='select-all-rows'
                  aria-label='select-all-rows'
                  onChange={(e) => this.props.onChildSelect(e, item)}
                  id={uniqueId('childCheckBox-')}
                  checked={this.props.selectedUser.indexOf(item.userId) >= 0}
                  style={{
                    fontSize: '18px',
                    padding: '0px',
                    verticalAlign: 'middle',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                ></input>
              </td>
            )}
            <td>
              {item.username
                ? item.username
                : (item.firstName ? item.firstName : '') +
                  ' ' +
                  (item.lastName ? item.lastName : '')}
            </td>
            {/* {this.props.screenType === 'view-users' ? '' : <td>{item?.Roles?.[0]?.name}</td>} */}
            {/* <td>{item?.phone}</td> */}
            <td>{item?.email}</td>
            <td style={{ textAlign: 'center' }}>
              <span>{item?.isActive ? activateIcon : deactivateIcon} </span>
            </td>
          </tr>
        )
      })
    } else {
      return ''
    }
  }

  render() {
    const pageCount = Math.ceil(this.props.totalCount / this.props?.filter?.itemPerPage)
    return (
      <DataTableComponent
        count={this.props.totalCount}
        pageCount={pageCount}
        parentCheck={this.props.parentCheck}
        isSelect={this.props.isSelect}
        onParentSelect={this.props.onParentSelect}
        parentCheckBoxId={this.props.parentCheckBoxId}
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
