import { Route } from 'react-router-dom'
import AdminDashboardComponent from '../components/admin/dashboard/AdminDashboardComponent'
import AdminFormsComponent from '../components/admin/forms/AdminFormsComponent'
import AdminGroupsComponent from '../components/admin/groups/AdminGroupsComponent'
import ViewGroupComponent from '../components/admin/groups/ViewGroupComponent'
import AdminGroupAddUsersComponent from '../components/admin/groups/group-user/AdminGroupAddUsersComponent'
import AdminProjectsListComponent from '../components/admin/projects/AdminProjectsListComponent'
import ViewProjectComponent from '../components/admin/projects/view-project/ViewProjectComponent'
import AdminTaskComponent from '../components/admin/task-template/AdminTaskComponent'
import AdminUsersComponent from '../components/admin/users/AdminUsersComponent'
import ViewUsersComponent from '../components/admin/users/ViewUsersComponent'
import AdminUserGroupsComponent from '../components/admin/users/user-group/AdminUserGroupsComponent'
import AdminUserProjectFormsContainer from '../components/admin/users/user-project-form/User-Project-Form'
import AdminUserProjectsContainer from '../components/admin/users/user-project/AdminUserProjectFormsContainer'
import AdminWorkflowComponent from '../components/admin/workflow/AdminWorkflowComponent'
import AdminWorkflowAddEdit from '../components/admin/workflow/workflowAddEdit'
import HomeComponent from '../components/home/Dashboard'
import ProfileComponent from '../components/profile/ProfileComponent'
// import AdminFormAddContainer from '../components/admin/forms/Add';
import AdminFormAddComponent from '../components/admin/forms/AdminFormAddComponent'
import AdminGroupDeleteUsersComponent from '../components/admin/groups/group-user/AdminGroupDeleteUsersComponent'
import AdminTaskAddComponent from '../components/admin/task-template/AdminTaskAddComponent'
import AdminTaskAddUsersComponent from '../components/admin/task-template/AdminTaskAddUsersComponent'
import AdminTaskEditFormComponent from '../components/admin/task-template/AdminTaskEditFormComponent'

import AdminUserTaskAddComponent from '../components/admin/user-task/AdminTaskAddComponent'
import AdminUserTaskAddUsersComponent from '../components/admin/user-task/AdminTaskAddUsersComponent'
import AdminUserTaskComponent from '../components/admin/user-task/AdminTaskComponent'
import AdminUserTaskEditFormComponent from '../components/admin/user-task/AdminTaskEditFormComponent'

import AdminGroupProjectFormsComponent from '../components/admin/groups/group-project-form/AdminGroupProjectFormsComponent'
import AdminGroupProjectsComponent from '../components/admin/groups/group-project/AdminGroupProjectsComponent'
// import AdminFormAddContainer from '../components/admin/forms/Add';

import RequireAuth from '../Provider/RequireAuth'
// import AdminFormAddContainer from '../components/admin/forms/Add';
import DefaultRedirect from '../Provider/defaultRedirect'

import AdminFormDataListComponent from '../components/admin/form-data/AdminFormDataListComponent'
import AdminViewFormDataComponent from '../components/admin/form-data/AdminViewFormDataComponent'
import SharedResourceListComponent from '../components/admin/shared-data/SharedResourceListComponent'
import AdminWorkflowStateComponent from '../components/admin/workflow/workflow'
function DashboardRouting() {
  return (
    <Route
      element={
        <RequireAuth>
          <AdminDashboardComponent />
        </RequireAuth>
      }
    >
      <Route>
        <Route exact path='/home/' element={<HomeComponent />}></Route>
        <Route exact path='/home/users' element={<AdminUsersComponent />}></Route>
        <Route exact path='/home/projects' element={<AdminProjectsListComponent />}></Route>
        <Route exact path='/home/profile' element={<ProfileComponent />}></Route>
        <Route exact path='/home/groups' element={<AdminGroupsComponent />}></Route>
        <Route exact path='/home/projects/:id' element={<ViewProjectComponent />}></Route>

        <Route exact path='/home/users/:userId' element={<ViewUsersComponent />}></Route>
        <Route
          exact
          path='/home/users/:userId/groups'
          element={<AdminUserGroupsComponent />}
        ></Route>
        <Route
          exact
          path='/home/users/:userId/projects'
          element={<AdminUserProjectsContainer />}
        ></Route>
        <Route
          exact
          path='/home/users/:userId/project-forms'
          element={<AdminUserProjectFormsContainer />}
        ></Route>

        <Route
          exact
          path='/home/groups/:groupId/add-users'
          element={<AdminGroupAddUsersComponent />}
        ></Route>
        <Route
          exact
          path='/home/groups/:groupId/delete-users'
          element={<AdminGroupDeleteUsersComponent />}
        ></Route>
        <Route
          exact
          path='/home/groups/:groupId/projects'
          element={<AdminGroupProjectsComponent />}
        ></Route>
        <Route
          exact
          path='/home/groups/:groupId/project-forms'
          element={<AdminGroupProjectFormsComponent />}
        ></Route>
        <Route exact path='/home/groups/:groupId' element={<ViewGroupComponent />}></Route>

        <Route exact path='/home/forms' element={<AdminFormsComponent />}></Route>
        <Route exact path='/home/formData/:id' element={<AdminViewFormDataComponent />}></Route>
        <Route exact path='/home/formData' element={<AdminFormDataListComponent />}></Route>

        <Route exact path='/home/forms/create' element={<AdminFormAddComponent />}></Route>
        <Route exact path='/home/forms/view/:id' element={<AdminFormAddComponent />}></Route>

        <Route exact path='/home/task-template/create' element={<AdminTaskAddComponent />}></Route>
        <Route
          exact
          path='/home/task-template/:taskId/:screenType'
          element={<AdminTaskAddUsersComponent />}
        ></Route>
        <Route
          exact
          path='/home/task-template/:taskId/forms'
          element={<AdminTaskEditFormComponent />}
        ></Route>
        <Route
          exact
          path='/home/task-template/view/:id'
          element={<AdminTaskAddComponent />}
        ></Route>
        <Route exact path='/home/task-template' element={<AdminTaskComponent />}></Route>

        <Route exact path='/home/user-task/create' element={<AdminUserTaskAddComponent />}></Route>
        <Route
          exact
          path='/home/user-task/:taskId/:screenType'
          element={<AdminUserTaskAddUsersComponent />}
        ></Route>
        <Route
          exact
          path='/home/user-task/:taskId/forms'
          element={<AdminUserTaskEditFormComponent />}
        ></Route>
        <Route
          exact
          path='/home/user-task/view/:id'
          element={<AdminUserTaskAddComponent />}
        ></Route>
        <Route exact path='/home/user-task' element={<AdminUserTaskComponent />}></Route>

        {/* <Route exact path='/home/workflows' element={<AdminWorkflowStateComponent />}></Route> */}

        <Route exact path='/home/workflow/create' element={<AdminWorkflowAddEdit />}></Route>
        <Route
          exact
          path='/home/workflow/edit/:workflowId'
          element={<AdminWorkflowStateComponent />}
        ></Route>
        <Route exact path='/home/workflow' element={<AdminWorkflowComponent />}></Route>

        <Route exact path='/home/shared-resource' element={<SharedResourceListComponent />}></Route>
        <Route path='*' element={<DefaultRedirect />}></Route>
      </Route>
    </Route>
  )
}
// return (
//   <Route element={<ForgotPasswordComponent />}>
//     <Route path='/account/set-password' element={<ForgotPasswordResetLinkContainer />/>}></Route>
//     <Route
//       path='/account/set-password/:otp'
//       element={<ForgotPasswordResetPasswordContainer />}
//     ></Route>
//   </Route>
// )

export default DashboardRouting
