import { Outlet } from 'react-router-dom'
import MainFooter from '../main-footer/MainFooter'
import MainHeader from '../main-header/MainHeader'

export default function Layout() {
  return (
    <>
      <MainHeader />
      <Outlet />

      <MainFooter />
    </>
  )
}
