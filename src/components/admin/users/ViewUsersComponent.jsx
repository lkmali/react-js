import { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import LoaderContainer from '../../../container/loader/Loader'
import { RestUrlHelper, getAuthorizationHeaders } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import ProfileComponent from './UserView'
class ViewUsersComponent extends Component {
  constructor(props) {
    super(props)
    const userId = this.props.params.userId
    this.state = {
      userId,
      updateLoader: false,
      activeButtonLoader: false,
      formLoader: false,
      emptyData: false,
      inputFields: {
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        username: '',
        email: '',
        phone: '',
        org: '',
        role: '',
        isActive: false,
        imageUrl: null,
      },
      roles: [],
      roleLoader: false,
    }
    this.updateInputValues = this.updateInputValues.bind(this)
  }

  updateInputValues(nextState) {
    this.setState(nextState)
  }

  componentDidMount() {
    this.getUserById()
    this.setState({ roleLoader: true })
    restActions.GET(RestUrlHelper.GET_ROLE).then(
      (res) => {
        let roles = res.data.map((item) => {
          return item.name
        })
        this.setState({ roles, roleLoader: false })
      },
      (err) => {
        NotificationMessage.showError(err.message)
        this.setState({ roleLoader: false })
      },
    )
  }

  getUserById() {
    this.setState({ formLoader: true })
    let userId = this.state.userId
    const headers = getAuthorizationHeaders()

    restActions.GET(`${RestUrlHelper.GET_USER_LIST_URL}/${userId}`, { headers }).then(
      async (res) => {
        if (res.data) {
          const profile = res.data
          const address = res.data.Address

          let userProfileImageUrl = null
          if (profile && profile.isProfileSet && profile.profileImageKey) {
            const imageURL = `${RestUrlHelper.GET_USER_PROFILE_IMAGE_URL}?key=${profile.profileImageKey}` // key will come from user url
            const result = await restActions.GET(imageURL, { headers })
            userProfileImageUrl = result.data ? result?.data : null
          }

          this.setState({
            inputFields: {
              username: profile?.username,
              email: profile?.email,
              phone: profile?.phone,
              org: profile?.organization?.orgName,
              role: profile?.Roles?.[0].name,
              address: address?.address,
              city: address?.city,
              isActive: profile?.isActive,
              country: address?.country,
              state: address?.state,
              pinCode: address?.pinCode,
              userId: profile?.userId,
              imageUrl: userProfileImageUrl,
            },
          })
          this.setState({ formLoader: false })
        } else {
          this.setState({ loader: false })
          NotificationMessage.showError('User not found')
        }
      },
      (err) => {
        this.setState({ loader: false })
        NotificationMessage.showError(err.message)
      },
    )
  }

  updateProfile = (inputValues) => {
    this.setState({ updateLoader: true })
    const requestObject = {
      username: inputValues.username,
      email: inputValues.email,
      role: inputValues.role,
      address: {
        address: inputValues.address,
        city: inputValues.city,
        state: inputValues.state,
        country: inputValues.country,
        pinCode: inputValues.pinCode,
      },
      phone: inputValues.phone,
    }
    restActions
      .PUT(
        `${RestUrlHelper.ADD_USER_URL}/${inputValues.userId}`,
        requestObject,
        getAuthorizationHeaders(),
      )
      .then(
        (res) => {
          if (res) {
            NotificationMessage.showInfo('user updated successfully')
          }
          this.setState({ updateLoader: false })
          this.getUserById()
        },
        (err) => {
          NotificationMessage.showError(err.message)
          this.setState({ updateLoader: false })
        },
      )
  }
  handleStatus = (inputValues) => {
    const status = inputValues?.isActive ? 'inActive' : 'active'
    confirmAlert({
      message: inputValues?.isActive
        ? 'Are you sure you want to deactivate?'
        : 'Are you sure you want to activate?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({ activeButtonLoader: true })
            restActions
              .PATCH(
                `/admin/user/${inputValues.userId}/status/${status}`,
                getAuthorizationHeaders(),
              )
              .then(
                (res) => {
                  if (res) {
                    NotificationMessage.showInfo(
                      `User ${status === 'active' ? 'active' : 'deactivate'} Successfully!`,
                    )
                  }
                  this.setState({ activeButtonLoader: false })
                  this.getUserById()
                },
                (err) => {
                  NotificationMessage.showError(err.message)
                  this.setState({ activeButtonLoader: false })
                },
              )
          },
        },
        {
          label: 'No',
        },
      ],
    })
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
        {this.state.formLoader ? (
          <LoaderContainer {...loaderProperty}></LoaderContainer>
        ) : this.state.emptyData ? (
          ''
        ) : (
          <ProfileComponent
            roles={this.state.roles}
            roleLoader={this.state.roleLoader}
            updateInputValues={this.updateInputValues}
            navigate={this.props.navigate}
            formLoader={this.state.formLoader}
            inputValues={this.state.inputFields}
            userId={this.state.userId}
            location={this.props.location}
            updateLoader={this.state.updateLoader}
            activeButtonLoader={this.state.activeButtonLoader}
            handleSubmit={this.updateProfile}
            handleStatus={this.handleStatus}
          ></ProfileComponent>
        )}
      </>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <ViewUsersComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
