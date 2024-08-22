import { uniqueId } from 'lodash'
import { Component } from 'react'
import { DataTableComponent } from '../../../components/dataTable/data-table'

export default class EditTaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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
          <tr
            key={item.id}
            style={
              this.props.selectedForm.indexOf(item.id) >= 0
                ? {
                    background: '#dddddd',
                    // pointerEvents: 'none',
                  }
                : {}
            }
          >
            <td>
              {' '}
              <input
                type='checkbox'
                name='select-all-rows'
                aria-label='select-all-rows'
                onChange={(e) => this.props.onChildSelect(e, item)}
                id={uniqueId('childCheckBox-')}
                checked={this.props.selectedForm.indexOf(item.id) >= 0}
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
        handleClick={this.props.getFormList}
      ></DataTableComponent>
    )
  }
}
