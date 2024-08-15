const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const { Users } = require('../models')
const errorHandler = require('../utils/error')
const { authenticateJWT } = require('../utils/jwt')

router.use(authenticateJWT)

//ROUTE: Register new user using GET "/api/toggleActivation/:id"
router.get('/toggleActivation', async (req, res) => {
  const { id } = req.query

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
      errorHandler(500, req, res, error)
    }
  }
})

//ROUTE: Get details depending upon user type using GET "/api/getDetails"
router.get('/getDetails', async (req, res) => {
  const { isAdmin, username } = req.tokenUser

  if (!username) {
    const error = new Error('Invalid request')
    console.log(error.message)
    errorHandler(400, req, res, err)
  } else {
    try {
      if (isAdmin) {
        const allUsers = await Users.findAll({
          attributes: {
            exclude: [
              'password',
              'mobileNumber',
              'language',
              'isAdmin',
              'updatedAt',
            ],
          },
          where: {
            isAdmin: false,
          },
        })

        res.status(200).json({ allUsers })
      } else {
        const user = await Users.findOne({
          where: { username },
          attributes: {
            exclude: [
              'password',
              'mobileNumber',
              'language',
              'isAdmin',
              'updatedAt',
            ],
          },
        })
        res.status(200).json(user)
      }
    } catch (error) {
      console.error('error: ', error)
      errorHandler(500, req, res, error)
    }
  }
})

module.exports = router
