import { Component } from 'react'
import restActions from '../../../actions/rest'
import AdminUsersAddComponent from '../../../components/admin/users/AdminUsersAddComponent'
import { errorMessage, getAuthorizationHeaders, RestUrlHelper } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
export default class AdminUsersAddContainer extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      fullName: '',
      email: '',
      phone: '',
      role: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      address: '',
      roles: [],
      name: '',
      roleLoader: true,
      formSubmissionLoader: false,
    }
  }

  handleChanges = (event) => {
    const target = event.target
    let value = target.value
    const name = target.name

    if (name === 'name') {
      // value = value.trim();
      if (!value.trim()) {
        value = value.trim()
      } else value = value.replace(/  +/g, ' ')
    }
    this.setState({
      [name]: value,
    })
  }

  componentDidMount() {
    restActions.GET(RestUrlHelper.GET_ROLE).then(
      (res) => {
        let roles = res.data.map((item) => {
          return item.name
        })
        this.setState({ roles, roleLoader: false })
      },
      (err) => {
        NotificationMessage.showError(err.message ?? errorMessage.fetchingRole)
        this.setState({ roleLoader: false })
      },
    )
  }

  handleSubmit(payload) {
    this.setState({ formSubmissionLoader: true })
    const requestObject = {
      username: payload.fullName,
      email: payload.email,
      role: payload?.role?.toLowerCase(),
      address: {
        address: payload.address,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        pinCode: payload.pincode,
      },
      phone: payload.phone,
    }
    restActions.POST(RestUrlHelper.ADD_USER_URL, requestObject, getAuthorizationHeaders()).then(
      (res) => {
        if (res.status === 208) {
          NotificationMessage.showWarning(errorMessage.userAlreadyExists)
        } else {
          NotificationMessage.showInfo('User created successfully')
          this.resetState(true)
        }
        this.setState({ formSubmissionLoader: false })
      },
      (err) => {
        NotificationMessage.showWarning(err.message)
        this.setState({ formSubmissionLoader: false })
      },
    )
  }

  resetState = (flag) => {
    this.setState({
      fullName: '',
      email: '',
      phone: '',
      role: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      address: '',
      name: '',
    })
    this.props.handleClose(flag)
  }

  render() {
    return (
      <AdminUsersAddComponent
        state={this.state}
        roleLoader={this.state.roleLoader}
        formSubmissionLoader={this.state.formSubmissionLoader}
        roles={this.state.roles}
        modalShow={this.props.modalShow}
        handleChanges={this.handleChanges}
        handleShow={this.props.handleShow}
        handleClose={this.props.handleClose}
        resetState={this.resetState}
        handleSubmit={this.handleSubmit}
      ></AdminUsersAddComponent>
    )
  }
}
