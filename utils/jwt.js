const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/error')
require('dotenv').config()

const generateToken = (user) => {
  const payload = { id: user.id, username: user.username } // Customize payload as needed
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }) // Token expires in 1 hour
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    const error = new Error('Invalid token.')
    errorHandler(404, req, res, error)
  }

  verifyToken(token, (err, user) => {
    if (err) {
      const error = new Error('You do not have access to this resource.')
      errorHandler(403, req, res, error)
    }
    req.user = user
    next()
  })
}

module.exports = { generateToken, authenticateJWT }
