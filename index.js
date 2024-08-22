/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const express = require('express');
const path = require('path');
const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'build')));
// need to declare a "catch all" route on your express server
// that captures all page requests and directs them to the client
// the react-router do the route part
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(
  process.env.REACT_APP_PORT || 5000,
  function () {
    console.log(`Frontend start on ${process.env.REACT_APP_PUBLIC_URL}`)
  }
);
