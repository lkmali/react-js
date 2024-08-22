import jwt_decode from 'jwt-decode'
import { isNil } from 'lodash'
import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../..//actions'
import restActions from '../../actions/rest'
import LoaderContainer from '../../container/loader/Loader'
import ProfileContainer from '../../container/profile/profile'
import {
  getAuthorizationHeaders,
  getFileExtension,
  getUploadImageRequest,
  RestUrlHelper,
} from '../../helper'
import NotificationMessage from '../../notification/NotificationMessage'

class ProfileComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUploading: false,
      formLoader: false,
      updateLoader: false,
      unEditableFields: {
        fullName: '',
        email: '',
        phone: '',
        org: '',
        role: '',
      },
      inputValues: {
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
      },
    }
    this.updateInputValues = this.updateInputValues.bind(this)
  }

  updateInputValues(nextState) {
    this.setState(nextState)
  }

  componentDidMount() {
    this.setState({ formLoader: true })
    const headers = getAuthorizationHeaders()
    const getUserDetails = async () => {
      try {
        // Get user profile and address
        const userResponse = await Promise.all([
          restActions.GET(RestUrlHelper.GET_USER_PROFILE_URL, { headers }),
          restActions.GET(RestUrlHelper.GET_USER_PROFILE_ADDRESS_URL, { headers }),
        ])
        const { 0: profile, 1: address } = await Promise.all(
          userResponse.map(function (response) {
            return response.data
          }),
        )
        const data = {
          unEditableFields: {
            fullName: profile.username,
            email: profile.email,
            phone: profile.phone,
            org: profile.organization.orgName,
            role: profile.roles[0],
            imageUrl: null,
          },
          inputValues: {
            address: address.address,
            city: address.city,
            country: address.country,
            state: address.state,
            pinCode: address.pinCode,
          },
        }
        if (!isNil(profile?.profileImageKey)) {
          const imageURL = `${RestUrlHelper.GET_USER_PROFILE_IMAGE_URL}?key=${profile?.profileImageKey}` // key will come from user url
          const userProfileImageUrl = await restActions.GET(imageURL, { headers })
          data.unEditableFields.imageUrl = userProfileImageUrl.data
        }
        // Get user profile from s3

        // Initial state
        this.setState({ ...data })
        this.setState({ formLoader: false })
      } catch (exception) {
        // console.error('Dieing silently, Cause : ', exception)
        this.setState({ formLoader: false })
      }
    }
    getUserDetails()
  }

  updateProfile = async (inputValues) => {
    try {
      this.setState({ updateLoader: true })
      await restActions.POST(
        RestUrlHelper.POST_USER_PROFILE_ADDRESS_URL,
        inputValues,
        getAuthorizationHeaders(),
      )
      NotificationMessage.showInfo('address updated successfully')
      this.setState({ updateLoader: false })
    } catch (ex) {
      NotificationMessage.showError(ex.message)
      this.setState({ updateLoader: false })
    }
  }
  getRole = (roles) => {
    if (roles.includes('admin')) {
      // for now this is hack as getting multile roles from backend, will handle this gracefully once role base system comes
      return 'admin'
    }
    return roles[0] // else take this first role from array.
  }

  uploadProfileImage = async () => {
    if (!this.state?.inputFields?.image) {
      NotificationMessage.showInfo('Select Image to update!!!')
      return
    }

    const extension = getFileExtension(this.state?.inputFields?.image?.name)
    const requestObject = {
      imageType: this.state?.inputFields?.image?.type,
      fileExtension: `.${extension}`,
      fileSize: this.state?.inputFields?.image?.size,
    }
    try {
      this.setState({ imageUploading: true })
      // Step-1 to get presigned url
      const { data: preSingnedUrl } = await restActions.PATCH(
        RestUrlHelper.PATCH_USER_IMAGE_PROFILE_URL,
        requestObject,
        getAuthorizationHeaders(),
      )

      // Step-3 Upload to S3 using put call
      const { ok } = await fetch(
        preSingnedUrl,
        getUploadImageRequest(this.state?.inputFields?.image),
      )
      if (ok) {
        // Step-4 confirmation call everting worked fine!
        const { statusText, data } = await restActions.PATCH(
          RestUrlHelper.PATCH_IMAGE_UPLOAD_CONFIRMATION_URL,
          getAuthorizationHeaders(),
        )
        if (statusText === 'OK') {
          NotificationMessage.showInfo('Profile Image Uploaded Successfully!')
        }

        const decoded = jwt_decode(data.token)
        const payload = decoded.payload
        storageActions.storeItems(
          ['isAuthenticated', 'username', 'phone', 'email', 'token', 'role', 'imgKey'],
          [
            true,
            payload['username'],
            payload['phone'],
            payload['email'],
            data.token,
            this.getRole(payload['roles']),
            payload['profileImageKey'],
          ],
        ) // TODO: check which role to consider if multiple role there?
        this.setState({ imageUploading: false })
        window.location.reload(false)
      }
    } catch (exception) {
      NotificationMessage.showError(exception.message)
    }
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
          <ProfileContainer
            updateInputValues={this.updateInputValues}
            formLoader={this.state.formLoader}
            inputValues={this.state.inputValues}
            unEditableFields={this.state.unEditableFields}
            match={this.props.match}
            location={this.props.location}
            imageUploading={this.state.imageUploading}
            updateLoader={this.state.updateLoader}
            handleSubmit={this.updateProfile}
            handleUpload={this.uploadProfileImage}
          ></ProfileContainer>
        )}
      </>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <ProfileComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
