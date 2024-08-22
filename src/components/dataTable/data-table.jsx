import { isNil } from 'lodash'
import { Component } from 'react'
import SelectSearch from 'react-select-search'
import LoaderContainer from '../../container/loader/Loader'
import PaginationContainer from '../../container/pagination/Pagination'
import './dataTable.css'
export class DataTableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageInfo: 1,
      show: false,
      filterBy: [],
      filterDropdownOpen: false,
      searchBy: this.getSearchBy(this.props.filter),
      search: this.getSearch(this.props.filter),
    }
  }
  componentDidMount() {
    const { state } = this?.props?.location || {}
    if (state) {
      let searchObj = {}
      if (state.searchBy) {
        searchObj.searchBy = state.searchBy
      }
      if (state.search) {
        searchObj.search = state.search
      }
      this.setState(searchObj, () => this.searchTextWithKey())
    }
  }

  getSearchBy(filter) {
    if (!isNil(filter) && !isNil(filter.searchBy) && filter.searchBy.length > 0) {
      return filter.searchBy
    } else {
      return ''
    }
  }
  getSearch(filter) {
    if (!isNil(filter) && !isNil(filter.search) && filter.search.length > 0) {
      return filter.search
    } else {
      return ''
    }
  }

  handleClick = (pageNumber) => {
    const pageOffset = (pageNumber - 1) * this.props?.filter?.itemPerPage
    this.props.handleClick({
      ...this.props.filter,
      pageOffset,
      pageNumber,
    })
    this.setState({ pageInfo: pageNumber })
  }
  searchText = (event) => {
    const { searchBy } = this.state
    this.props.handleClick({
      ...this.props.filter,
      pageOffset: 0,
      search: event?.target?.value,
      searchBy,
    })
  }
  searchTextWithKey = () => {
    const { searchBy, search } = this.state
    this.props.handleClick({
      ...this.props.filter,
      pageOffset: 0,
      search,
      searchBy,
    })
  }
  sortValue = (sortBy) => {
    this.props.handleClick({
      ...this.props.filter,
      sortBy,
      pageOffset: 0,
      orderBy: this.props.filter.orderBy === 'ASC' ? 'DESC' : 'ASC',
    })
  }

  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return items
      }
      const updatedItems = items.filter((list) => {
        return list?.name.toLowerCase().includes(searchValue)
      })
      return updatedItems
    }
  }
  handleFilterDropdownToggle = () => {
    this.setState({ filterDropdownOpen: !this.state.filterDropdownOpen })
  }

  handleFilterChange = (event) => {
    this.setState({ filterValue: event.target.value })
  }

  handleFilterSelect = (fieldName, value) => {
    const { filterBy } = this.state
    let updatedFilterBy = [...filterBy]
    const index = updatedFilterBy.findIndex((obj) => Object.keys(obj)[0] === fieldName)
    if (value === '') {
      if (index !== -1) {
        updatedFilterBy.splice(index, 1)
      }
    } else {
      const newObj = { [fieldName]: value }
      if (index !== -1) {
        updatedFilterBy[index] = newObj
      } else {
        updatedFilterBy.push(newObj)
      }
    }
    this.setState({
      filterBy: updatedFilterBy,
      filterDropdownOpen: false,
    })

    const { searchBy, search } = this.state
    this.props.handleClick({
      ...this.props.filter,
      pageOffset: 0,
      search,
      searchBy,
      filterBy: updatedFilterBy,
    })
  }

  render() {
    const { searchWithFieldsOptions } = this.props
    const { selectedFilter, searchBy, search, filterDropdownOpen } = this.state
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#e84546',
      visible: true,
    }
    return (
      <div>
        {this.props.search ? (
          <div className='row search-container'>
            <div className='col-md-6'>
              <div className='searchBar'>
                <i className='fa fa-search search-icon'></i>
                <input
                  onKeyUp={(e) => this.searchText(e)}
                  type='text'
                  className='form-control border searchBar-input'
                  placeholder='Search'
                  aria-label='Search'
                  aria-describedby='basic-addon1'
                ></input>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'none' }}></div>
        )}

        {this.props.searchWithFields ? (
          <div className='row search-container'>
            <div className='col-md-6'>
              <div className='input-group' style={{ flexWrap: 'nowrap' }}>
                <div className='searchBar'>
                  <i className='fa fa-search search-icon'></i>
                  <input
                    onChange={(e) =>
                      this.setState({ search: e?.target?.value }, () => this.searchTextWithKey())
                    }
                    style={{ height: '35px' }}
                    type='text'
                    value={search}
                    className='form-control border searchBar-input'
                    placeholder='Search'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                  />
                </div>
                {/* <div className='input-group-append'> */}
                <SelectSearch
                  name='selectSearch'
                  closeOnSelect={true}
                  search
                  onFocus={() => {
                    this.setState({ searchBy: '' })
                  }}
                  onClick={() => {
                    this.setState({ searchBy: '' })
                  }}
                  options={searchWithFieldsOptions}
                  value={searchBy}
                  placeholder='Search By'
                  onChange={(e) => this.setState({ searchBy: e }, () => this.searchTextWithKey())}
                  filterOptions={this.handleFilter}
                />
                {/* </div> */}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'none' }}></div>
        )}

        <div className='bg-white shadow usrelist table-responsive'>
          <table className='table table-striped table-bordered mb-0'>
            <thead className='thead-light'>
              <tr>
                <th style={this.props.isSelect ? {} : { display: 'none' }}>
                  {' '}
                  <input
                    type='checkbox'
                    onChange={(e) => this.props.onParentSelect(e)}
                    id={this.props.parentCheckBoxId}
                    checked={this.props.parentCheck}
                    style={{
                      fontSize: '18px',
                      padding: '0px',
                      verticalAlign: 'middle',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  />
                </th>

                {this?.props?.headerData?.map((item, i) => {
                  return (
                    <>
                      {item.filterOption ? (
                        <th>
                          <div className='dropdown'>
                            <div className='d-flex align-items-center'>
                              <span className='me-1'>{item.title}</span>
                              <button
                                type='button'
                                className='btn btn-link ml-2 p-0'
                                onClick={this.handleFilterDropdownToggle}
                              >
                                <i className='fa fa-filter' aria-hidden='true'></i>
                              </button>
                            </div>
                            <div
                              className={`dropdown-menu${
                                filterDropdownOpen ? ' show' : ''
                              } dropdown-menu-bottom p-2`}
                            >
                              {item.filterOption.map((filter, i) => (
                                <div className='form-check' key={i}>
                                  <input
                                    className='form-check-input'
                                    type='radio'
                                    name={`filter-${item.fieldName}`}
                                    value={filter.value}
                                    id={`${item.fieldName}-${filter.value}`}
                                    checked={this.state.filterBy.some(
                                      (fb) => fb[item.fieldName] === filter.value,
                                    )}
                                    onChange={() =>
                                      this.handleFilterSelect(item.fieldName, filter.value)
                                    }
                                  />
                                  <label
                                    className='form-check-label'
                                    htmlFor={`${item.fieldName}-${filter.value}`}
                                  >
                                    {filter.label}
                                  </label>
                                </div>
                              ))}

                              {/* <button
                                type='button'
                                className='btn btn-primary'
                                onClick={this.handleSubmit}
                              >
                                Apply
                              </button> */}
                            </div>
                          </div>
                        </th>
                      ) : (
                        <th
                          key={i}
                          scope='col'
                          style={
                            item.title === 'Status' ||
                            item.title === 'actions' ||
                            item.title === 'Actions'
                              ? { textAlign: 'center' }
                              : {}
                          }
                        >
                          {item.title === 'actions'
                            ? ''
                            : item.title !== ''
                            ? item.title.charAt(0).toUpperCase() + item.title.slice(1)
                            : ' '}{' '}
                          {item.sorting ? (
                            <i
                              className='fa fa-fw fa-sort'
                              onClick={() => this.sortValue(item.fieldName)}
                            ></i>
                          ) : (
                            ''
                          )}{' '}
                        </th>
                      )}
                    </>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {this.props.loader ? (
                <tr>
                  <td
                    colSpan={this.props.headerData.length}
                    style={{ width: '100%', align: 'center' }}
                  >
                    <LoaderContainer {...loaderProperty}></LoaderContainer>
                  </td>
                </tr>
              ) : this.props?.data?.length === 0 ? (
                <tr>
                  <td
                    colSpan={this.props.headerData.length}
                    style={{
                      padding: '15%',
                      width: '100%',
                      textAlignLast: 'center',
                      fontSize: '20px',
                      align: 'center',
                    }}
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                this.props.html
              )}
            </tbody>
          </table>
        </div>
        {this.props.pageCount > 1 ? (
          <div className='d-flex flex-row-reverse me-2 mt-4 navigation'>
            <PaginationContainer
              activePage={
                this.props.isPaginationStore ? this.props.currentPage : this.state.pageInfo
              }
              count={this.props.count}
              handleClick={this.handleClick}
            ></PaginationContainer>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}
