import { Outlet } from 'react-router-dom'

const ForgotPasswordComponent = () => {
  return (
    <div className='container '>
      <div className='row d-flex justify-content-center align-items-center h-100 '>
        <div className='col-lg-5 col-sm-8'>
          <div className='white-box mt-3'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordComponent
