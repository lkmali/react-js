import { format } from 'date-fns'
import { isNil, uniqueId } from 'lodash'
import React, { Component } from 'react'
import { DataTableComponent } from '../../../components/dataTable/data-table'
export default class SharedResourceListContainer extends Component {
  constructor(props) {
    super(props)
    this.dropdownRef = React.createRef()
    this.state = {
      status: { 1: 'Draft', 2: 'Submitted', 3: 'Verified', 4: 'Rejected', 5: 'Pending' },
      actions: ['view', 'deleted', 'reSendEmail'], // add all your actions here and handle accordingly
    }
  }
  componentDidMount() {
    // document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    // document.removeEventListener('mousedown', this.handleClickOutside);
  }
  handleClickOutside = (event) => {
    // setTimeout(() => {
    if (
      this.dropdownRef &&
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(event.target)
    ) {
      this.setState({ show: false })
    }
    // }, 1000);
  }

  showDropDown = (id) => {
    if (this.state.id === id) {
      this.setState({ show: !this.state.show, id })
    } else {
      this.setState({ show: true, id })
    }
  }
  handleDeleteData = (data) => {
    this.props.handleDeleteData(data)
  }

  reSendEmail = (data) => {
    this.props.reSendEmail(data)
  }
  form = (id) => {
    this.props.navigate(`${this.props.pathname.replaceAll('shared-resource', 'formData')}/${id}`)
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
            <td>{item.email}</td>
            <td>{item?.fromData.title}</td>
            <td>{item?.fromData?.user?.username.toUpperCase()}</td>
            <td style={{ textAlign: 'center' }}>
              {format(new Date(item?.updatedAt), 'dd/MM/yyyy')}
            </td>
            <td style={{ textAlign: 'center' }}>
              <span>{this.state.status[item?.fromData.status]} </span>
            </td>
            <td ref={this.dropdownRef} className='d-flex align-items-center justify-content-center'>
              <div className='btn-group'>
                <button
                  onClick={() => this.showDropDown(item.id)}
                  className='btn btn-light dropdown-toggle'
                  type='button'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  {/* {this.state.actions.length > 1 ? '' : <i className='fa-solid fa-eye' />}
                  <div className='tooltip'>
                    <span className='tooltiptext'>{this.state.actions.length > 1 ? 'Actions' : 'View Form'}</span>
                  </div> */}
                </button>
                <div
                  style={{ top: '88%' }}
                  className={`dropdown-menu dropdown-menu-rights ${
                    this.state.show && this.state.id === item.id ? 'show' : ''
                  }`}
                >
                  <button className='dropdown-item' onClick={() => this.form(item.userFromId)}>
                    <i className='fa-solid fa-eye' /> View Form
                  </button>
                  <button className='dropdown-item' onClick={() => this.handleDeleteData(item.id)}>
                    <i className='fa fa-trash' /> Delete Entry
                  </button>
                  <button className='dropdown-item' onClick={() => this.reSendEmail(item.email)}>
                    <i className='fa fa-repeat' /> ReSend Email
                  </button>
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
          handleClick={this.props.getSharedResourceData}
          parentCheck={this.props.parentCheck}
          isSelect={this.props.isSelect}
          onParentSelect={this.props.onParentSelect}
          parentCheckBoxId={this.props.parentCheckBoxId}
        ></DataTableComponent>
      </>
    )
  }
}
