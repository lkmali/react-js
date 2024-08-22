import { omit } from 'lodash'
import { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import AdminFormFieldComponent from '../../../components/admin/forms/AdminFormFieldComponent'

export default class AdminFormFieldContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formRowId: 1,
      deletedItem: [],
    }
    this.deleteAll = this.deleteAll.bind(this)
    this.addFormRow = this.addFormRow.bind(this)
  }
  addFormRow = (sequence, fieldType) => {
    if (this.props?.state?.isPublished) {
      return
    }
    if (fieldType && this.props?.formFiledType?.length) {
      let findFieldType = ''
      findFieldType = this.props.formFiledType.find((x) => x.value === fieldType)
      fieldType = {
        fieldType,
        ...omit(findFieldType, ['defaultValue', 'counter', 'maxValue', 'minValue']),
      }
    }
    let path = sequence.split('.')
    let newSequence = sequence.split('.')
    path = path.map((x) => x - 1)
    const formRow = this.props.formRow
    if (path.length === 1) {
      let sequenceNumber = ++sequence
      if (fieldType) {
        formRow.push({ sequence: sequenceNumber.toString(), repeatCount: 5, ...fieldType })
      } else {
        formRow.push({ sequence: sequenceNumber.toString(), repeatCount: 5 })
      }
    } else {
      let temp = formRow
      for (let index = 0; index < path.length; index++) {
        if (index === path.length - 1) {
          newSequence[newSequence.length - 1] = ++newSequence[newSequence.length - 1]
          if (fieldType) {
            temp.push({ sequence: newSequence.join('.'), repeatCount: 5, ...fieldType })
          } else {
            temp.push({ sequence: newSequence.join('.'), repeatCount: 5 })
          }
        } else {
          temp = temp[path[index]]
          if (temp?.children?.length) {
            temp = temp.children
          } else {
            if (fieldType) {
              temp.children = [{ sequence: sequence, repeatCount: 5, ...fieldType }]
            } else {
              temp.children = [{ sequence: sequence, repeatCount: 5 }]
            }
            break
          }
        }
      }
    }
    this.props.updateFormFiledData(formRow)
  }
  removeItem = (key) => {
    if (this.props?.state?.isPublished) {
      return
    }
    let data = this.removeElement(this.props.formRow, key)
    this.props.updateFormFiledData(data)
  }

  removeElement = (items, removeItem) => {
    items.forEach((item, i) => {
      if (item.sequence === removeItem.sequence) {
        if (removeItem.id) {
          let deletedItem = items.splice(i, 1)
          this.setState((prevState) => ({
            deletedItem: [...prevState.deletedItem, { ...deletedItem[0], isDelete: true }],
          }))
          for (let x = i; x < items.length; x++) {
            let path = items[x].sequence.toString().split('.')
            let changeBackSequence = false
            if (path.length !== 1) {
              changeBackSequence = true
            }
            items[x] = { ...items[x], sequence: items[x].sequence.toString() }
            items[x] = this.sequenceUpdate(items[x], changeBackSequence)
          }
        } else {
          items.splice(i, 1)
          for (let x = i; x < items.length; x++) {
            let path = items[x].sequence.toString().split('.')
            let changeBackSequence = false
            if (path.length !== 1) {
              changeBackSequence = true
            }
            items[x] = { ...items[x], sequence: items[x].sequence.toString() }
            items[x] = this.sequenceUpdate(items[x], changeBackSequence)
          }
        }
      } else {
        if (item && item.children) this.removeElement(item.children, removeItem)
      }
    })
    return items
  }

  sequenceUpdate = (item, changeBackSequence) => {
    let path = item.sequence.split('.')
    if (path.length === 1) {
      let stringNumber = --item.sequence
      item = { ...item, sequence: stringNumber.toString() }
    } else {
      let newPath = path
      if (changeBackSequence) {
        newPath[path.length - 1] = --path[path.length - 1]
      } else {
        newPath[0] = --path[0]
      }
      item = { ...item, sequence: newPath.join('.') }
    }
    if (item.children && item.children.length) {
      item.children.forEach((x, i) => {
        item.children[i] = this.sequenceUpdate(x)
      })
    }
    return item
  }
  // componentDidMount() {
  //   // this.props.handleClose()

  //   // this.props.getFormFields()
  //   console.log("componentDidMount")
  // }

  // getFormFields = () => {

  // }

  cancel = () => {
    this.props.navigate('/home/forms')
  }

  deleteAll = () => {
    if (this.props?.state?.isPublished) {
      return
    }
    confirmAlert({
      message: 'Are you sure you want to delete all ',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let deletedItem = this.props.formRow
              .filter((x) => x.id)
              .map((item) => ({
                ...item,
                isDelete: true,
              }))
            this.setState(
              (prevState) => ({
                deletedItem: [...prevState.deletedItem, ...deletedItem],
              }),
              () => {
                if (this.state.deletedItem && this.state.deletedItem.length) {
                  this.props.handleCreateFormFiled(this.state.deletedItem).then(() => {
                    this.props.getFormFields()
                    // this.setState({ formFiledLoader: false })
                  })
                } else {
                  //  this.setState({ formFiledLoader: false })
                }
              },
            )

            this.props.updateFormFiledData([
              { sequence: '1', fieldType: 'text', title: '', repeatCount: 5 },
              { sequence: '2', fieldType: 'text', title: '', repeatCount: 5 },
              { sequence: '3', fieldType: 'text', title: '', repeatCount: 5 },
              { sequence: '4', fieldType: 'text', title: '', repeatCount: 5 },
            ])
          },
        },
        {
          label: 'No',
        },
      ],
    })
  }

  handleChanges = (event, filedName, key) => {
    if (this.props?.state?.isPublished) {
      return
    }
    let value = ''
    if (filedName) {
      value = event
    } else {
      filedName = event.target.name
      value = event.target.value
      event = key
      event[filedName] = value
    }
    if (filedName === 'fieldType' && event.children && event.children.length) {
      confirmAlert({
        message: 'do you want to change filed type? sub filed will be deleted ',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              let optionsDisable =
                event.fieldType === 'subForm' || event.fieldType === 'group' ? true : false

              event.children = optionsDisable
                ? [{ sequence: `${event.sequence}.1`, repeatCount: 10 }]
                : [{ sequence: `${event.sequence}.1`, fieldType: 'selectOption' }]
              if (event.sequence) {
                let path = event.sequence.toString().split('.')
                let formRow = this.props.formRow
                for (let i = 1; i <= path.length; i++) {
                  if (path.length === 1) {
                    formRow[event.sequence - 1] = event
                  } else {
                    formRow = this.findAndUpdate(event.sequence, event, formRow)
                  }
                }
                this.props.updateFormFiledData(formRow)
              }
            },
          },
          {
            label: 'No',
          },
        ],
      })
    } else {
      if (event.sequence) {
        let path = event.sequence.toString().split('.')
        let formRow = this.props.formRow
        for (let i = 1; i <= path.length; i++) {
          if (path.length === 1) {
            formRow[event.sequence - 1] = event
          } else {
            formRow = this.findAndUpdate(event.sequence, event, formRow)
          }
        }
        this.props.updateFormFiledData(formRow)
      }
    }
  }
  findAndUpdate = (id, val, arr) => {
    let tgtObj = arr.find(({ sequence }) => sequence === id)
    if (tgtObj) {
      let index = arr.findIndex(({ sequence }) => sequence === id)
      arr[index] = val
    } else {
      arr
        .filter((el) => 'children' in el)
        .forEach(({ children }) => this.findAndUpdate(id, val, children))
    }
    return arr
  }
  handleCreateFormFiled = () => {
    if (this.props?.state?.isPublished) {
      return
    }
    this.props
      .handleCreateFormFiled(
        [...this.props.formRow, ...this.state.deletedItem],
        this.state.isUpsert,
      )
      .then((x) => {
        if (x) {
          this.props.getFormFields()
        }
      })
      .catch((x) => {
        //
      })
  }

  render() {
    const { state, navigate, formFiledTypeLoader, formFiledLoader } = this.props
    return (
      <div
        disabled={state?.isPublished ? 'disabled' : ''}
        className={state?.isPublished ? 'form-diasble' : ''}
      >
        <AdminFormFieldComponent
          state={state}
          cancel={this.cancel}
          navigate={navigate}
          formFiledType={this.props.formFiledType}
          formRow={this.props.formRow}
          handleChanges={this.handleChanges} // if any row updates it will be called
          addFormRow={this.addFormRow} // add new row
          removeItem={this.removeItem} // removed a row
          deleteAll={this.deleteAll} // delete all rows
          submit={this.handleCreateFormFiled} // save all the fields
          formFiledLoader={formFiledLoader} // loader....
          formFiledTypeLoader={formFiledTypeLoader} // formFiledTypesLoader
        ></AdminFormFieldComponent>
      </div>
    )
  }
}
