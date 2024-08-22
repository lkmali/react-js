import { Component } from 'react'
import restActions from '../../actions/rest'
import RegisterComponent from '../../components/register/Register'
import { RestUrlHelper } from '../../helper/restUrl'
import NotificationMessage from '../../notification/NotificationMessage'

export default class RegisterContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formLoader: false,
      zoomLoader: false,
    }
  }

  registerUser = (data) => {
    // Request for updating the user
    this.setState({ formLoader: true })
    restActions.POST(RestUrlHelper.SET_PASSWORD_URL, data).then(
      () => {
        this.props.navigate('/')
        this.setState({ formLoader: false })
      },
      (err) => {
        NotificationMessage.showError(err.message)
        this.setState({ formLoader: false })
      },
    )
  }

  render() {
    return (
      <RegisterComponent
        formLoader={this.state.formLoader}
        handleZoom={this.handleZoom}
        match={this.props.match}
        location={this.props.location}
        handleSubmit={this.registerUser}
      ></RegisterComponent>
    )
  }
}
