import { format } from 'date-fns'
import { isNil, uniqueId } from 'lodash'
import { Component } from 'react'
import { DataTableComponent } from '../../../components/dataTable/data-table'
export default class AdminFormListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: ['view'], // add all your actions here and handle accordingly
    }
  }

  showDropDown = (id) => {
    if (this.state.id === id) {
      this.setState({ show: !this.state.show, id })
    } else {
      this.setState({ show: true, id })
    }
  }
  form = (id) => {
    this.props.navigate(`/home/forms/view/${id}`)
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
        return (
          <tr key={item.id}>
            <td style={this.props.isSelect ? {} : { display: 'none' }}>
              {' '}
              {''}
              <input
                type='checkbox'
                name='select-all-rows'
                aria-label='select-all-rows'
                onChange={(e) => this.props.onChildSelect(e, item)}
                id={uniqueId('childCheckBox-')}
                checked={
                  !isNil(this.props.selectedFormData) &&
                  this.props.selectedFormData.indexOf(item.id) >= 0
                }
                style={{
                  fontSize: '18px',
                  padding: '0px',
                  verticalAlign: 'middle',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              ></input>
            </td>
            <td>{item.name}</td>
            {/* <td>{item?.Project?.name}</td> */}
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
                  {this.state.actions.length > 1 ? (
                    <span className='d-none d-sm-block'>...</span>
                  ) : this.props?.isView ? (
                    <i onClick={() => this.form(item.id)} className='fa-solid fa-eye'>
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
        count={this.props.totalCount}
        pageCount={pageCount}
        search={this.props.search}
        location={this.props.location}
        navigate={this.props.navigate}
        filter={this.props.filter}
        loader={this.props.loader}
        searchWithFields={this.props.searchWithFields}
        searchWithFieldsOptions={this.props.searchWithFieldsOptions}
        headerData={this.props.headerData}
        data={this.props.data}
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
