import { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { reactGAEvent } from '../../../helper'

export default class SideMenuComponent extends Component {
  constructor(props) {
    super(props)
  }
  logout = () => {
    reactGAEvent('logout', 'logout Click', 'logout from poratl')
    localStorage.clear()
    this.props.navigate('/')
  }

  home = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fa fa-home' aria-hidden='true' title='Home' />
        </span>{' '}
        Home
      </NavLink>
    )
  }
  project = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/projects`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i
            className='fas fa-file-signature'
            style={{ color: '#000000' }}
            aria-hidden='true'
            title='Projects'
          />
        </span>{' '}
        Projects
      </NavLink>
    )
  }
  form = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/forms`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fa fa-file' aria-hidden='true' title='Forms' />
        </span>{' '}
        Forms
      </NavLink>
    )
  }
  user = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/users`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fas fa-user-friends' aria-hidden='true' title='Users'></i>
        </span>{' '}
        Users{' '}
      </NavLink>
    )
  }
  group = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/groups`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fas fa-users' title='Groups'></i>
        </span>{' '}
        Groups{' '}
      </NavLink>
    )
  }
  //

  fromData = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/formData`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='far fa-file-alt' style={{ color: '#000000' }} title='FormData'></i>
        </span>{' '}
        Form Data{' '}
      </NavLink>
    )
  }

  task = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/task-template`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fa fa-tasks' title='Task'></i>
        </span>{' '}
        Task Template{' '}
      </NavLink>
    )
  }
  userTask = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/user-task`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fa fa-tasks' title='User Task'></i>
        </span>{' '}
        User Tasks{' '}
      </NavLink>
    )
  }
  workflow = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/workflow`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fas fa-bezier-curve' style={{ color: '#000000' }} title='Workflow'></i>
        </span>{' '}
        Workflow{' '}
      </NavLink>
    )
  }
  sharedResource = (baseNavPath) => {
    return (
      <NavLink
        to={`${baseNavPath}/home/shared-resource`}
        activeclassname={'active'}
        className='d-block text-decoration-none'
      >
        <span className='box-icon'>
          <i className='fa fa-share-alt' style={{ color: '#000000' }} title='FormData'></i>
        </span>{' '}
        Shared Resource{' '}
      </NavLink>
    )
  }

  render() {
    const items = []
    for (const data of this.props.navData) {
      items.push(this[data](this.props.baseNavPath))
    }
    return (
      <div
        className='whitebox'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <ul className='list-group'>
          {items.map((item, i) => {
            return (
              <li key={i} className={'list-group-item border-0 list-group-item-action'}>
                {item}
              </li>
            )
          })}
        </ul>
        {/* <i className="fa-solid fa-arrow-up-left-from-circle"></i> */}
        <div className='sidebar list-group-item border-0 list-group-item-action logout-margin'>
          <div
            className='text-decoration-none d-block color-black font-weight-bold d-flex align-items-center'
            onClick={this.logout}
            aria-haspopup='true'
            aria-expanded='false'
          >
            <span className='box-icon'>
              <i className='fas fa-sign-out-alt' aria-hidden='true' title='Logout' />
            </span>{' '}
            Logout
          </div>
        </div>
      </div>
    )
  }
}
