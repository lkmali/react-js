import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import LoaderContainer from '../../loader/Loader'
export default class ExportFileModalDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: [3],
    }
  }
  onSelectStatus = (status) => {
    const selectedStatus = this.state.status
    if (selectedStatus.indexOf(status) < 0) {
      selectedStatus.push(status)
    } else {
      selectedStatus.splice(selectedStatus.indexOf(status), 1)
    }
    this.setState({ status: selectedStatus })
  }
  onClickDownload = () => {
    this.props.onClickDownload({ ...this.props.bodyData, status: this.state.status })
  }

  render() {
    const { status } = this.state

    const style = (value) => {
      if (status.indexOf(value) < 0) {
        return {
          color: 'black solid',
          cursor: 'pointer',
          backgroundColor: 'transparent',
        }
      } else {
        return { color: 'black', cursor: 'pointer' }
      }
    }
    return (
      <Modal show={this.props.modalShow} onHide={() => this.props.handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Select Status to Download your File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='col-sm-12'>
            <div className='row '>
              <div
                className='btn-group col-md-4 col-sm-4 col-xs-12  mb-3 rounded card-background'
                style={style(1)}
              >
                <div className='me-2' onClick={() => this.onSelectStatus(1)}>
                  <i className='fa fa-envelope status' style={style(1)}>
                    {'  Drafted'}
                  </i>
                </div>
              </div>
            </div>
            <div className='row '>
              <div
                className='btn-group col-md-4 col-sm-4 col-xs-12  mb-3 rounded card-background'
                style={style(2)}
              >
                <div className='me-2' onClick={() => this.onSelectStatus(2)}>
                  <i className='fa fa-check-circle status' style={style(2)}>
                    {'  Submitted'}
                  </i>
                </div>
              </div>
            </div>
            <div className='row '>
              <div
                className='btn-group col-md-4 col-sm-4 col-xs-12  mb-3 rounded card-background'
                style={style(3)}
              >
                <div className='me-2' onClick={() => this.onSelectStatus(3)}>
                  <i className='fa fa-check status' style={style(3)}>
                    {'  Verified'}
                  </i>
                </div>
              </div>
            </div>
            <div className='row '>
              <div
                className='btn-group col-md-4 col-sm-4 col-xs-12  mb-3 rounded card-background'
                style={style(4)}
              >
                <div className='me-2' onClick={() => this.onSelectStatus(4)}>
                  <i className='fa fa-envelope status' style={style(4)}>
                    {'  Rejected'}
                  </i>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {this.props.downloadXlsxLoader ? (
            <button className='btn btn-primary px-5 me-5' disabled>
              <LoaderContainer
                type={'Circles'}
                color={'white'}
                height={15}
                width={15}
                visible={true}
              ></LoaderContainer>
            </button>
          ) : (
            <div
              className='col-xs-12 rounded card-background'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className='me-2' onClick={() => this.onClickDownload()}>
                <i className='fa fa-envelope status' style={{ color: 'black', cursor: 'pointer' }}>
                  {'  Download'}
                </i>
              </div>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    )
  }
}
