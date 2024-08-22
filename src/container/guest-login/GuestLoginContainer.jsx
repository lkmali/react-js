import { Component } from 'react'
import LoaderContainer from '../loader/Loader'

export default class GuestLoginContainer extends Component {
  constructor(props) {
    super(props)
  }

  /**
   * This method handles the request when user submits a form
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.handleSubmit(this.props.id)
  }

  render() {
    return (
      <div className='container '>
        <div className='row d-flex justify-content-center align-items-center h-100'>
          <div className='col-lg-5 col-sm-8'>
            <div className='white-box border border-info rounded mt-3'>
              <h4 className='font-weight-bold text-center'>Login as a guest</h4>
              {/* <div className="text-secondary text-center">Access to your dashboard</div> */}
              <form onSubmit={this.handleSubmit}>
                <div className='row mt-4'>
                  <div className='col-sm-12'>
                    {this.props.formLoader ? (
                      <button className='btn btn-primary btn-lg d-block w-100' disabled>
                        <LoaderContainer
                          type={'Circles'}
                          color={'white'}
                          height={20}
                          width={20}
                          visible={true}
                        ></LoaderContainer>
                      </button>
                    ) : (
                      <button
                        disabled={!this.props.id}
                        className='btn btn-dark btn-lg d-block w-100'
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
