const express = require('express')
const checkAndCreateDatabase = require('./database')
const db = require('./models')
const cors = require('cors')
require('dotenv').config()
const { initializeAdminUser } = require('./routes/open')

const app = express()
const port = 5000

const corsOptions = {
  origin: 'https://assigment-login-template.vercel.app', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}

app.use(express.json())
app.use(cors(corsOptions))

app.use('/api', require('./routes/open')?.router)
app.use('/api', require('./routes/protected'))

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
