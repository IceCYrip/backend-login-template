const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/error')
require('dotenv').config()

const generateToken = (user) => {
  const payload = { username: user.username, isAdmin: user.isAdmin } // Customize payload as needed
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }) // Token expires in 1 hour
}

const pathsForAdminOnly = ['/toggleActivation']

const verifyToken = (token, req, res) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    console.error('error: ', error)
    errorHandler(401, req, res, error)
  }
}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    const error = new Error('Invalid token.')
    errorHandler(404, req, res, error)
  } else {
    const user = verifyToken(token, req, res)
    if (pathsForAdminOnly.includes(req.path)) {
      if (!!user?.isAdmin) {
        req.tokenUser = user
        next()
      } else {
        const error = new Error('You do not have access to this resource.')
        errorHandler(403, req, res, error)
      }
    } else {
      req.tokenUser = user
      next()
    }
  }
}

module.exports = { generateToken, authenticateJWT }
