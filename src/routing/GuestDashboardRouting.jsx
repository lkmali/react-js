import { Route } from 'react-router-dom'
import HomeComponent from '../components/home/Dashboard'
import RequireAuth from '../Provider/RequireAuth'

import AdminFormDataListComponent from '../components/admin/form-data/AdminFormDataListComponent'
import AdminViewFormDataComponent from '../components/admin/form-data/AdminViewFormDataComponent'

import GuestDashboardComponent from '../components/admin/dashboard/GuestDashboardComponent'
function GuestDashboardRouting() {
  return (
    <Route
      element={
        <RequireAuth>
          <GuestDashboardComponent />
        </RequireAuth>
      }
    >
      <Route>
        <Route exact path='/shared-user/home' element={<HomeComponent />}></Route>
        <Route
          exact
          path='/shared-user/home/formData/:id'
          element={<AdminViewFormDataComponent />}
        ></Route>
        <Route
          exact
          path='/shared-user/home/formData'
          element={<AdminFormDataListComponent />}
        ></Route>
      </Route>
    </Route>
  )
}

export default GuestDashboardRouting
