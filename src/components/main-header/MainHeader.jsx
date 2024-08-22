import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Col, Nav, Navbar, NavItem, Row } from 'reactstrap'
import { env } from '../../config'
import Wrapper from './MainHeaderStyled'

class MainHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const pathname = this.props.location ? this.props.location.pathname : '/'
    return (
      <Wrapper>
        <Navbar className='header'>
          <Row>
            <Col className='d-flex justify-content-xs-start justify-content'>
              {/* <NavbarBrand href="/" style={{ width: 380 }}>
                                <img src="https://LKMALI.com/images/logo-full.png" alt="logo" className="img-fluid" />
                            </NavbarBrand> */}
              <Link to='/' className='pl-sm-0 ms-2 ms-sm-5 ms-lg-0'>
                {' '}
                <img
                  src={env.REACT_APP_PUBLIC_URL + '/images/LKMALI-logo-updated.jpg'}
                  alt=''
                />{' '}
              </Link>
            </Col>
          </Row>
          <Row>
            {pathname !== '/reset-password' ? (
              <Nav className='me-auto'>
                {pathname !== '/demoRequest' && (
                  <NavItem className='px-2'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href='http://www.LKMALI.com/contact-9'
                      className='font-size-1-5 btn-link'
                    >
                      NextGenFT Demo
                    </a>
                    {/* <Link to='/demoRequest' className='font-size-1-5 btn-link'>
                      NextGenFT Demo
                    </Link> */}
                  </NavItem>
                )}
                {pathname !== '/register' && (
                  <NavItem className='px-2'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href='http://www.LKMALI.com/contact-9'
                      className='font-size-1-5 btn-link'
                    >
                      Registration
                    </a>

                    {/* {<Link to='/register' className='font-size-1-5 btn-link'>
                      Registration
                    </Link>} */}
                  </NavItem>
                )}
                {pathname !== '/' && (
                  <NavItem className='px-2'>
                    <Link to='/' className='font-size-1-5 btn-link'>
                      Login
                    </Link>
                  </NavItem>
                )}
              </Nav>
            ) : (
              <Nav className='me-auto'>
                <NavItem className='px-2'>
                  <Link to='/' className='font-size-1-5 btn-link'>
                    <i
                      className='fas fa-arrow-alt-circle-left fa-3x'
                      style={{ color: '#186881' }}
                    ></i>
                  </Link>
                </NavItem>
              </Nav>
            )}
          </Row>
        </Navbar>
      </Wrapper>
    )
  }
}

export default MainHeader
