import { Component } from 'react'
import restActions from '../../../actions/rest'
import AdminGroupsAddComponent from '../../../components/admin/groups/AdminGroupsAddComponent'
import { errorMessage, RestUrlHelper } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'

export default class AdminGroupAddContainer extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      roles: [],
      name: '',
      email: '',
      role: '',
      description: '',
      roleLoader: false,
      formSubmissionLoader: false,
    }
  }

  handleChanges = (event) => {
    const target = event.target
    let value = target.value
    const name = target.name

    /**
         * ES6 property
         *
         * this.setState({
            [name]: value
            })
         *
         * obj={}
         * obj[name]=value;
         * setState(obj)
         */
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
    this.setState({ roleLoader: true })
    restActions.GET(RestUrlHelper.GET_ROLE).then(
      (res) => {
        let roles = res.data.map((item) => {
          return item.name.toUpperCase()
        })
        this.setState({ roles, roleLoader: false })
      },
      (err) => {
        NotificationMessage.showError(err.message ?? errorMessage.fetchingRole)
        this.setState({ roleLoader: false })
      },
    )
  }

  handleSubmit(data) {
    const name = this.state.name
    const role = this.state.description
    data = { groupName: name, description: role }
    this.setState({ formSubmissionLoader: true })
    restActions.POST(RestUrlHelper.ADD_GROUP_URL, data).then(
      (res) => {
        if (res.status === 208) {
          NotificationMessage.showWarning(errorMessage.userAlreadyExists)
        } else {
          // load user add component from here...
          NotificationMessage.showInfo('Group created successfully')
          this.props.navigate(`/home/groups/${res.data.id}/add-users`)
        }
        this.setState({ formSubmissionLoader: false })
        this.resetState(true)
      },
      (err) => {
        NotificationMessage.showError(err.message)
        //  console.log('error while creating group ', err)
        this.setState({ formSubmissionLoader: false })
      },
    )
  }

  resetState = (flag) => {
    this.setState({
      name: '',
      email: '',
      role: '',
    })
    this.props.handleClose(flag)
  }

  render() {
    return (
      <AdminGroupsAddComponent
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
      ></AdminGroupsAddComponent>
    )
  }
}
