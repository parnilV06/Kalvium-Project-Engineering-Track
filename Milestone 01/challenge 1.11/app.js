require('dotenv').config()

const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')

var expressApp = express()
expressApp.use(express.json())
var apiBasePath = process.env.API_BASE_PATH
var port = process.env.PORT

// Keep deployment-specific values out of the code path so the same app can run in different environments.
expressApp.use(apiBasePath, confessionRoutes)
expressApp.listen(port, function() {
  var startupMessage = 'running on ' + port
  console.log(startupMessage)
})
