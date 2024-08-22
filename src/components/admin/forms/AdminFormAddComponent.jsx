import { omit } from 'lodash'
import { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import restActions from '../../../actions/rest'
import AdminFormAddContainer from '../../../container/admin/forms/AdminFormAddContainer'
import { RestUrlHelper, getAuthorizationHeaders, normalizeChild } from '../../../helper'
import NotificationMessage from '../../../notification/NotificationMessage'
import './Add.css'
class AdminFormAddComponent extends Component {
  constructor(props) {
    super(props)
    let formId = ''

    if (this.props.params?.id) {
      formId = this.props.params?.id
    }
    this.state = {
      formId,
      inputValues: {
        formName: '',
        formDescription: '',
      },
      isUpsert: false,
      activeTab: 'tab1',
      cloneData: [],
      formFiledLoader: false,
      createForm: {},
      createFormFields: [],
      formTabActive: false,
      formFiledTabVisible: true,
      formFiledSubmissionLoader: false,
      formDetails: null,
      isPublished: false,
      formFiledType: [],
      formRow: [
        { sequence: '1', fieldType: 'text', title: '', repeatCount: 5 },
        { sequence: '2', fieldType: 'text', title: '', repeatCount: 5 },
        { sequence: '3', fieldType: 'text', title: '', repeatCount: 5 },
        { sequence: '4', fieldType: 'text', title: '', repeatCount: 5 },
      ],
    }
    this.savedState = this.state
  }

  componentDidMount() {
    const { state } = this?.props?.location || {}
    this.getFormFieldType()
    if (this.props.params?.id) {
      this.getFormField(this.props.params?.id)
      this.getFormDetails(this.props.params?.id)
    }
  }
  handleFormFiledTabVisible = () => {
    const { formFiledTabVisible } = this.state
    this.setState({ formTabActive: formFiledTabVisible })
  }

  handleCreateForm = async (requestObject, isUpsert) => {
    this.setState({ formSubmissionLoader: true })
    let message = ''
    let redirection = false
    try {
      let response = ''
      if (isUpsert) {
        message = 'updation'
        response = await restActions.PUT(
          `${RestUrlHelper.POST_FORM_CREATE_URL}/${this?.state?.formId}`,
          requestObject,
          getAuthorizationHeaders(),
        )
      } else {
        redirection = true
        message = 'creation'
        response = await restActions.POST(
          RestUrlHelper.POST_FORM_CREATE_URL,
          requestObject,
          getAuthorizationHeaders(),
        )
      }
      let id = response?.data?.id ? response?.data?.id : this?.state?.formId
      this.getFormDetails(id)
      this.setState(
        {
          formId: id,
          formFiledTabVisible: true,
          formSubmissionLoader: false,
          formTabActive: false,
        },
        () => {
          NotificationMessage.showInfo(`Form ${message} Successfully!!`)
          if (redirection) {
            this.props.navigate(`/home/forms/view/${this?.state?.formId}`)
          }
          return true
        },
      )
    } catch (exception) {
      this.setState({ formSubmissionLoader: false })
      NotificationMessage.showError(exception.message)
      // NotificationMessage.showError(`Something went wrong while form ${message} .`);
      this.setState(
        {
          formId: this?.state?.formId,
          formFiledTabVisible: false,
          formTabActive: true,
        },
        () => {
          // NotificationMessage.showInfo(`Form ${message} Successfully!!`);
          return false
        },
      )
    }
  }

  getFormFieldType = async () => {
    try {
      const formFieldsTypes = await restActions.GET(
        RestUrlHelper.GET_FORM_FIELD_TYPE,
        getAuthorizationHeaders(),
      )
      let filtered = []
      let fields = formFieldsTypes?.data
      if (fields && fields.length) {
        fields.forEach((x) => {
          filtered.push({
            counter: x.counter,
            defaultValue: x.defaultValue,
            maxValue: x.maxValue,
            minValue: x.minValue,
            filedTypeId: x.id,
            childRequire: x?.childRequire,
            name: x.fieldName.toUpperCase(),
            icon: x?.fabIcon,
            value: x.fieldName,
          })
        })
      }
      this.setState({ formFiledType: filtered, formFiledTypeLoader: false })
    } catch (exception) {
      NotificationMessage.showError('Unable to GET formFieldsTypes!!')
      this.setState({ formFiledType: [], formFiledTypeLoader: false })
    }
  }
  getFormField = (formId) => {
    this.setState({ formFiledLoader: true })
    restActions
      .GET(`/admin/project-form/${formId}/fields`, getAuthorizationHeaders())
      .then((response) => {
        if (response && response.data && response.data.length) {
          normalizeChild(response.data)
          this.setState({ formRow: [...response.data] })
        }
        // } else {
        //   this.setState({ isUpsert: true })
        // }
        this.setState({ formFiledLoader: false })
      })
      .catch((e) => {
        NotificationMessage.showError(e.message)
        this.setState({ formFiledLoader: false })
      })
  }

  getFormDetails = async (formId = this.state.formId) => {
    try {
      let formDetails = await restActions.GET(
        `${RestUrlHelper.GET_FORM_BY_ID_URL}${formId}`,
        getAuthorizationHeaders(),
      )
      formDetails = formDetails?.data
      let inputValues = {
        formName: formDetails?.name || '',
        formDescription: formDetails?.description || '',
      }
      this.setState({
        formDetails,
        isPublished: formDetails.isPublish,
        inputValues,
        activeTab: 'tab2',
        isUpsert: true,
      })
    } catch (exception) {
      NotificationMessage.showError('Unable to GET !!')
    }
  }

  onSelectClone = (id, newForm) => {
    this.setState({ formFiledLoader: true })
    restActions
      .GET(`/admin/project-form/${id}/fields`, getAuthorizationHeaders())
      .then((response) => {
        if (response && response.data && response.data.length) {
          normalizeChild(response.data)
          if (newForm) {
            this.props.navigate('/home/forms/create')
            this.setState({
              ...this.savedState,
              formFiledType: this.state.formFiledType,
              formId: null,
              activeTab: 'tab1',
              formRow: [...response.data.map((x) => omit(x, ['id']))],
            })
          } else {
            this.setState({
              activeTab: 'tab2',
              formRow: [...response.data.map((x) => omit(x, ['id']))],
            })
          }
          NotificationMessage.showInfo('Form clone Sucessfully')
        } else {
          // this.setState({ isUpsert: true })
        }
        this.setState({ formFiledLoader: false })
      })
      .catch((e) => {
        NotificationMessage.showError(e.message)
        this.setState({ formFiledLoader: false })
      })
  }

  handleCreateFormFiled = async (data) => {
    this.setState({ formFiledLoader: true })
    if (data?.length) {
      let response = null
      try {
        response = await restActions.POST(`/admin/project-form/${this?.state?.formId}/fields`, data)
        if (response.status === 200) {
          this.getFormField(this?.state?.formId)
          NotificationMessage.showInfo('successfully')
        }
        this.setState({ formFiledLoader: false })
        return true
      } catch (exception) {
        this.setState({ formFiledLoader: false })
        NotificationMessage.showError(exception?.message)
        return false
      }
    }
  }

  publishForm = async (formId) => {
    if (formId) {
      confirmAlert({
        message:
          'Are you sure you want to publish this form ? after publish you can\'t make any change',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                await restActions.PATCH(
                  `/admin/project-form/${formId}/publish`,
                  getAuthorizationHeaders(),
                )
                NotificationMessage.showInfo(`Form Published SuccessFully! ID ${formId}`)
                this.getFormDetails() // reload data so it will be disabled
              } catch (exception) {
                NotificationMessage.showError(`Unable to publish form ${exception.message}`)
              }
            },
          },
          {
            label: 'No',
          },
        ],
      })
    } else {
      NotificationMessage.showInfo('Select A Valid form')
    }
  }

  handleActiveTab = (tab) => {
    this.setState({ activeTab: tab })
  }
  updateFormFiledData = (formRow) => {
    this.setState({ formRow })
  }
  render() {
    return (
      <AdminFormAddContainer
        {...this.state}
        {...this.props}
        getFormField={this.getFormField}
        onSelectClone={this.onSelectClone}
        isPublished={this.state.isPublished}
        isUpsert={this.state.isUpsert}
        updateFormFiledData={this.updateFormFiledData}
        getFormDetails={this.getFormDetails}
        activeTab={this.state.activeTab}
        handleActiveTab={this.handleActiveTab}
        handleFormFiledTabVisible={this.handleFormFiledTabVisible}
        state={this.state}
        updatePublishState={this.updatePublishState}
        navigate={this.props.navigate}
        formFields={this.state.createFormFields}
        handleCreateForm={this.handleCreateForm}
        handleCreateFormFiled={this.handleCreateFormFiled}
        publishForm={this.publishForm}
      ></AdminFormAddContainer>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  const location = useLocation()
  return (
    <AdminFormAddComponent {...props} navigate={navigate} location={location} params={params} />
  )
}

export default WithNavigate
