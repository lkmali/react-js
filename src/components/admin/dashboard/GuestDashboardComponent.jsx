import { Component } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import SharedHeaderComponent from '../../shared/header/Header'
import SideMenuComponent from '../../shared/sidemenu/Sidemenu'
class GuestDashboardComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      showNav: false,
      userProfileImg: '',
      navData: ['home', 'fromData'],
      baseNavPath: '/shared-user',
    }
  }

  // ref = React.createRef();

  hideDropDown = () => {
    let show = false
    if (this.state.show) this.setState({ show })
  }

  showDropDown = () => {
    // this.setState({ show: true })
  }

  showSidebar = () => {
    let showNav = this.state.showNav
    showNav = !showNav
    this.setState({ showNav: showNav })
  }

  render() {
    const { userProfileImg } = this.state
    return (
      <div onClick={this.hideDropDown}>
        <div>
          <SharedHeaderComponent
            userProfileImg={userProfileImg}
            showNav={this.state.showNav}
            show={this.state.show}
            showToggle={this.showDropDown}
            toggleSidebar={this.showSidebar}
          ></SharedHeaderComponent>
        </div>
        <div
          id='left-part'
          onClick={this.showSidebar}
          className={this.state.showNav ? 'opnemenu' : ''}
        >
          <SideMenuComponent
            navigate={this.props.navigate}
            navData={this.state.navData}
            baseNavPath={this.state.baseNavPath}
            toggleSidebar={this.showSidebar}
          ></SideMenuComponent>
        </div>
        <div id='right-part' className='py-2 px-3'>
          <div className='mt-3'>
            {' '}
            <Outlet />
          </div>
        </div>
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <GuestDashboardComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
