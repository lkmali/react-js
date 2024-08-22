import { configureStore } from '@reduxjs/toolkit'

// We'll use redux-logger just as an example of adding another middleware
// import logger from 'redux-logger'

// // And use redux-batched-subscribe as an example of adding enhancers
// import { batchedSubscribe } from 'redux-batched-subscribe'
import RootReducer from './rootReducer'

// const debounceNotify = debounce(notify => notify())

// const store = configureStore({
//   reducer: RootReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
//   devTools: process.env.NODE_ENV !== 'production',
//   preloadedState,
//   enhancers: [batchedSubscribe(debounceNotify)],
// })

const store = configureStore({ reducer: RootReducer })
export default store
