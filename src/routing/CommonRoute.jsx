import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import CheckAuth from '../Provider/checkAuth'
import DefaultRedirect from '../Provider/defaultRedirect'
import FtDemoComponent from '../components/ftDemo/ftDemo'
import GuestLoginComponent from '../components/guest-login/GuestLoginComponent'
import Layout from '../components/mainLayout/Layout'
import { googleConfig } from '../config'
import LoginContainer from '../container/login/Login'
import RegisterContainer from '../container/register/Register'
import store from '../redux/store'
import DashboardRouting from './DashboardRouting'
import ForgotPasswordRouting from './ForgotPasswordRouting'
import GuestDashboardRouting from './GuestDashboardRouting'
export {
  AbortedDeferredError,
  Await,
  MemoryRouter,
  Navigate,
  NavigationType,
  Outlet,
  Route,
  Router,
  RouterProvider,
  Routes,
  createMemoryRouter,
  createPath,
  createRoutesFromChildren,
  createRoutesFromElements,
  defer,
  generatePath,
  isRouteErrorResponse,
  json,
  matchPath,
  matchRoutes,
  parsePath,
  redirect,
  renderMatches,
  resolvePath,
  useActionData,
  useAsyncError,
  useAsyncValue,
  useHref,
  useInRouterContext,
  useLoaderData,
  useLocation,
  useMatch,
  useMatches,
  useNavigate,
  useNavigation,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRevalidator,
  useRouteError,
  useRouteLoaderData,
  useRoutes,
} from 'react-router'
const { googleAnalytics } = googleConfig
function CommonRoute() {
  useEffect(() => {
    ReactGA.initialize(googleAnalytics.trackingID)
    ReactGA.send({ hitType: 'page-route', page: window.location.pathname + window.location.search })
  }, [])
  return (
    <Provider store={store}>
      {/* <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['drawing', 'places', 'geometry']}> */}
      <BrowserRouter>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route
            element={
              <CheckAuth>
                <Layout />
              </CheckAuth>
            }
          >
            <Route path='/' element={<LoginContainer />} />
            <Route path='*' element={<DefaultRedirect />}></Route>
            <Route path='/demoRequest' element={<FtDemoComponent />}></Route>
            <Route path='/register' element={<RegisterContainer />}></Route>
            <Route path='/share-login/:id' element={<GuestLoginComponent />}></Route>
            {ForgotPasswordRouting()}
          </Route>
          {GuestDashboardRouting()}
          {DashboardRouting()}

          {/* <Route element={<ForgotPasswordComponent />} >
            <Route path='/account/set-password' element={<ForgotPasswordResetLinkContainer />}></Route>
            <Route path='/account/set-password/:otp' element={<ForgotPasswordResetPasswordContainer />}></Route>
          </Route> */}
          {/*
          <Route path='/account/set-password' element={<ForgotPasswordRouting />}> </Route> */}
        </Routes>
      </BrowserRouter>
      {/* </LoadScript> */}
    </Provider>
  )
}
export default CommonRoute
