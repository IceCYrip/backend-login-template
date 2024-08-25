const express = require('express')
const checkAndCreateDatabase = require('./database')
const db = require('./models')
const cors = require('cors')
require('dotenv').config()
const { initializeAdminUser } = require('./routes/open')

const app = express()
// const port = 5000
const port = 443

// Apply CORS middleware
app.use(cors())

app.use(express.json())

app.use('/api', require('./routes/open')?.router)
app.use('/api', require('./routes/protected'))

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
