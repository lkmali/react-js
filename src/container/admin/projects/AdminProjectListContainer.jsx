import { format } from 'date-fns'
import { Component } from 'react'
import { titleCase } from 'title-case'
import { DataTableComponent } from '../../../components/dataTable/data-table'
export default class AdminProjectListContainer extends Component {
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
  project = (id) => {
    this.props.navigate(`/home/projects/${id}`)
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
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{titleCase(item?.createdByUser?.username)}</td>
            <td>{titleCase(item?.projectOwner?.username)}</td>
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
                  {/* <span className='d-none d-sm-block'>...</span> */}
                  {this.state.actions.length > 1 ? (
                    <span className='d-none d-sm-block'>...</span>
                  ) : (
                    <>
                      <i
                        title='View Project'
                        onClick={() => this.project(item.id)}
                        className='fa-solid fa-eye me-2'
                      ></i>
                      {this.props.downloadFile ? (
                        <div aria-label='Export data' data-balloon-pos='up'>
                          <i
                            title='Export Data'
                            onClick={() => this.props.openDownloadModel(item.id)}
                            className='fa fa-cloud-download status download-color'
                            style={{ color: 'black', cursor: 'pointer' }}
                          ></i>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
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
        navigate={this.props.navigate}
        filter={this.props.filter}
        loader={this.props.loader}
        headerData={this.props.headerData}
        data={this.props.data}
        html={this.getHtml(this.props.data)}
        handleClick={this.props.getProjectList}
      ></DataTableComponent>
    )
  }
}
