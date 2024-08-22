import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
// require("bootstrap/less/bootstrap.less");
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDOM from 'react-dom/client'
import './config'
import './index.css'
import reportWebVitals from './reportWebVitals'
import CommonRoute from './routing/CommonRoute'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <CommonRoute />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
