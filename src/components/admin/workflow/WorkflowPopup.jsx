import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import { confirmAlert } from 'react-confirm-alert'
export default class WorkflowPopup extends Component {
  constructor(props) {
    super(props)
    this.onViewClick = this.onViewClick.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onViewClick = (event) => {
    // console.log('this.props.viewData', this.props.viewData, event)
    this.props.onViewClick(event)
  }
  onDeleteClick = (event) => {
    confirmAlert({
      message: 'Are you sure you want to delete this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.props.onDeleteClick(event),
        },
        {
          label: 'No',
        },
      ],
    })
    this.props.resetState()
  }
  render() {
    return (
      <Modal
        show={this.props.showWorkflowPopup}
        backdrop='static'
        centered
        size='sm'
        onHide={() => this.props.resetState}
        aria-labelledby='example-modal-sizes-title-sm'
      >
        <div className=''>
          <button
            onClick={this.props.resetState}
            type='button'
            className='close custome-close'
            data-dismiss='modal'
            aria-label='Close'
          >
            <span aria-hidden='true'>×</span>
          </button>
        </div>
        <Modal.Body>
          <div>
            <div className='text-center'>
              {this.props.views.indexOf('view') >= 0 ? (
                <button
                  className='btn btn-primary px-5 me-3 mb-3'
                  style={{ marginLeft: 'auto' }}
                  onClick={() => this.onViewClick(this.props.viewData)}
                >
                  <i className='fa-solid fa-eye '></i>
                  <span style={{ margin: '5px' }}>view</span>
                </button>
              ) : (
                <div></div>
              )}

              {this.props.views.indexOf('delete') >= 0 ? (
                <button
                  className='btn btn-primary px-5 me-3'
                  style={{ marginLeft: 'auto' }}
                  onClick={() => this.onDeleteClick(this.props.deleteData)}
                >
                  <i className=' fa fa-trash'></i>
                  <span style={{ margin: '5px' }}>delete</span>
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
