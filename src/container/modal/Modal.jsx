import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalContainer = (props) => {
  return (
    <div>
      <Modal size='lg' show={props.show} backdrop='static' centered>
        <div className='modal-header'>
          <h5 className='modal-title font-weight-bold'>{props.title}</h5>
          <button
            onClick={props.closeModal}
            type='button'
            className='close custome-close'
            data-dismiss='modal'
            aria-label='Close'
          >
            <span aria-hidden='true'>×</span>
          </button>
        </div>

        <Modal.Body>{props.children}</Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalContainer
