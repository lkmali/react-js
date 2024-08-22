import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Col, Nav, Navbar, NavItem, Row } from 'reactstrap'
export default class PageNotFoundComponent extends Component {
  render() {
    return (
      <>
        <Navbar className='header'>
          <Row>
            <Col className='d-flex justify-content-xs-start justify-content'>
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
            </Col>
          </Row>
        </Navbar>
        <div className='all-content-center'>
          <div>
            Your exploration end here........
            <br />
          </div>
        </div>
      </>
    )
  }
}
