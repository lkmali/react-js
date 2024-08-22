import { Component } from 'react'
import AdminFormViewComponent from '../../../components/admin/forms/EditView'
import LoaderContainer from '../../loader/Loader'

export default class ProfileContainer extends Component {
  constructor(props) {
    super(props)
    const formId = this.props.params?.id
    this.state = {
      formId,
    }
    this.updateInputValues = this.updateInputValues.bind(this)
  }

  updateInputValues(nextState) {
    this.setState(nextState)
  }

  componentDidMount() {
    // let id = this.state.formId
    // const headers = getAuthorizationHeaders()
    // restActions.GET(`${RestUrlHelper.GET_PROJECT_LIST}`, { headers, params: { id } }).then((response) => {
    //     this.setState({
    //         inputFields: response.data[0]
    //     });
    //     this.setState({ formLoader: false })
    // }).catch(e => {
    //     NotificationMessage.showError("Something went wrong")
    //     this.setState({ formLoader: false, emptyData: true })
    // });
    // restActions.GET(`${RestUrlHelper.ADD_USER_URL}`, { headers }).then((response) => {
    //     this.setState({
    //         userDropDown: response.data.map(x => { return { name: x.username, value: x.userId } })
    //     })
    //     this.setState({ userLoader: false })
    // }).catch(e => {
    //     NotificationMessage.showError("Something went wrong")
    //     this.setState({ userLoader: false, emptyUserData: true })
    // });
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
          <AdminFormViewComponent
            userDropDown={this.state.userDropDown}
            userLoader={this.state.userLoader}
            formLoader={this.state.formLoader}
            inputValues={this.state.inputFields}
            match={this.props.match}
            location={this.props.location}
            handleStatus={this.handleStatus}
          ></AdminFormViewComponent>
        )}
      </>
    )
  }
}
