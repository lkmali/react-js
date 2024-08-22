import { Navigate } from 'react-router-dom'
import { storageActions } from '..//actions'
export default function DefaultRedirect() {
  const isAuthenticated = storageActions.getItem('isAuthenticated')
  const role = storageActions.getItem('role')
  if (!isAuthenticated) {
    return <Navigate to='/' />
  } else {
    if (['admin', 'superAdmin'].indexOf(role) >= 0) {
      return <Navigate to='/home/' />
    } else {
      return <Navigate to='/shared-user/home/' />
    }
  }
}
