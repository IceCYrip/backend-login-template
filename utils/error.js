const errorHandler = (errStatus, req, res, err = null) => {
  res.status(errStatus).json({
    status: errStatus,
    path: req.path,
    message: getErrorMessage(errStatus),
    description: err?.message || null, // Use err.message if available
  })
}

const getErrorMessage = (status) => {
  switch (status) {
    case 400:
      return 'Bad request'
    case 401:
      return 'Unauthorized'
    case 402:
      return 'Payment Required'
    case 403:
      return 'Forbidden'
    case 404:
      return 'Data not found'
    case 405:
      return 'Method not allowed'
    case 409:
      return 'Conflict'
    default:
      return 'Internal server error'
  }
}

module.exports = errorHandler
