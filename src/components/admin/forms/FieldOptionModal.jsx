import { Component } from 'react'
import { Modal } from 'react-bootstrap'
import './Add.css'

export default class AdminGroupsAddComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formRow: [],
    }
  }
  resetState = () => {
    this.setState({
      errors: {},
    })
    this.props.handleClose()
  }
  handleChange = (event, filedName, rowIndex, childrenIndex) => {
    this.props.handleChanges(event, filedName, rowIndex, childrenIndex)
  }
  deleteAllChildRow = (e, rowIndex, childrenIndex) => {
    e.preventDefault()
    this.props.deleteAllChildRow(rowIndex, childrenIndex)
  }
  removeChildRow = (e, rowIndex, childrenIndex) => {
    e.preventDefault()
    this.props.removeChildRow(rowIndex, childrenIndex)
  }
  addChildRow = (e, key) => {
    e.preventDefault()
    this.props.addChildRow(key)
  }

  render() {
    const { state, modalData, formRow } = this.props
    let modalFields = ''
    let row = null
    let rowIndex = null
    if (modalData && formRow && formRow.length) {
      row = formRow?.find((x) => x.sequence === modalData.sequence)
      rowIndex = formRow?.findIndex((x) => x.sequence === modalData.sequence)
      modalFields = row?.children?.map((field, k) => (
        <div key={k} className='col-sm-12 mt-2' style={{ display: 'inline-flex' }}>
          <input
            type='text'
            name='sequence'
            value={`Choice- ${field.sequence}`}
            className={`form-control  me-3${this.state?.errors?.nameError ? 'is-invalid' : ''}`}
            onBlur={this.handleBlur}
            disabled
          />
          <input
            type='text'
            name='title'
            value={field?.title}
            className={`form-control me-3 ${this.state?.errors?.nameError ? 'is-invalid' : ''}`}
            onChange={(e) => this.handleChange(e, null, rowIndex, k)}
            onBlur={this.handleBlur}
          />
          <button
            type='submit'
            onClick={(e) => this.removeChildRow(e, rowIndex, k)}
            className='btn btn-primary px-1 me-2'
          >
            <i className='fa fa-minus'></i>
          </button>
        </div>
      ))
    }
    return (
      <Modal show={this.props.modalShow} backdrop='static' centered>
        <div className='modal-header'>
          <h5 className='modal-title font-weight-bold'>Field Options</h5>
          <button
            onClick={this.resetState}
            type='button'
            className='close custome-close'
            data-dismiss='modal'
            aria-label='Close'
          >
            <span aria-hidden='true'>×</span>
          </button>
        </div>
        <Modal.Body>
          <div className='SecondTab'>
            <div className='row'>
              <div className='col-sm-6'>
                <label htmlFor={true}>Choice list</label>
              </div>
              <div className='col-sm-6'>
                <input
                  type='text'
                  name='name'
                  value={`Q.- ${modalData?.sequence}`}
                  className={`form-control ${state?.errors?.nameError ? 'is-invalid' : ''}`}
                  onBlur={this.handleBlur}
                  disabled
                />
              </div>
            </div>
            <div className='row mt-2'>
              {row && row.children && row.children.length ? (
                <>
                  <div className='col-sm-12'>{modalFields}</div>
                  <div className='col-sm-12 mt-2'>
                    <div className='col-sm-6' style={{ display: 'inline-flex' }}>
                      <button
                        type='submit'
                        onClick={(e) => this.addChildRow(e, modalData)}
                        className='btn btn-primary px-5 me-3'
                      >
                        Add Row
                      </button>
                      <button
                        type='submit'
                        onClick={(e) => this.deleteAllChildRow(e, rowIndex)}
                        className='btn btn-primary px-5 me-3'
                      >
                        Delete All
                      </button>
                      <button
                        type='submit'
                        onClick={this.resetState}
                        className='btn btn-primary px-5 me-3'
                      >
                        Save
                      </button>
                      {/* <button type="submit" onClick={this.submit} className="btn btn-primary px-5">Save</button> */}
                    </div>
                  </div>
                </>
              ) : (
                <div className='col-sm-12'>
                  <div className='col-sm-6' style={{ display: 'inline-flex' }}>
                    <button
                      type='submit'
                      onClick={(e) => this.addChildRow(e, modalData)}
                      className='btn btn-primary px-5 me-3'
                    >
                      Add Row
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
