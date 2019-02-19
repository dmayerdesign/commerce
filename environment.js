module.exports.environment = function() {
  // Note: though we're using `decodeURIComponent`, this value should NEVER be transmitted
  // via a URL.
  if (process.env.ENVIRONMENT_VARS) {
    console.log(JSON.parse(decodeURIComponent(process.env.ENVIRONMENT_VARS)))
    return JSON.parse(decodeURIComponent(process.env.ENVIRONMENT_VARS))
  }
  return process.env
}
