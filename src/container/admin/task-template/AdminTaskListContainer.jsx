import { format } from 'date-fns'
import { uniqueId } from 'lodash'
import { Component } from 'react'
import { DataTableComponent } from '../../../components/dataTable/data-table'
export default class AdminTaskListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: ['view'],
      status: {
        0: { name: 'InActive', color: 'black' },
        1: { name: 'Draft', color: 'black' },
        2: { name: 'Submitted', color: 'green' },
        3: { name: 'Verified', color: 'blue' },
        4: { name: 'Rejected', color: 'orange' },
        5: { name: 'Pending', color: 'orange' },
        6: { name: 'ParleyRejected', color: 'orange' },
        7: { name: 'completed', color: 'violet' },
      },
    }
  }

  showDropDown = (id) => {
    if (this.state.id === id) {
      this.setState({ show: !this.state.show, id })
    } else {
      this.setState({ show: true, id })
    }
  }
  task = (id) => {
    this.props.navigate(`/home/task-template/view/${id}`)
  }
  onSelectClone = (id) => {
    this.props.onSelectClone(id)
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
        const textStyle = item.isOverDue
          ? {
              'font-weight': 'bold',
              color: '#ff0000',
            }
          : {}
        return (
          <tr key={item.userTaskId ?? item.id}>
            <td style={this.props.isSelect ? {} : { display: 'none' }}>
              <input
                type='checkbox'
                name='select-all-rows'
                aria-label='select-all-rows'
                onChange={(e) => this.props.onChildSelect(e, item)}
                id={uniqueId('childCheckBox-')}
                checked={this.props.selectedFormData.indexOf(item.id) >= 0}
                style={{
                  fontSize: '18px',
                  padding: '0px',
                  verticalAlign: 'middle',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              ></input>
            </td>
            <td style={{ ...textStyle }}>{item.name}</td>
            {/* <td>{item?.Project?.name}</td> */}
            <td>{item?.createdByUser?.username.toUpperCase()}</td>
            <td style={{ textAlign: 'center' }}>
              {format(new Date(item.createdAt), 'dd/MM/yyyy')}
            </td>

            <td style={{ textAlign: 'center' }}>
              {format(new Date(item.updatedAt), 'dd/MM/yyyy')}
            </td>
            <td style={{ textAlign: 'center' }}>
              <span>{item?.isPublish ? activateIcon : deactivateIcon} </span>
            </td>
            {/* <td>{item?.user?.username.toUpperCase()}</td> */}
            {/* <td>{format(new Date(item.startDate), 'dd/MM/yyyy')}</td>
            <td>{format(new Date(item.endDate), 'dd/MM/yyyy')}</td> */}
            <td style={{ textAlign: 'center' }}>
              <span>{item?.isActive ? activateIcon : deactivateIcon} </span>
            </td>
            {/* <td
              style={{
                textAlign: 'center',
                color: this.state.status[item.status].color,
              }}
            >
              <span>{this.state.status[item.status].name} </span>
            </td> */}
            <td style={{ textAlign: 'center' }}>
              <div className='btn-group px-2'>
                <div
                  onClick={() => this.showDropDown(item.id)}
                  className='text-decoration-none color-black me-1 font-weight-bold d-flex align-items-center justify-content-between'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  {this.state.actions.length > 1 ? (
                    <span className='d-none d-sm-block'>...</span>
                  ) : this.props?.isView ? (
                    <i onClick={() => this.task(item.id)} className='fa-solid fa-eye'>
                      <div className='tooltip'>
                        <span className='tooltiptext'>View Project</span>
                      </div>{' '}
                    </i>
                  ) : (
                    ''
                  )}

                  {this.state.actions.length > 1 ? (
                    <span className='d-none d-sm-block'>...</span>
                  ) : this.props?.isCloneButton ? (
                    <button
                      className='btn font-85 btn-primary'
                      onClick={() => this.onSelectClone(item.id)}
                      type='button'
                    >
                      Clone Form
                    </button>
                  ) : (
                    ''
                  )}
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
        location={this.props.location}
        isPaginationStore={this.props.isPaginationStore}
        currentPage={this.props.currentPage}
        count={this.props.totalCount}
        pageCount={pageCount}
        search={this.props.search}
        navigate={this.props.navigate}
        filter={this.props.filter}
        loader={this.props.loader}
        headerData={this.props.headerData}
        data={this.props.data}
        searchWithFields={this.props.searchWithFields}
        searchWithFieldsOptions={this.props.searchWithFieldsOptions}
        html={this.getHtml(this.props.data)}
        handleClick={this.props.getFormList}
        parentCheck={this.props.parentCheck}
        isSelect={this.props.isSelect}
        onParentSelect={this.props.onParentSelect}
        parentCheckBoxId={this.props.parentCheckBoxId}
      ></DataTableComponent>
    )
  }
}
