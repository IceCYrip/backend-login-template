require('dotenv').config()

module.exports = {
  development: {
    URI: process.env.DB_URI,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
      connectTimeout: 10000, // increase timeout to 10 seconds (10000
    },
    // logging: false, // Optional: Disable logging
  },

  production: {
    URI: process.env.DB_URI,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
      connectTimeout: 10000, // increase timeout to 10 seconds (10000
    },
    // logging: false, // Optional: Disable logging
  },
}
