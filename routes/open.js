const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const { Users } = require('../models')
const errorHandler = require('../utils/error')
const emailService = require('../utils/email')

const { generateToken } = require('../utils/jwt')

const frontendURL = 'http://localhost:3000'

//Initialise admin User if it doesn't exist
async function initializeAdminUser() {
  const adminUser = {
    activeFlag: 'Y',
    verified: true,
    fullName: 'admin',
    username: 'admin@gmail.com',
    password: 'admin123',
    mobileNumber: 1234567890,
    language: 'en',
    isAdmin: true,
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(adminUser?.password, salt)

  const [user, created] = await Users.findOrCreate({
    where: { username: 'admin@gmail.com' },
    defaults: {
      activeFlag: 'Y',
      verified: true,
      fullName: 'admin',
      username: 'admin@gmail.com',
      password: hashedPassword,
      mobileNumber: 1234567890,
      language: 'en',
      isAdmin: true,
    },
  })

  console.log(
    `Admin user ${created ? 'created' : 'already exists'} with username ${
      user.username
    }.`
  )
}

//Open Routes

//ROUTE: Register new user using POST "/api/register"
router.post('/register', async (req, res) => {
  const { fullName, username, password, mobileNumber, language } = req.body
  if (!fullName || !username || !password || !mobileNumber || !language) {
    const error = new Error('All fields are necessary')
    console.log(error.message)
    errorHandler(400, req, res, error)
  } else {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const [user, created] = await Users.findOrCreate({
        where: { username },
        defaults: {
          activeFlag: 'Y',
          verified: false,
          fullName,
          username,
          password: hashedPassword,
          mobileNumber,
          language,
          isAdmin: false,
        },
      })
      if (created) {
        console.log('User created successfully')
        // const { username, fullName } = user

        await emailService(user)
          .then((emailRes) => {
            res.status(200).json(emailRes)
          })
          .catch((error) => {
            errorHandler(500, req, res, error)
          })
      } else {
        const error = new Error('Username already exists')
        console.log(error.message)
        return errorHandler(409, req, res, error)
      }
    } catch (error) {
      console.log(error)
      errorHandler(500, req, res, error)
    }
  }
})

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
          res.status(200).json({ token: `Bearer ${token}` })
        }
      }
    }
  } catch (error) {
    console.error('error: ', error)
    errorHandler(500, req, res, error)
  }
})

//ROUTE: Register new user using GET "/api/verify/:id"
router.get('/verify/:id', async (req, res) => {
  const { id } = req.params

  if (!id) {
    const error = new Error('Invalid verification request')
    console.log(error.message)
    errorHandler(400, req, res, err)
  } else {
    try {
      const user = await Users.findOne({ where: { id } })
      if (!user) {
        const error = new Error('User not found. Please try registering.')
        errorHandler(404, req, res, error)
      } else {
        if (user?.verified) {
          res.redirect(
            `${frontendURL}/verification?successfullyVerified=Y&alreadyVerified=Y`
          )
        } else {
          await Users.update({ verified: true }, { where: { id } })

          res.redirect(
            `${frontendURL}/verification?successfullyVerified=Y&alreadyVerified=N`
          )
        }
      }
    } catch (error) {
      console.error('error: ', error)
      error.message = 'Something went wrong while verifying. Please try again'
      errorHandler(500, req, res, error)
    }
  }
})

module.exports = { router, initializeAdminUser }
