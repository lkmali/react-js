import { Component } from 'react'

import restActions from '../../../actions/rest'
import AdminWorkflowAddEdit from '../../../container/admin/workflow/workflowAddEdit'
import { RestUrlHelper, getAuthorizationHeaders } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
class WorkflowForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projectsLoader: false,
      projects: [],
    }
  }
  componentDidMount() {
    this.getProject()
  }
  getProject() {
    this.setState({ projectsLoader: true })
    restActions
      .GET(RestUrlHelper.GET_PROJECT_NAME_LIST_URL, getAuthorizationHeaders())
      .then((projects) => {
        const filtered = projects?.data.map((element) => {
          return { label: element?.name.toUpperCase(), value: element.id }
        })
        this.setState({ projects: filtered, projectsLoader: false })
      })
      .catch((exception) => {
        NotificationMessage.showError(exception.message)
        this.setState({ projectsLoader: false, projects: [] })
      })
  }
  render() {
    return <AdminWorkflowAddEdit {...this.props} projectDropDown={this.state.projects} />
  }
}

export default WorkflowForm
