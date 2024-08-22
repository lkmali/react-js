import { format } from 'date-fns'
import { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { DataTableComponent } from '../../../components/dataTable/data-table'
export default class AdminWorkflowListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: ['view'],
    }
  }
  workflow = (id) => {
    this.props.navigate(`/home/workflow/edit/${id}`)
  }
  startWorkFLow = (id) => {
    confirmAlert({
      message: 'Are you sure you want to Active this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.props.activeWorkflow(id),
        },
        {
          label: 'No',
        },
      ],
    })
  }
  showDropDown = () => {
    this.setState({ show: true })
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
            <td>{item.workflowName}</td>
            <td>{item.createdByEmail}</td>
            <td style={{ textAlign: 'center' }}>
              {format(new Date(item.createdOn), 'dd/MM/yyyy')}
            </td>

            <td style={{ textAlign: 'center' }}>
              {format(new Date(item.modifiedOn), 'dd/MM/yyyy')}
            </td>
            <td>{item.status}</td>
            <td>
              <div className='btn-group px-2'>
                <div
                  onClick={() => this.showDropDown(item.id)}
                  className='text-decoration-none color-black me-1 font-weight-bold d-flex align-items-center justify-content-between'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  <i onClick={() => this.workflow(item.id)} className='fa-solid fa-eye'>
                    <div className='tooltip'>
                      <span className='tooltiptext'>View Workflow Stage</span>
                    </div>{' '}
                  </i>
                  <i onClick={() => this.props.handelModel(item)} className='fa-solid fa-pencil'>
                    <div className='tooltip'>
                      <span className='tooltiptext'>Edit workflow</span>
                    </div>{' '}
                  </i>
                  {item.status == 'DRAFT' ? (
                    <i onClick={() => this.startWorkFLow(item.id)} className='fa-solid fa-play'>
                      <div className='tooltip'>
                        <span className='tooltiptext'>Active workflow</span>
                      </div>{' '}
                    </i>
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
        handleClick={this.props.getWorkflowList}
        parentCheck={this.props.parentCheck}
        isSelect={this.props.isSelect}
        onParentSelect={this.props.onParentSelect}
        parentCheckBoxId={this.props.parentCheckBoxId}
      ></DataTableComponent>
    )
  }
}
