import { Navigate, useLocation } from 'react-router-dom'
import { storageActions } from '../actions'
export default function RequireAuth({ children }) {
  let location = useLocation()
  const isAuthenticated = storageActions.getItem('isAuthenticated')
  if (!isAuthenticated) {
    return <Navigate to='/' state={{ from: location }} replace />
  }
  return children
}
