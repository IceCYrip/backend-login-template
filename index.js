const express = require('express')
const checkAndCreateDatabase = require('./database')
const db = require('./models')
const cors = require('cors')
const { initializeAdminUser } = require('./routes/open')

const dbConfig = require('./models').dbConfig

const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

// Available Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/', require('./routes/open')?.router)
app.use('/', require('./routes/protected'))

checkAndCreateDatabase().then(() => {
  db.sequelize
    .authenticate()
    .then(() => {
      console.log(
        `Connection has been established with ${dbConfig?.env} environment successfully.`
      )
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
