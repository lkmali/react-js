import { format } from 'date-fns'
import { Component } from 'react'
import { DataTableComponent } from '../../../components/dataTable/data-table'

class ChildDataTableComponent extends Component {
  render() {
    const {
      childrens,
      filter,
      parentCheck,
      isSelect,
      onParentSelect,
      parentCheckBoxId,
      search = false,
      navigate,
      loader,
      getFormList,
      forms,
    } = this.props
    const totalCount = childrens.length
    const pageCount = Math.ceil(totalCount / filter?.itemPerPage)

    const html = childrens.map((child) => (
      <tr key={child.id}>
        <td>{child.title}</td>
        <td>{child.user.username}</td>
        <td>
          <div className='btn-group px-2'>
            <i onClick={() => forms(child.id)} className='fa-solid fa-eye'>
              <div className='tooltip'>
                <span className='tooltiptext'>View Form</span>
              </div>{' '}
            </i>
          </div>
        </td>
      </tr>
    ))
    const headerData = [
      { title: 'Title', fieldName: 'title' },
      { title: 'UserName', fieldName: 'user' },
      { title: 'Action' },
    ]

    return (
      <DataTableComponent
        count={totalCount}
        pageCount={pageCount}
        parentCheck={parentCheck}
        isSelect={isSelect}
        onParentSelect={onParentSelect}
        parentCheckBoxId={parentCheckBoxId}
        search={search}
        navigate={navigate}
        filter={filter}
        loader={loader}
        headerData={headerData}
        data={childrens}
        html={html}
        handleClick={getFormList}
      />
    )
  }
}

export default class EditTaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: ['view'],
      expandedRows: [],
    }
    this.toggleRow = this.toggleRow.bind(this)
  }

  toggleRow(id) {
    const expandedRows = [...this.state.expandedRows]
    const index = expandedRows.indexOf(id)
    if (index === -1) {
      expandedRows.push(id)
    } else {
      expandedRows.splice(index, 1)
    }
    this.setState({ expandedRows })
  }

  showDropDown = (id) => {
    if (this.state.id === id) {
      this.setState({ show: !this.state.show, id })
    } else {
      this.setState({ show: true, id })
    }
  }

  form = (id) => {
    this.props.navigate(`/home/formData/${id}`)
  }

  getHtml = (data) => {
    if (data && data.length > 0) {
      let deactivateIcon = (
        <i style={{ fontSize: '15px' }} className='text-danger fas fa-times-circle'></i>
      )
      let activateIcon = (
        <i style={{ fontSize: '15px' }} className='text-success fas fa-check-circle'></i>
      )

      return data.map((row) => {
        const isExpanded = this.state.expandedRows.includes(row.id)
        const hasChildData = row.UserProjectForms && row.UserProjectForms.length > 0

        return (
          <>
            <tr key={row.id} onClick={() => (hasChildData ? this.toggleRow(row.id) : '')}>
              <td>{row.name}</td>
              <td>{format(new Date(row.createdAt), 'dd/MM/yyyy hh:mm:ss a')}</td>
              <td>{format(new Date(row.updatedAt), 'dd/MM/yyyy hh:mm:ss a')}</td>
              <td style={{ textAlign: 'center' }}>
                <span>{row?.status ? activateIcon : deactivateIcon} </span>
              </td>
              {/* <td>
                <div className='btn-group px-2'>
                  <i onClick={() => this.form(row.id)} className='fa-solid fa-eye'>
                    <div className='tooltip'>
                      <span className='tooltiptext'>View Form</span>
                    </div>{' '}
                  </i>
                </div>
              </td> */}
              <td>
                {hasChildData ? (
                  <i
                    className={`fa fa-fw ${isExpanded ? 'fa-minus-circle' : 'fa-plus-circle'}`}
                    style={{ fontSize: '18px', cursor: 'pointer', color: 'blue' }}
                  ></i>
                ) : (
                  <i
                    className={'fa fa-fw fa-plus-circle'}
                    style={{ fontSize: '18px', cursor: 'not-allowed', color: 'gray' }}
                  ></i>
                )}
              </td>
            </tr>

            {isExpanded && hasChildData && (
              <tr>
                <td colSpan={6}>
                  <ChildDataTableComponent forms={this.form} childrens={row.UserProjectForms} />
                </td>
              </tr>
            )}
          </>
        )
      })
    } else {
      return ''
    }
  }

  render() {
    const pageCount = Math.ceil(this.props.totalCount / this?.props?.filter?.itemPerPage)
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
