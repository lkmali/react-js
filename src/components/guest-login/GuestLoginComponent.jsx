import jwt_decode from 'jwt-decode'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../../actions'
import restActions from '../../actions/rest'
import GuestLoginContainer from '../../container/guest-login/GuestLoginContainer'
import { getPermission, RestUrlHelper } from '../../helper'
import NotificationMessage from '../../notification/NotificationMessage'

class GuestLoginComponent extends Component {
  constructor(props) {
    super(props)
    const id = this.props.params?.id
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      formLoader: false,
      id,
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

  setPermission = async () => {
    await getPermission()
    this.setState({ formLoader: false })
    this.props.navigate('/shared-user/home')
  }
  handleSubmit = (key) => {
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    this.setState({ formLoader: true })
    restActions.POST(`${RestUrlHelper.GUEST_LOGIN}${key}`, {}, config).then(
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
            ['isAuthenticated', 'username', 'email', 'token', 'role'],
            [true, 'guest', payload['email'], res.data.token, this.getRole(payload['roles'])],
          ) // TODO: check which role to consider if multiple role there?
          await this.setPermission()
        }
      },
      (err) => {
        this.setState({ formLoader: false })
        NotificationMessage.showError(err.message)
      },
    )
  }
  render() {
    return (
      <GuestLoginContainer
        formLoader={this.state.formLoader}
        handleSubmit={this.handleSubmit}
        id={this.state.id}
      ></GuestLoginContainer>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <GuestLoginComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
