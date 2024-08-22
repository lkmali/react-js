import { format } from 'date-fns'
import { isNil, uniqueId } from 'lodash'
import { Component } from 'react'
import { DataTableComponent } from '../../../components/dataTable/data-table'
export default class AdminFormDataListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: { 1: 'Draft', 2: 'Submitted', 3: 'Verified', 4: 'Rejected', 5: 'Pending' },
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
    this.props.navigate(`${this.props.pathname}/${id}`)
  }
  getHtml = (data) => {
    if (data.length > 0) {
      return data.map((item) => {
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
            <td>{item.title}</td>
            <td>{item?.ProjectForm?.name}</td>
            <td>{item?.ProjectForm?.Project?.name.toUpperCase()}</td>
            <td>{item?.user?.username.toUpperCase()}</td>
            <td style={{ textAlign: 'center' }}>
              {format(new Date(item.createdAt), 'dd/MM/yyyy')}
            </td>

            <td style={{ textAlign: 'center' }}>
              {format(new Date(item.updatedAt), 'dd/MM/yyyy')}
            </td>
            <td style={{ textAlign: 'center' }}>
              <span>{this.state.status[item.status]} </span>
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
                  ) : (
                    <i onClick={() => this.form(item.id)} className='fa-solid fa-eye'>
                      <div className='tooltip'>
                        <span className='tooltiptext'>View Form</span>
                      </div>{' '}
                    </i>
                  )}
                </div>
                <div
                  className={`${
                    this.props.show && this.props.id && this.props.id === item.id ? 'show' : ''
                  } dropdown-menu dropdown-menu-right p-0`}
                >
                  <ul className='list-group list-group-flush '>
                    <li
                      className='list-group-item py-0 list-group-item-action'
                      onClick={() => this.form(item.id)}
                    >
                      <button className='btn font-85 ' type='button'>
                        View Form
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
      <>
        <DataTableComponent
          count={this.props.totalCount}
          location={this.props.location}
          pageCount={pageCount}
          search={this.props.search}
          searchWithFields={this.props.searchWithFields}
          searchWithFieldsOptions={this.props.searchWithFieldsOptions}
          navigate={this.props.navigate}
          filter={this.props.filter}
          loader={this.props.loader}
          headerData={this.props.headerData}
          data={this.props.data}
          html={this.getHtml(this.props.data)}
          handleClick={this.props.getFormDataList}
          parentCheck={this.props.parentCheck}
          isSelect={this.props.isSelect}
          onParentSelect={this.props.onParentSelect}
          parentCheckBoxId={this.props.parentCheckBoxId}
        ></DataTableComponent>
      </>
    )
  }
}
