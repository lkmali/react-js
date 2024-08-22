import { useState } from 'react'
import restActions from '../../actions/rest'
import ForgotPasswordResetLinkComponent from '../../components/forgot-password/ResetLink'
import { RestUrlHelper } from '../../helper/restUrl'
import NotificationMessage from '../../notification/NotificationMessage'

const ForgotPasswordResetLinkContainer = () => {
  let [loader, setLoader] = useState(false)
  let [isResponseArrived, setIsResponseArrived] = useState(false)

  function resetLink(email) {
    setLoader(true)
    restActions.POST(RestUrlHelper.PASSWORD_RESET_LINK, { email: email }).then(
      () => {
        setLoader(false)
        setIsResponseArrived(true)
        NotificationMessage.showInfo('Mail has been sent successfully')
      },
      (err) => {
        setLoader(false)
        NotificationMessage.showError(err) // message
      },
    )
  }

  return (
    <ForgotPasswordResetLinkComponent
      loader={loader}
      resetLink={resetLink}
      isResponseArrived={isResponseArrived}
    ></ForgotPasswordResetLinkComponent>
  )
}

export default ForgotPasswordResetLinkContainer
