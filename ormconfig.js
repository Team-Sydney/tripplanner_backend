module.exports = {
  "name": "default",
  "type": "cockroachdb",
  "host": process.env.DB_HOST,
  "port": 26257,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "ssl": {

  },
  "synchronize": true,
  "logging": true,
  "entities": ["src/entity/*.*"]
}