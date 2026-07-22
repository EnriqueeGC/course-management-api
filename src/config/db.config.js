const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'my_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    // host: process.env.DB_HOST || 'db', // 'db' es el nombre del servicio en docker-compose.yml
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, // Puerto interno de Docker
    logging: false, // Cambia a console.log para ver el SQL generado
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
); 

module.exports = sequelize;

