import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import restActions from '../../../../actions/rest'
import { FORM } from '../../../../components/admin/forms/constant/form'
import { getAuthorizationHeaders, getQueryParameter, RestUrlHelper } from '../../../../helper'
import NotificationMessage from '../../../../notification/NotificationMessage'
import AdminFormListContainer from '../AdminFormListContainer'
export default class AdminFormsModalDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loader: false,
      totalCount: 0,
      searchWithFields: true,
      searchWithFieldsOptions: [
        { name: 'Form Name', value: 'formName' },
        { name: 'Project Name', value: 'projectName' },
        { name: 'Created By', value: 'createdBy' },
      ],
      headerData: FORM.TABLE_HEADERS,
      filter: FORM.FILTER_OPTIONS,
      search: false,
    }
  }
  // FORM_DATA

  componentDidMount() {
    this.getFormList(this.state.filter)
  }

  getFormList = (filter) => {
    const headers = getAuthorizationHeaders()
    this.setState({ loader: true, filter })
    // restActions.GET(RestUrlHelper.GET_USER_LIST_URL + `?limit=${itemPerPage}&offset=${pageOffset}`).then((res) => {
    restActions
      .GET(`${RestUrlHelper.GET_FORM_LIST_URL}${getQueryParameter(filter)}`, { headers })
      .then(
        (res) => {
          this.setState({ loader: false })
          const data = res.data.data
          const totalCount = data.length > 0 ? res.data.count : 0
          this.setState({ data, totalCount })
        },
        (err) => {
          this.setState({ loader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }

  render() {
    return (
      <Modal
        show={this.props.modalShow}
        width={100}
        fullscreen
        onHide={() => this.props.handleClose()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Form For Clone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminFormListContainer
            handelLoader={this.handelLoader}
            navigate={this.props.navigate}
            isView={false}
            onSelectClone={this.props.onSelectClone}
            isCloneButton={true}
            loader={this.state.loader}
            totalCount={this.state.totalCount}
            headerData={this.state.headerData}
            data={this.state.data}
            getFormList={this.getFormList}
            search={this.state.search}
            filter={this.state.filter}
            searchWithFields={this.state.searchWithFields}
            searchWithFieldsOptions={this.state.searchWithFieldsOptions}
          ></AdminFormListContainer>
        </Modal.Body>
      </Modal>
    )
  }
}
