import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Select from 'react-select'
import { env } from '../../config'
import { MapWithCustomImage } from '../../googleMap/MarkerWithPath'
import './Dashboard.css'
const Dashboard = (props) => {
  const [userEvents, setUserEvents] = useState()
  const [userList, setUserList] = useState(props.userList)
  const [userEventCount, setEventCount] = useState(props.userEventCount)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterValues, setFilterValues] = useState(props.filterValues)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true)

  const fieldColors = {
    detail: '#FFDAB9', // Example color
    time: '#ADD8E6', // Example color
    location: '#F0E68C', // Example color
  }

  useEffect(() => {
    if (props.userEvents && props.userEvents.length) {
      setUserEvents(props.userEvents)
    } else {
      setUserEvents([])
      setHasMoreData(false)
    }
  }, [props.userEvents])

  useEffect(() => {
    setFilterValues(props.filterValues)
  }, [props.filterValues])
  useEffect(() => {
    setUserList(props.userList)
  }, [props.userList])
  useEffect(() => {
    setEventCount(props.userEventCount)
  }, [props.userEventCount])

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
    if (isFilterOpen) {
      props.handleChanges(null, null, null, null, isFilterOpen)
    }
  }

  const loadMoreData = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await props.getUserEvent()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return items
      }
      const updatedItems = items.filter((list) => {
        return list?.name.toLowerCase().includes(searchValue.toLowerCase())
      })
      return updatedItems
    }
  }
  const handleChanges = (e, filedName, multi, direct) => {
    props.handleChanges(e, filedName, multi, direct)
  }
  const currentTime = new Date().getTime()
  const getValue = (opts, val) => (opts && opts.length ? opts.find((o) => o.value === val) : null)
  return (
    <>
      <div className='dashboard'>
        <div className='card card-wide me-4'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 className='mb-2'>Latest Activities</h2>
            {isFilterOpen ? (
              <>
                <div className='card filter-options'>
                  <div className='col-sm-9 mt-2 me-2'>
                    <div className='form-group'>
                      {/* <label>User</label> */}
                      <div>
                        <Select
                          name='userId'
                          closeOnSelect={false}
                          value={getValue(userList, handleChanges?.userId)}
                          defaultValue={[]}
                          isSearchable
                          noOptionsMessage={() => 'No match found...'}
                          // isMulti
                          filterOptions={handleFilter}
                          options={userList}
                          onChange={(e) => handleChanges(e, 'userId', false)}
                          placeholder='Select users'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-2 mt-2'>
                    <button
                      className='filter-button btn btn-primary'
                      style={{ marginLeft: 'auto' }}
                      onClick={toggleFilter}
                    >
                      <i className='fas fa-close'></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{ width: isFilterOpen ? '40%' : '' }}
                className={`${isFilterOpen ? 'card ' : ''}mb-2 filter-container`}
              >
                <button
                  className='filter-button btn btn-primary'
                  style={{ marginLeft: 'auto' }}
                  onClick={toggleFilter}
                >
                  <i className='fas fa-filter'></i>
                </button>
              </div>
            )}
          </div>
          <InfiniteScroll
            dataLength={userEventCount}
            next={loadMoreData}
            hasMore={hasMoreData}
            loader={<h4>Loading...</h4>}
            height={400}
            // endMessage={
            //   <p style={{ textAlign: 'center' }}>
            //     <b> no more data </b>
            //   </p>
            // }
            // style={{ 'overflow-x': 'hidden' }}
            style={{ overflowX: 'hidden', overflowY: 'scroll', scrollbarWidth: 'thin' }}
          >
            {userEvents && userEvents.length ? (
              userEvents.map((userEvent, index) => (
                <div className='event-item' key={index}>
                  <div className='icon-container me-2'>
                    <img
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = env.REACT_APP_PUBLIC_URL + '/images/teachnaviouslogo.png'
                      }}
                      src={userEvent.image ? userEvent.image : 'https://via.placeholder.com/50'}
                      alt={userEvent.name}
                    />
                    {/* if user has performed any action in last 30 mintues then active otherwise away. If user has not performed any action in last 15 days then show status as inactive.  */}
                    {Math.floor((currentTime - userEvent.createdAt) / (1000 * 60)) <= 30 ? (
                      <div className='status-circle-online'></div>
                    ) : Math.floor((currentTime - userEvent.createdAt) / (1000 * 60)) > 30 &&
                      Math.floor((currentTime - userEvent.createdAt) / (1000 * 60)) <=
                        15 * 24 * 60 ? (
                      <div className='status-circle-away'></div>
                    ) : (
                      <div className='status-circle-offline'></div>
                    )}
                  </div>
                  <div className=' item-details'>
                    <div
                      className='row'
                      style={{
                        alignItems: 'center',
                      }}
                    >
                      <p className='col-9'>
                        {userEvent?.User?.username} {userEvent.comment}{' '}
                        <span>
                          {userEvent.address.split(' ')[0]}{' '}
                          {userEvent.address.split(' ').slice(1).join(' ')}
                        </span>
                      </p>
                      <p className='col-3'>
                        {format(new Date(userEvent.createdAt), 'dd/MM/yyyy hh:mm:ss a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className='row'
                style={{
                  alignItems: 'center',
                }}
              >
                <h1>data not available</h1>
              </div>
            )}
          </InfiniteScroll>
        </div>

        <div className='card'>
          <h2 className='mb-2'>Status</h2>
          <ul>
            {!props.userSessionLoader
              ? props.userSessions && props.userSessions.length
                ? props.userSessions.map((userSession, index) => (
                    <li key={index}>
                      <div className='icon-container me-2'>
                        <img
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = env.REACT_APP_PUBLIC_URL + '/images/teachnaviouslogo.png'
                          }}
                          src={userSession.image}
                          alt={userSession.name}
                        />
                        {/* if user has performed any action in last 30 mintues then active otherwise away. If user has not performed any action in last 15 days then show status as inactive.  */}
                        {userSession?.status != 'offline' &&
                        Math.floor((currentTime - userSession.lastActiveTime) / (1000 * 60)) <=
                          30 ? (
                          <div className='status-circle-online'></div>
                        ) : Math.floor((currentTime - userSession.lastActiveTime) / (1000 * 60)) >
                            30 &&
                          Math.floor((currentTime - userSession.lastActiveTime) / (1000 * 60)) <=
                            15 * 24 * 60 ? (
                          <div className='status-circle-away'></div>
                        ) : (
                          <div className='status-circle-offline'></div>
                        )}
                      </div>
                      {userSession?.user?.username}
                    </li>
                  ))
                : ''
              : ''}
          </ul>
        </div>
      </div>
      <div className='card mt-4' style={{ width: '100%' }}>
        <MapWithCustomImage
          userEvents={
            props?.userSessions && props?.userSessions.length
              ? props?.userSessions.map((x) => {
                  return {
                    profileImage: x.image,
                    coordinates: x.location,
                    name: x?.user?.username,
                  }
                })
              : ''
          }
        />
      </div>
    </>
  )
}
export default Dashboard
