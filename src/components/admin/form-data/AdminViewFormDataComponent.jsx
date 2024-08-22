import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminViewFormDataContainer from '../../../container/admin/form-data/AdminViewFormDataContainer'
import LoaderContainer from '../../../container/loader/Loader'
import { getAuthorizationHeaders } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
class AdminViewFormDataComponent extends Component {
  constructor(props) {
    super(props)

    const formDataId = this.props.params?.id
    this.state = {
      formDataId,
      formDataLoader: false,
      formData: {},
      status: {
        Draft: 1,
        Submitted: 2,
        Verified: 3,
        Rejected: 4,
        Pending: 5,
      },
    }
  }

  componentDidMount() {
    this.getFormField()
  }

  getFormField() {
    this.setState({ formDataLoader: true })
    restActions
      .GET(`/admin/user-project-form/${this.state.formDataId}/fields`, getAuthorizationHeaders())
      .then((response) => {
        this.setState({ formData: response.data, formDataLoader: false })
      })
      .catch((e) => {
        NotificationMessage.showError(e.message)
        this.setState({ formData: {}, formDataLoader: false })
      })
  }

  submitStatus = async (formId, action) => {
    const payload = {
      status: this.state.status[action],
    }
    try {
      await restActions.PUT(
        `/admin/user-project-form/${formId}`,
        payload,
        getAuthorizationHeaders(),
      )

      this.getFormField()
      NotificationMessage.showInfo(`Updated Status with  ${action}`)
    } catch (exception) {
      NotificationMessage.showError(`Unable to update status!${exception.message}`)
    }
  }

  render() {
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#186881',
      visible: true,
    }
    return (
      <>
        {this.state.formDataLoader ? (
          <LoaderContainer {...loaderProperty}></LoaderContainer>
        ) : (
          <AdminViewFormDataContainer
            match={this.props.match}
            formDataId={this.state.formDataId}
            location={this.props.location}
            formData={this.state.formData}
            submitStatus={this.submitStatus}
          ></AdminViewFormDataContainer>
        )}
      </>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <AdminViewFormDataComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
