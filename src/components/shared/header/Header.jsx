import { Component } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NavItem } from 'reactstrap'
import { titleCase } from 'title-case'
import { storageActions } from '../../..//actions'
import { env } from '../../../config'
// import {profile} from '/images/user.png';
class SharedHeaderComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { show: false }
  }

  logout = () => {
    localStorage.clear()
    this.props.navigate('/')
  }
  profile = () => {
    this.props.navigate('/home/profile')
  }

  toggleSidebar = () => {
    this.props.toggleSidebar()
  }

  render() {
    const username = storageActions.getItem('username')
    const role = storageActions.getItem('role')
    const { userProfileImg } = this.props
    return (
      <header className='d-flex justify-content-between align-items-center bg-white headerBoder'>
        <div className='d-flex'>
          {/* <button className="mobile-button mt-2 me-3 btn-transparent" onClick={this.toggleSidebar}>
                        <div id="menu-toggle" className={this.props.shoNav ? 'open' : ''}>
                            <i className="fas fa-bars" />
                        </div>
                    </button> */}

          <Link to='/' className='pl-sm-0 ms-2 ms-lg-0'>
            {' '}
            <img
              src={env.REACT_APP_PUBLIC_URL + '/images/LKMALI-logo-updated.jpg'}
              alt='logo'
            />{' '}
          </Link>
        </div>
        <div>
          <NavItem
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {/* <NavLink
              style={{ textDecoration: 'none', color: '#186881' }}
              className='px-2'
              to='/home/checklist'
            >
              <BsCardChecklist size={'1.5rem'} />
            </NavLink>
            <NavLink
              style={{ textDecoration: 'none', color: '#186881' }}
              className='px-2'
              to='/home/notification'
            >
              <BsMegaphone size={'1.5rem'} />
            </NavLink>
            <NavLink
              style={{ textDecoration: 'none', color: '#186881' }}
              className='px-2'
              to='/home/help'
            >
              <BsQuestionCircle size={'1.5rem'} />
            </NavLink> */}
            {/* <NavLink
                            style={{ textDecoration: 'none' }}
                            className="px-2"
                            to="/home/profile"
                        ><span className="box-icon">
                                <i className="fas fa-user-friends"></i>
                            </span></NavLink> */}
            <div className='btn-group px-2' style={{ display: 'block' }}>
              <div
                onClick={this.props.showToggle}
                className='text-decoration-none color-black me-1 font-weight-bold d-flex align-items-center justify-content-between'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span className='me-3'>
                  <div
                    style={{
                      width: '37px',
                      height: '37px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      margin: '0 auto',
                    }}
                  >
                    <img
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = env.REACT_APP_PUBLIC_URL + '/images/teachnaviouslogo.png'
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      src={userProfileImg}
                      alt={'profile image'}
                    />
                  </div>
                </span>
                <span className='d-none d-sm-block'>
                  <div className=''>
                    <b>{titleCase(username.replace('.', ' '))}</b>
                    <br />
                    <b>{titleCase(role)}</b>
                  </div>
                </span>
              </div>
              <div
                className={`${this.props.show ? 'show' : ''} dropdown-menu dropdown-menu-right p-0`}
              >
                <ul className='list-group list-group-flush '>
                  <li
                    className='list-group-item py-0 list-group-item-action'
                    onClick={this.profile}
                  >
                    <button className='btn font-85 ' type='button'>
                      Update Profile
                    </button>
                  </li>
                  {/* <li className="list-group-item py-0 list-group-item-action" onClick={this.logout}>
                                        <button className="btn font-85 " type="button">Logout</button>
                                    </li> */}
                </ul>
              </div>
            </div>
          </NavItem>

          {/* <div className="btn-group me-4" onClick={this.profile}>
                        <div className="text-decoration-none color-black font-weight-bold d-flex align-items-center justify-content-between" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="img-cricle me-0 me-sm-1">
                                <img width="100%" className="rounded-circle" alt="" />
                            </span>
                            <span className="d-none d-sm-block"> {name} </span>
                        </div>
                    </div> */}
        </div>
      </header>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <SharedHeaderComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
