const express = require('express')
const checkAndCreateDatabase = require('./database')
const db = require('./models')
const cors = require('cors')
require('dotenv').config()
const { initializeAdminUser } = require('./routes/open')

const app = express()
const port = 5000

require('dotenv').config()

app.use(express.json())
app.use(cors())

require('dotenv').config()

// Available Routes

app.get('/', (req, res) => {
  res.send('Hello World!')
})

checkAndCreateDatabase().then(() => {
  db.sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
      return db.sequelize
        .sync
        // { alter: true }
        ()
    })
    .then(() => {
      initializeAdminUser().then(() =>
        app.listen(port, () => {
          console.log(`Backend application listening on port: ${port}`)
        })
      )
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
})
