import { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { errorMessage } from '../../../helper'
import LoaderContainer from '../../loader/Loader'

class WorkflowForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
    }
  }
  handleBlur = (event, filedName) => {
    const { inputValues } = this.props
    let name = ''
    let value = ''
    if (filedName) {
      name = filedName
      value = event
    } else {
      name = event.target.name
      value = event.target.value
    }
    if (!inputValues[name]) {
      this.setState({ errors: { [name + 'Error']: errorMessage[[name] + 'Empty'] } })
    } else {
      this.setState({ errors: { [name + 'Error']: errorMessage[[name] + 'Empty'] } })
    }
  }

  handleUpdate = () => {
    // handle update logic here
  }
  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return items
      }
      const updatedItems = items.filter((list) => {
        return list?.name.toLowerCase().includes(searchValue.toLowerCase())
      })
      return updatedItems
    }
  }
  getValue = (opts, val) => (opts && opts.length ? opts.find((o) => o.value === val) : null)
  render() {
    const { errors } = this.props
    const { inputValues, projectDropDown, isUpsert } = this.props
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#e84546',
      visible: true,
    }

    return (
      <Modal show={this.props.showModal} onHide={this.props.handelModel}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.newModal ? 'Create Workflow' : 'Update Workflow'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.formSubmissionLoader ? (
            <LoaderContainer {...loaderProperty} />
          ) : (
            <Form onSubmit={this.props.handleSubmit}>
              <div className='row'>
                <div className='col-sm-12 mt-2'>
                  <Form.Group controlId='workflowName'>
                    <Form.Label>Name :</Form.Label>
                    <Form.Control
                      type='text'
                      name='workflowName'
                      value={inputValues?.workflowName}
                      onChange={this.props.handleChanges}
                      onBlur={this.handleBlur}
                    />
                  </Form.Group>
                </div>
                <div className='col-sm-12 mt-2'>
                  <div className='form-group'>
                    <label>Project Name :</label>
                    <Select
                      name='projectId'
                      key='projectId'
                      closeOnSelect={true}
                      search
                      filterOptions={this.handleFilter}
                      onBlur={(e) => this.handleBlur(e.target.value, 'projectId')}
                      options={projectDropDown}
                      value={this.getValue(projectDropDown, inputValues?.projectId)}
                      placeholder='Select Project'
                      isDisabled={isUpsert}
                      onChange={(e) => {
                        this.props.handleChanges(e, 'projectId', false)
                        this.props.handleChanges(e, 'projectName', null, false, true)
                        // getFormList(e.value)
                      }}
                    />
                  </div>
                  <span className='text-danger'>{errors.projectIdError}</span>
                </div>
              </div>
              {/* {!this.props.newModal && inputValues?.status === 'DRAFT' && (
                <Form.Group controlId='workflowName'>
                  <Form.Label>Status:</Form.Label>
                  <Form.Check
                    type='switch'
                    id='custom-switch'
                    name='status'
                    // value="draft"
                    checked={inputValues?.status === 'ACTIVE'}
                    onChange={this.props.activeWorkflow}
                  />
                </Form.Group>
              )} */}

              {/* {!this.props.newModal && inputValues?.status === 'draft' && (
                <div className="row">
                  <div className="col">
                    <Form.Group controlId="status">
                      <Form.Label>Status:</Form.Label>
                      <Select
                        name="status"
                        options={[
                          { value: 'draft', label: 'Draft' },
                          { value: 'published', label: 'Published' },
                          { value: 'archived', label: 'Archived' },
                        ]}
                        value={{ value: inputValues?.status, label: inputValues?.status }}
                        onChange={(value) => {
                          this.props.handleChanges({ target: { name: 'status', value: value.value } });
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>
              )} */}
              <div className='row'>
                <div className='col'>
                  <Button
                    variant='primary'
                    className='mt-3'
                    type='submit'
                    disabled={this.props.isLoading}
                  >
                    {this.props.newModal ? 'Add' : 'Update'}
                  </Button>
                </div>
                {/* {this.props.id && (
                  <div className="col">
                    <Button
                      variant="primary"
                      className="ml-2 mt-3"
                      onClick={this.handleSubmit}
                      disabled={this.props.formSubmissionLoader}
                    >
                      Update
                    </Button>
                  </div>
                )} */}
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    )
  }
}

export default WorkflowForm
