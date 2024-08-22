import { Route } from 'react-router-dom'
import ForgotPasswordComponent from '../components/forgot-password/ForgotPassword'
import ForgotPasswordResetLinkContainer from '../container/forgot-password/ResetLink'
import ForgotPasswordResetPasswordContainer from '../container/forgot-password/ResetPassword'

const ForgotPasswordRouting = () => {
  return (
    <Route element={<ForgotPasswordComponent />}>
      <Route path='/account/set-password' element={<ForgotPasswordResetLinkContainer />}></Route>
      <Route
        path='/account/set-password/:otp'
        element={<ForgotPasswordResetPasswordContainer />}
      ></Route>
    </Route>
  )
}
export default ForgotPasswordRouting
