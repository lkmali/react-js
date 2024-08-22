import { UPDATE_USER_DATA, UPDATE_USER_LIST } from './action'

export function updateUserList(data: any) {
  return {
    type: UPDATE_USER_LIST,
    payload: data,
  }
}

export function updateUserItem(data: any) {
  return {
    type: UPDATE_USER_DATA,
    payload: data,
  }
}
