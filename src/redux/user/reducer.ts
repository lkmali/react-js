/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionType } from '../../typings'
import { UPDATE_USER_DATA, UPDATE_USER_LIST } from './action'

const initialState = {
  userList: {
    count: 0,
    data: [],
  },
  userItem: {},
}

export const userReducer = (state = initialState, action: ActionType<any>) => {
  switch (action.type) {
    case UPDATE_USER_LIST:
      return {
        ...state,
        userList: action.payload,
      }
    case UPDATE_USER_DATA:
      return {
        ...state,
        userItem: action.payload,
      }
    default: {
      return state
    }
  }
}
