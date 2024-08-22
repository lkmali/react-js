import { uniqueId } from 'lodash'
import { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import SharedResourceListContainer from '../../../container/admin/shared-data/SharedResourceListContainer'
import {
  RestUrlHelper,
  getAuthorizationHeaders,
  getQueryParameter,
  removeTrailingSlash,
} from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import { FORM_DATA } from './constant/constant'

class SharedResourceListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loader: false,
      totalCount: 0,
      show: false,
      headerData: FORM_DATA.TABLE_HEADERS,
      filter: FORM_DATA.FILTER_OPTIONS,
      type: '',
      search: false,
      searchWithFieldsOptions: [
        { name: 'Email', value: 'email' },
        { name: 'Form Title', value: 'formTitle' },
        { name: 'Form Filled By', value: 'formFieldBy' },
      ],
      searchWithFields: true,
      isSelect: false,
      parentCheck: false,
      parentCheckBoxId: uniqueId('parentCheckBox-'),
      selectedFormData: [],
      downloadXlsxLoader: false,
      dropdown: false,
      sharedUserEmailLoader: false,
      deleteResourceLoader: false,
    }
  }

  onParentSelect = (e) => {
    const selectedFormData = this.state.selectedFormData
    if (e.target.checked) {
      for (const value of this.state.data) {
        if (selectedFormData.indexOf(value.id) < 0) {
          if (selectedFormData.length < 10) {
            selectedFormData.push(value.id)
          }
        }
      }
    } else {
      for (const value of this.state.data) {
        selectedFormData.splice(selectedFormData.indexOf(value.id), 1)
      }
    }
    this.setState({
      selectedFormData,
      selectCounter: selectedFormData.length,
      parentCheck: e.target.checked,
    })
  }
  onChildSelect = (e, value) => {
    const selectedFormData = this.state.selectedFormData
    const id = value.id
    if (id && e.target.checked) {
      if (selectedFormData.indexOf(id) < 0) {
        if (selectedFormData.length < 10) {
          selectedFormData.push(id)
        }
      }
    } else if (id && !e.target.checked) {
      selectedFormData.splice(selectedFormData.indexOf(id), 1)
      this.setState({ parentCheck: false })
    }
    this.setState({ selectedFormData, selectCounter: selectedFormData.length })
    if (selectedFormData.length < 10) {
      document.getElementById(this.state.parentCheckBoxId).indeterminate = true
    }
  }
  OnSelectButton = (type) => {
    this.setState({ isSelect: true, selectedFormData: [], selectCounter: 0, type })
  }

  componentDidMount() {
    this.getSharedResourceData(this.state.filter)
  }

  handleDeleteData = (id) => {
    confirmAlert({
      message: 'Are you sure you want to delete share resource?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({ deleteResourceLoader: true })
            restActions
              .DELETE(
                `${RestUrlHelper.REMOVE_SHARED_RESOURCE}/${id}`,
                {},
                getAuthorizationHeaders(),
              )
              .then(
                (res) => {
                  if (res) {
                    NotificationMessage.showInfo('Data delete Successfully')
                  }
                  this.setState({ deleteResourceLoader: false })
                  this.getSharedResourceData(this.state.filter)
                },
                (err) => {
                  NotificationMessage.showError(err.message)
                  this.setState({ deleteResourceLoader: false })
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

  reSendEmail = (email) => {
    confirmAlert({
      message: 'Are you sure you want to resend shared email?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({ sharedUserEmailLoader: true })
            restActions
              .PATCH(
                `${RestUrlHelper.RESEND_SHARED_RESOURCE_EMAIL}/form-data/${email}`,
                getAuthorizationHeaders(),
              )
              .then(
                (res) => {
                  if (res) {
                    NotificationMessage.showInfo('Send Email Successfully')
                  }
                  this.setState({ sharedUserEmailLoader: false })
                },
                (err) => {
                  NotificationMessage.showError(err.message)
                  this.setState({ sharedUserEmailLoader: false })
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

  getSharedResourceData = async (filter) => {
    this.setState({ loader: true, filter })
    restActions
      .GET(`${RestUrlHelper.SHARED_RESOURCE}/form-data/${getQueryParameter(filter)}`, {
        headers: getAuthorizationHeaders(),
      })
      .then(
        (res) => {
          this.setState({ loader: false })
          const data = res.data.data
          const totalCount = data.length > 0 ? res.data.count : 0
          this.setState({ data, totalCount, parentCheck: false })
        },
        (err) => {
          this.setState({ loader: false })
          NotificationMessage.showError(err.message)
        },
      )
  }

  getSelectDiv({ selectCounter, type }) {
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div>
          <h5>
            Select Form Data to {type} {selectCounter}{' '}
          </h5>
          <small>you can select only 10 field</small>
        </div>
      </div>
    )
  }

  getUnSelectDiv() {
    return (
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h5>Shared Data </h5>
      </div>
    )
  }

  render() {
    let { pathname } = window.location
    const { isSelect } = this.state
    return (
      <div>
        {this.getUnSelectDiv()}
        <SharedResourceListContainer
          loader={this.state.loader}
          totalCount={this.state.totalCount}
          headerData={this.state.headerData}
          data={this.state.data}
          pathname={removeTrailingSlash(pathname)}
          search={this.state.search}
          searchWithFields={this.state.searchWithFields}
          searchWithFieldsOptions={this.state.searchWithFieldsOptions}
          filter={this.state.filter}
          show={this.state.show}
          parentCheck={this.state.parentCheck}
          onChildSelect={this.onChildSelect}
          onParentSelect={this.onParentSelect}
          isSelect={isSelect}
          parentCheckBoxId={this.state.parentCheckBoxId}
          selectedFormData={this.state.selectedFormData}
          navigate={this.props.navigate}
          handleDeleteData={this.handleDeleteData}
          reSendEmail={this.reSendEmail}
          getSharedResourceData={this.getSharedResourceData}
        ></SharedResourceListContainer>
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <SharedResourceListComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
