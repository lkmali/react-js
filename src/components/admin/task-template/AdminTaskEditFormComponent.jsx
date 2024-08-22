import { uniqueId } from 'lodash'
import { Component } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../../../actions'
import restActions from '../../../actions/rest'
import EditTaskForm from '../../../container/admin/task-template/EditTaskForm'
import LoaderContainer from '../../../container/loader/Loader'
import { RestUrlHelper, getAuthorizationHeaders } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
class AdminTaskAddFormsComponent extends Component {
  constructor(props) {
    super(props)
    const taskId = this.props.params?.taskId
    this.state = {
      taskId,
      data: [],
      loader: false,
      totalCount: 0,
      show: false,
      headerData: [{ title: 'Name', fieldName: 'Formname', sorting: true }],
      filter: {
        search: '',
        sortBy: 'name',
        orderBy: 'ASC',
        pageOffset: 0,
        itemPerPage: 10,
      },
      alreadyAddedForm: [],
      selectedForm: [],
      isEnableAddFormButton: false,
      selectCounter: 0,
      search: true,
      isSelect: true,
      parentCheck: false,
      addButtonFlag: false,
      parentCheckBoxId: uniqueId('parentCheckBox-'),
    }
  }

  componentDidMount() {
    ;(async () => {
      await Promise.all([this.getTaskData()])
    })()
  }

  getTaskData = async () => {
    const taskId = this.state.taskId
    try {
      const headers = getAuthorizationHeaders()
      const response = await restActions.GET(
        `${RestUrlHelper.GET_Task_TEMPLATE_CREATE_URL}/${taskId}/project-forms`,
        {
          headers,
        },
      )
      if (response.data.length > 0) {
        const data = response.data.map((value) => {
          return value.id
        })
        if (data.length) {
          document.getElementById(this.state.parentCheckBoxId).indeterminate = true
        }
        this.setState({
          selectedForm: data,
          selectCounter: response.data.length,
          alreadyAddedForm: response.data,
        })
      }
    } catch (err) {
      //
    }
  }
  getFormList = async (filter) => {
    let projectId = this.props.projectId
    try {
      const headers = { Authorization: `Bearer ${storageActions.getItem('token')}` }
      this.setState({ loader: true, filter })
      const res = await restActions.GET(
        `${RestUrlHelper.GET_FORM_LIST_URL_BY_PROJECTID}?projectId=${projectId}`,
        { headers },
      )
      this.setState({ loader: false })
      const data = res.data
      const totalCount = data && data.length ? data.length : 0
      this.setState({ data, totalCount, parentCheck: false })
    } catch (err) {
      this.setState({ loader: false })
    }
  }

  onParentSelect = (e) => {
    const selectedForm = this.state.selectedForm
    if (e.target.checked) {
      for (const value of this.state.data) {
        if (selectedForm.indexOf(value.id) < 0) {
          selectedForm.push(value.id)
        }
      }
    } else {
      for (const value of this.state.data) {
        selectedForm.splice(selectedForm.indexOf(value.id), 1)
      }
    }
    this.setState({
      selectedForm,
      selectCounter: selectedForm.length,
      parentCheck: e.target.checked,
    })
  }
  onChildSelect = (e, value) => {
    const selectedForm = this.state.selectedForm
    const id = value.id
    if (id && e.target.checked) {
      if (selectedForm.indexOf(id) < 0) {
        selectedForm.push(id)
      }
    } else if (id && !e.target.checked) {
      selectedForm.splice(selectedForm.indexOf(id), 1)
      this.setState({ parentCheck: false })
    }
    this.setState({ selectedForm, selectCounter: selectedForm.length })
    document.getElementById(this.state.parentCheckBoxId).indeterminate = true
  }

  addForms = () => {
    let { alreadyAddedForm, selectedForm, taskId } = this.state
    let deletedForm = alreadyAddedForm.filter((item) => selectedForm.indexOf(item.id) == -1)
    const url = `${RestUrlHelper.POST_Task_TEMPLATE_CREATE_URL}/${taskId}/project-forms`
    this.setState({ addButtonFlag: true })
    restActions.PUT(url, selectedForm).then(
      async () => {
        if (deletedForm && deletedForm.length) {
          deletedForm = deletedForm.map(({ taskFormId }) => taskFormId)
          await restActions.DELETE(url, deletedForm)
        }
        this.setState({ addButtonFlag: false })
        NotificationMessage.showInfo('Updated Form\'s into task ')
        this.props.navigate(`/home/task-template/view/${taskId}`)
      },
      (err) => {
        this.setState({ addButtonFlag: false })
        NotificationMessage.showError(err.message)
      },
    )
  }

  render() {
    const loaderProperty = {
      type: 'Circles',
      height: 15,
      width: 15,
      color: '#e84546',
      visible: true,
    }
    return (
      <div>
        {this.state.selectedForm.length > 0 ? (
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5>Selected Form {this.state.selectCounter} </h5>
            {this.state?.addButtonFlag ? (
              <button className='btn btn-primary px-5 me-5' disabled>
                <LoaderContainer {...loaderProperty}></LoaderContainer>
              </button>
            ) : (
              <></>
              // <button className='btn btn-primary' onClick={this.addForms}>
              //   <span className='d-none d-sm-block px-4'> Add Form To Task </span>
              //   <span className='d-block d-sm-none'>
              //     {' '}
              //     <i className='fas fa-plus'></i>{' '}
              //   </span>
              // </button>
            )}
          </div>
        ) : (
          ''
        )}

        <EditTaskForm
          loader={this.state.loader}
          parentCheck={this.state.parentCheck}
          totalCount={this.state.totalCount}
          search={this.state.search}
          filter={this.state.filter}
          headerData={this.state.headerData}
          data={this.state.alreadyAddedForm}
          navigate={this.props.navigate}
          selectedForm={this.state.selectedForm}
          onChildSelect={this.onChildSelect}
          onParentSelect={this.onParentSelect}
          getFormList={this.getFormList}
          isSelect={this.state.isSelect}
          parentCheckBoxId={this.state.parentCheckBoxId}
        ></EditTaskForm>
      </div>
    )
  }
}
function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  const location = useLocation()
  if (!location.state || !location.state.projectId || !location.state.projectId.length) {
    navigate(-1)
  }
  return (
    <AdminTaskAddFormsComponent
      {...props}
      projectId={location.state.projectId}
      navigate={navigate}
      params={params}
    />
  )
}

export default WithNavigate
