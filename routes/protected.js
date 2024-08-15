const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const { Users } = require('../models')
const errorHandler = require('../utils/error')
const { authenticateJWT } = require('../utils/jwt')

router.use(authenticateJWT)

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
