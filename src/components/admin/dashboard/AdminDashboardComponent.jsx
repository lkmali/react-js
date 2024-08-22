import { isNil } from 'lodash'
import { Component } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { storageActions } from '../../../actions'
import restActions from '../../../actions/rest'
import { RestUrlHelper, getAuthorizationHeaders } from '../../../helper'
import SharedHeaderComponent from '../../shared/header/Header'
import SideMenuComponent from '../../shared/sidemenu/Sidemenu'
class AdminDashboardComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      showNav: false,
      userProfileImg: '',
      navData: [
        'home',
        'project',
        'form',
        'user',
        'group',
        'fromData',
        'sharedResource',
        'task',
        'workflow',
        'userTask',
      ],
      baseNavPath: '',
    }
  }

  // ref = React.createRef();

  componentDidMount() {
    const userImgUrlKey = storageActions.getItem('imgKey')
    const getUserImageUrl = async () => {
      if (userImgUrlKey) {
        const imageURL = `${RestUrlHelper.GET_USER_PROFILE_IMAGE_URL}?key=${userImgUrlKey}`
        const headers = getAuthorizationHeaders()
        try {
          const userProfileImageUrl = await restActions.GET(imageURL, { headers })
          const profileImg = userProfileImageUrl?.data
          this.setState({ ...this.state, userProfileImg: profileImg })
        } catch (ex) {
          // ex
        }
      }
    }

    if (!isNil(userImgUrlKey) && userImgUrlKey !== 'null') {
      getUserImageUrl()
    }
  }

  hideDropDown = () => {
    let show = false
    if (this.state.show) this.setState({ show })
  }

  showDropDown = () => {
    this.setState({ show: true })
  }

  /**
   * Uncomment to add functionality of handling drop and drag
   */
  // handleDrop = (event) => {
  //     event.preventDefault();
  //     // event.stopPropagation();
  //     console.log("i am drop")
  // }
  // handleDrag = (event) => {
  //     console.log("i am drag")

  //     event.preventDefault()
  //     // event.stopPropagation()
  // }
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
            navData={this.state.navData}
            baseNavPath={this.state.baseNavPath}
            navigate={this.props.navigate}
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
  return <AdminDashboardComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
