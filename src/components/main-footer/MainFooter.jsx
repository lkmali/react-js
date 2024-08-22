import { Component } from 'react'
import Wrapper from './FooterStyled'
class MainFooter extends Component {
  render() {
    return (
      <Wrapper className='px-5'>
        <section>{'Email: contactus@technavious.com'}</section>

        <section>
          <a style={{ textDecoration: 'none' }} href='https://www.technavious.com'>
            www.technavious.com
          </a>
        </section>
        <section>{`Copyright@${new Date().getFullYear()} Technavious Pvt Ltd.`}</section>
      </Wrapper>
    )
  }
}

export default MainFooter
