const express = require('express')
const checkAndCreateDatabase = require('./database')
const db = require('./models')
const cors = require('cors')
require('dotenv').config()
const { initializeAdminUser } = require('./routes/open')

const app = express()
const port = 5000

// Enable CORS after JSON parsing
app.use(express.json())
// app.use(cors({ origin: 'https://assigment-login-template.vercel.app' })) // Update with your frontend origin
app.use(cors({ origin: '*' })) // Update with your frontend origin

app.options('*', cors()) // Handle preflight requests

app.get('/test', (req, res) => {
  res.send('CORS is configured properly')
})
// app.use('/api', require('./routes/open')?.router)
app.use('/', require('./routes/open')?.router)
app.use('/', require('./routes/protected'))

app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working!' })
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
