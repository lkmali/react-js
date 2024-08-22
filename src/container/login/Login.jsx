import jwt_decode from 'jwt-decode'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../..//actions'
import restActions from '../../actions/rest'
import LoginComponent from '../../components/login/Login'
import { RestUrlHelper, getPermission } from '../../helper'
import NotificationMessage from '../../notification/NotificationMessage'

class LoginContainer extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      formLoader: false,
      loginPage: '',
    }
  }
  getRole = (roles) => {
    if (roles.includes('admin')) {
      // for now this is hack as getting multile roles from backend, will handle this gracefully once role base system comes
      return 'admin'
    }
    return roles[0] // else take this first role from array.
  }

  setPermission = async (payload) => {
    await getPermission()
    this.setState({ formLoader: false })
    if (this.getRole(payload.roles) === 'admin') {
      // based on role will decide later
      this.props.navigate('/home/')
    } else {
      this.props.navigate('/home/recordings')
    }
  }
  handleSubmit = (event, data) => {
    event.preventDefault()
    const text = `${data.userName}:${data.password}`
    const encoded = window.btoa(text)
    let config = {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${encoded}`,
      },
    }
    this.setState({ formLoader: true })
    restActions.POST(RestUrlHelper.LOGIN_USER_URL, data, config).then(
      async (res) => {
        if (res.data) {
          const decoded = jwt_decode(res.data.token)
          const currentTime = Date.now() / 1000
          if (decoded.exp < currentTime) {
            NotificationMessage.showError('login expire')
            return false
          }

          const payload = decoded.payload
          storageActions.storeItems(
            ['isAuthenticated', 'username', 'phone', 'email', 'token', 'role', 'imgKey'],
            [
              true,
              payload['username'],
              payload['phone'],
              payload['email'],
              res.data.token,
              this.getRole(payload['roles']),
              payload['profileImageKey'],
            ],
          ) // TODO: check which role to consider if multiple role there?
          await this.setPermission(payload)
        }
        this.setState({ formLoader: false })
      },
      (err) => {
        this.setState({ formLoader: false })
        NotificationMessage.showError(err.message)
      },
    )
  }
  render() {
    return (
      <LoginComponent
        formLoader={this.state.formLoader}
        handleSubmit={this.handleSubmit}
      ></LoginComponent>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <LoginContainer {...props} navigate={navigate} params={params} />
}

export default WithNavigate
