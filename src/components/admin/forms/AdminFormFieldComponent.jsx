import { omit } from 'lodash'
import { Component } from 'react'
import SelectSearch from 'react-select-search'
import LoaderContainer from '../../../container/loader/Loader'
export default class AdminFormFieldComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayChildren: {},
    }
    this.addRow = this.addRow.bind(this)
    this.handleChange = this.handleChange.bind(this)
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

  addRow = (formRow, fieldType) => {
    let sequence = 0
    if (formRow && formRow.length) {
      sequence = formRow.slice(-1)[0].sequence
    }
    this.props.addFormRow(sequence?.toString(), fieldType)
  }

  cancel = () => {
    this.props.cancel()
  }

  deleteAll = () => {
    this.props.deleteAll()
  }
  submit = () => {
    this.props.submit()
  }

  removeItem(rowItem) {
    this.props.removeItem(rowItem)
  }

  handleChange(event, filedName, keyId) {
    this.props.handleChanges(event, filedName, keyId)
  }

  renderIcon(props, option, snapshot, className) {
    const imgStyle = {
      borderRadius: '50%',
      verticalAlign: 'middle',
      marginRight: 10,
    }
    return (
      <button {...props} className={className} type='button'>
        <span>
          <i className={`${option.icon} fa-sm`} style={imgStyle} aria-hidden='true' />
          <span>| {option.name}</span>
        </span>
      </button>
    )
  }

  render() {
    let {
      state,
      fieldType,
      removeItem,
      formFiledType,
      isChildComponent = false,
      formRow,
      multiChild,
      addFormRow,
      handleChanges,
      formFiledLoader,
      formSubmissionFiledLoader,
    } = this.props
    const formFieldType = (item) => {
      return formFiledType?.find((x) => x.value === item.fieldType)
    }
    const loaderProperty = {
      type: 'Circles',
      height: 100,
      width: 100,
      color: '#186881',
      visible: true,
    }

    let renderElement = () => {
      if (formFiledLoader) {
        return <LoaderContainer {...loaderProperty}></LoaderContainer>
      } else if (formRow?.length) {
        return (
          <>
            {formRow.map((rowItem, i) => {
              let optionsDisable =
                rowItem.fieldType === 'subForm' || rowItem.fieldType === 'group' ? true : false
              let multiChild = rowItem.fieldType !== 'range'
              return (
                <div className='row mt-3' key={i}>
                  <div className={isChildComponent ? 'col-sm-1 px-1' : 'col-sm-1 px-1'}>
                    <input
                      type='text'
                      name='sequence'
                      value={`Q.- ${rowItem.sequence}`}
                      className={`form-control ${state?.errors?.nameError ? 'is-invalid' : ''}`}
                      onBlur={this.handleBlur}
                      disabled
                    />
                  </div>
                  <div className='col-sm-4'>
                    <SelectSearch
                      name='fieldType'
                      disabled={isChildComponent && fieldType === 'selectOption'}
                      closeOnSelect={true}
                      renderOption={this.renderIcon}
                      search
                      filterOptions={this.handleFilter}
                      options={formFiledType}
                      placeholder='Select filed Type'
                      onChange={(e) => {
                        this.handleChange(
                          {
                            ...rowItem,
                            ...omit(
                              formFiledType.find((x) => x.value === e),
                              ['defaultValue', 'counter', 'maxValue', 'minValue'],
                            ),
                            fieldType: e,
                          },
                          'fieldType',
                          rowItem.sequence,
                        )
                      }}
                      value={rowItem?.fieldType}
                    />
                  </div>
                  {rowItem.fieldType && (
                    <>
                      <div className='col-sm-3'>
                        <input
                          type='text'
                          name='title'
                          required={true}
                          className={`form-control ${state?.errors?.nameError ? 'is-invalid' : ''}`}
                          onBlur={this.handleBlur}
                          value={rowItem.title ?? ''}
                          onChange={(e) => this.handleChange(e, null, rowItem)}
                          placeholder='Enter name'
                        />
                      </div>
                      {formFieldType(rowItem)?.childRequire ? (
                        <>
                          <button
                            className='btn btn-primary col-sm-2'
                            onClick={() => {
                              if (!(rowItem.children && rowItem.children.length)) {
                                optionsDisable
                                  ? addFormRow(`${rowItem.sequence}.1`)
                                  : multiChild
                                  ? addFormRow(`${rowItem.sequence}.1`, 'selectOption')
                                  : addFormRow(`${rowItem.sequence}.1`, rowItem, true)
                              }
                              this.setState((prevState) => ({
                                ...prevState,
                                displayChildren: {
                                  ...prevState.displayChildren,
                                  [rowItem.sequence]: !this.state.displayChildren[rowItem.sequence],
                                },
                              }))
                            }}
                          >
                            {optionsDisable ? (
                              <>
                                <i className='fa fa-arrow-circle-down'></i>
                                {this.state.displayChildren[rowItem.sequence] ? ' - ' : ' + '}
                              </>
                            ) : multiChild ? (
                              <>
                                <i className='fa fa-pencil-alt'></i>
                                <span>
                                  {this.state.displayChildren[rowItem.sequence] ? ' - ' : ' + '} |
                                  Field Options
                                </span>
                              </>
                            ) : (
                              <>
                                <i className='fa fa-pencil-alt'></i>
                                <span>
                                  {this.state.displayChildren[rowItem.sequence] ? ' - ' : ' + '} |
                                  Field data
                                </span>
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        ''
                      )}
                    </>
                  )}

                  {formFieldType(rowItem)?.defaultValue ? (
                    <>
                      <div className='col-sm-3'>
                        <input
                          type='text'
                          name='defaultValue'
                          className={'form-control'}
                          onBlur={this.handleBlur}
                          value={rowItem.defaultValue ?? ''}
                          onChange={(e) => this.handleChange(e, null, rowItem)}
                          placeholder='Enter default value'
                        />
                      </div>
                    </>
                  ) : (
                    ''
                  )}

                  <div className='col-sm-1'>
                    {formRow && formRow.length > 1 ? (
                      <button
                        type='submit'
                        onClick={() => {
                          this.removeItem(rowItem)
                          this.setState((prevState) => ({
                            ...prevState,
                            displayChildren: {
                              ...prevState.displayChildren,
                              [rowItem.sequence]: !this.state.displayChildren[rowItem.sequence],
                            },
                          }))
                        }}
                        className='btn btn-primary px-1 me-2'
                      >
                        <i className='fa fa-minus'></i>
                      </button>
                    ) : (
                      ' '
                    )}
                  </div>
                  {rowItem.fieldType && (
                    <>
                      {formFieldType(rowItem)?.childRequire ? (
                        <>
                          {[rowItem.sequence] &&
                            this.state.displayChildren[rowItem.sequence] &&
                            rowItem.children &&
                            rowItem.children.length && (
                              <div className='btn-light round-ege col-sm-11 mt-1'>
                                <AdminFormFieldComponent
                                  isChildComponent={true}
                                  multiChild={multiChild}
                                  addFormRow={addFormRow}
                                  removeItem={removeItem}
                                  handleChanges={handleChanges}
                                  formRow={
                                    rowItem.children && rowItem.children.length
                                      ? rowItem.children
                                      : ''
                                  }
                                  state={state}
                                  formFiledType={formFiledType}
                                  fieldType={
                                    optionsDisable ? false : multiChild ? 'selectOption' : 'range'
                                  }
                                />
                              </div>
                            )}
                        </>
                      ) : (
                        <RangeChildComponent
                          rowItem={rowItem}
                          formFiledType={formFiledType}
                          handleChange={this.handleChange}
                        />
                      )}
                    </>
                  )}
                </div>
              )
            })}

            <div className='row mt-3'>
              <div className='col-sm-6' style={{ display: 'inline-flex' }}>
                {!isChildComponent || (isChildComponent && multiChild) ? (
                  <button
                    type='submit'
                    onClick={() => {
                      this.addRow(formRow, fieldType)
                    }}
                    className='btn btn-primary me-3'
                  >
                    Add Rows
                  </button>
                ) : (
                  ''
                )}
                {!isChildComponent && (
                  <>
                    <button type='submit' onClick={this.deleteAll} className='btn btn-primary me-3'>
                      Delete All
                    </button>
                    {
                      <button
                        disabled={formFiledLoader}
                        type='submit'
                        onClick={this.submit}
                        className='btn btn-primary '
                      >
                        Save
                      </button>
                    }
                  </>
                )}
              </div>
            </div>
          </>
        )
      } else {
        return (
          <div className='row mt-3'>
            <div className='col-sm-6' style={{ display: 'inline-flex' }}>
              <button type='submit' onClick={this.addRow} className='btn btn-primary px-5 me-3'>
                Add Row
              </button>
              <button type='submit' onClick={this.cancel} className='btn btn-primary px-5 me-3'>
                Cancel
              </button>
            </div>
          </div>
        )
      }
    }
    return <div className='SecondTab'>{renderElement()}</div>
  }
}

export class RangeChildComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { rowItem, formFiledType, handleChange } = this.props
    const formFieldType = (item) => {
      return formFiledType?.find((x) => x.value === item.fieldType)
    }
    const getChildValue = (value, placeholder) => {
      return (
        <>
          {/* <div className={'col-sm-1 px-1'}></div> */}
          <div
            className={'col-sm-4 px-1'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <label>
              <b>{value} </b>
            </label>
            <input
              type='number'
              name={value}
              value={rowItem?.[value] ?? 1}
              className={'form-control  ms-2'}
              onBlur={this.handleBlur}
              placeholder={placeholder}
              onChange={(e) => {
                handleChange(
                  {
                    ...rowItem,
                    ...formFiledType.find((x) => x.value === e),
                    [value]: parseInt(e.target.value ?? 1),
                  },
                  value,
                  rowItem.sequence,
                )
              }}
            />
          </div>
        </>
      )
    }
    const isChildRequire = (item) => {
      const data = formFieldType(item)
      return data?.counter || data?.maxValue || data?.minValue
    }

    return (
      <>
        {isChildRequire(rowItem) ? (
          <div className={'col-sm-4 mt-1 '}>
            {/* <div className='row mt-2 mb-2'> */}
            {formFieldType(rowItem)?.minValue
              ? getChildValue('minValue', 'Enter Minimum value')
              : ''}
            {formFieldType(rowItem)?.maxValue ? getChildValue('maxValue', 'Enter max value') : ''}
            {formFieldType(rowItem)?.counter ? getChildValue('counter', 'Enter counter') : ''}
            {/* </div> */}
          </div>
        ) : (
          ''
        )}
      </>
    )
  }
}
