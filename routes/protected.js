const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const { Users } = require('../models')
const errorHandler = require('../utils/error')
const { generateToken, authenticateJWT } = require('../utils/jwt')

const frontendURL = 'http://localhost:3000'

router.use(authenticateJWT)

//ROUTE: Register new user using POST "/api/login"
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    const error = new Error('All fields are necessary')
    console.log(error.message)
    errorHandler(400, req, res, err)
  }

  try {
    const user = await Users.findOne({ where: { username } })

    if (!user) {
      const error = new Error('User not found')
      errorHandler(401, req, res, error)
    } else {
      if (!user?.verified) {
        const error = new Error(
          'Please verify you account by clicking on the link sent to your email'
        )
        errorHandler(401, req, res, error)
      } else {
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
          const error = new Error('Invalid username or Password')
          errorHandler(401, req, res, error)
        } else {
          const token = generateToken(user)
          res.status(200).json({ token })
        }
      }
    }
  } catch (error) {
    console.error('error: ', error)
    errorHandler(500, req, res, error)
  }
})

//ROUTE: Register new user using GET "/api/toggleActivation/:id"
router.get('/toggleActivation/:id', async (req, res) => {
  const { id } = req.params

  if (!id) {
    const error = new Error('Invalid deactivation request')
    console.log(error.message)
    errorHandler(400, req, res, err)
  } else {
    try {
      const user = await Users.findOne({ where: { id } })
      if (!user) {
        const error = new Error('User not found.')
        errorHandler(404, req, res, error)
      } else {
        await Users.update(
          { activeFlag: user.activeFlag === 'Y' ? 'N' : 'Y' },
          { where: { id } }
        )

        res.status(200).json({
          message: `Record ${
            user.activeFlag === 'Y' ? 'deactivated' : 'activated'
          } successfully`,
        })
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }
})

module.exports = router
