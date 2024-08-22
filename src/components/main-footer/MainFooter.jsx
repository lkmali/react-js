import { Component } from 'react'
import Wrapper from './FooterStyled'
class MainFooter extends Component {
  render() {
    return (
      <Wrapper className='px-5'>
        <section>{'Email: contactus@LKMALI.com'}</section>

        <section>
          <a style={{ textDecoration: 'none' }} href='https://www.LKMALI.com'>
            www.LKMALI.com
          </a>
        </section>
        <section>{`Copyright@${new Date().getFullYear()} LKMALI Pvt Ltd.`}</section>
      </Wrapper>
    )
  }
}

export default MainFooter
