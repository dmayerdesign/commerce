const { resolve } = require('path')

if (process.env.QB_PATH_TO_SECRETS) {
  require('dotenv').config({
    path: resolve(process.env.QB_PATH_TO_SECRETS, '.env')
  })
}

module.exports.environment = function() {
  // Note: though we're using `decodeURIComponent`, this value should NEVER be transmitted
  // via a URL.
  if (process.env.ENVIRONMENT_VARS) {
    return JSON.parse(decodeURIComponent(process.env.ENVIRONMENT_VARS))
  }
  return process.env
}
