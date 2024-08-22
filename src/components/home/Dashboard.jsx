import { Component } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import restActions from '../../actions/rest'
import Dashboard from '../../container/dashboard'
import { RestUrlHelper, getAuthorizationHeaders, getQueryParameter } from '../../helper'
import NotificationMessage from '../../notification/NotificationMessage'
import { DASHBOARD } from './constant'
class DashboardComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userEventLoader: false,
      userEvents: [],
      userList: [],
      userSessionLoader: false,
      userSessions: [],
      userSessionCount: 0,
      filterValues: {
        orderBy: 'DESC',
        pageOffset: 0,
        itemPerPage: 10,
        limit: 10,
        skip: 0,
      },
      userEventCount: 0,
    }
    this.handleChanges = this.handleChanges.bind(this)
  }

  componentDidMount() {
    this.getUserEvent()
    this.getUserList()
    this.getUserSession()
  }
  getUserEvent = async (filter = this.state.filterValues) => {
    try {
      const headers = getAuthorizationHeaders()
      this.setState({ userEventLoader: true })
      const userEvent = await restActions.GET(
        `${RestUrlHelper.GET_User_Event}${getQueryParameter(filter)}`,
        { headers },
      )
      const userEvents = await this.downloadImages(userEvent.data.data, 'User')
      this.setState({ userEventCount: userEvent.data.count, userEvents, userEventLoader: false })
    } catch (exception) {
      this.setState({ userEventLoader: false })
    }
  }
  getUserSession = async (filter = this.state.filterValues) => {
    try {
      const headers = getAuthorizationHeaders()
      this.setState({ userSessionLoader: true })
      const userSession = await restActions.GET(
        `${RestUrlHelper.GET_User_Session}${getQueryParameter(filter)}`,
        { headers },
      )
      const userSessions = await this.downloadImages(userSession.data.data, 'user')
      this.setState({
        userSessionCount: userSession.data.count,
        userSessions,
        userSessionLoader: false,
      })
    } catch (exception) {
      this.setState({ userSessionLoader: false })
    }
  }
  getUserList = async () => {
    try {
      const headers = getAuthorizationHeaders()
      const res = await restActions.GET(`${RestUrlHelper.ADD_USER_URL}?withoutPagination=true`, {
        headers,
      })
      let data = res.data.data.map((element) => {
        return { label: element.username.toUpperCase(), value: element.userId }
      })
      this.setState({ userList: data })
    } catch (err) {
      NotificationMessage.showError(err.message)
    }
  }
  handleChanges(event, filedName, multi, direct, filter) {
    let name = ''
    let { filterValues } = this.state
    if (filedName) {
      name = filedName
      if (multi) {
        filterValues[filedName] = event.map((x) => x.value)
      } else if (direct) {
        filterValues[filedName] = event
      } else {
        filterValues[filedName] = event.value
      }
    } else if (filter) {
      filterValues = DASHBOARD.FILTER_OPTIONS
    } else {
      name = event.target.name
      filterValues[name] = event.target.value
    }
    this.setState(
      (prevState) => ({
        ...prevState,
        filterValues,
      }),
      () => {
        this.getUserEvent()
      },
    )
  }

  downloadImages = async (userEvents, user) => {
    const headers = getAuthorizationHeaders()
    const profileImageKeys = [...new Set(userEvents.map((event) => event[user].profileImageKey))]
    const cache = new Map()
    const promises = []
    // Download all unique user images in parallel
    for (const profileImageKey of profileImageKeys) {
      const imageURL = `${RestUrlHelper.GET_USER_PROFILE_IMAGE_URL}?key=${profileImageKey}`
      const promise = restActions
        .GET(imageURL, { headers })
        .then((response) => {
          cache.set(profileImageKey, response.data)
        })
        .catch((error) => {
          cache.set(profileImageKey, null)
          // console.log(`Error downloading image for user ${userId}: ${error.message}`);
        })
      promises.push(promise)
    }
    await Promise.all(promises)
    for (const event of userEvents) {
      const profileImageKey = event[user].profileImageKey
      event.locationData = []
      event.locationData = event?.location?.coordinates
      if (cache.has(profileImageKey)) {
        event.image = cache.get(profileImageKey)
      }
    }
    return userEvents
  }

  render() {
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#186881',
      visible: true,
    }
    return (
      <>
        <Dashboard
          {...this.state}
          {...this.props}
          getUserEvent={this.getUserEvent}
          getUserSession={this.getUserSession}
          handleChanges={this.handleChanges}
        ></Dashboard>
      </>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate()
  let params = useParams()
  return <DashboardComponent {...props} navigate={navigate} params={params} />
}

export default WithNavigate
