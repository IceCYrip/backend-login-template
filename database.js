const mysql = require('mysql2/promise')

const dbConfig = require('./models').dbConfig

async function checkAndCreateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.username,
      password: dbConfig.password,
      port: dbConfig.port,
    })

    const [rows] = await connection.query(
      `SHOW DATABASES LIKE '${dbConfig.database}';`
    )

    if (rows.length === 0) {
      await connection
        .query(`CREATE DATABASE \`${dbConfig.database}\`;`)
        .then(() => {
          console.log(`Database "${dbConfig.database}" created successfully.`)
        })
    } else {
      console.log(`Database "${dbConfig.database}" already exists.`)
    }

    await connection.end()
  } catch (error) {
    console.error('Error checking or creating the database:', error)
  }
}

module.exports = checkAndCreateDatabase
