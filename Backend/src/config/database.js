const { Sequelize } = require('sequelize');

const url = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_PRIVATE_URL || process.env.DATABASE_URL;

const sequelize = url
  ? new Sequelize(url, { dialect: 'mysql', logging: false })
  : new Sequelize(
      process.env.DB_NAME  || process.env.MYSQLDATABASE,
      process.env.DB_USER  || process.env.MYSQLUSER,
      process.env.DB_PASS  || process.env.MYSQLPASSWORD,
      {
        host:    process.env.DB_HOST || process.env.MYSQLHOST,
        port:    Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
        dialect: 'mysql',
        logging: false,
      }
    );

module.exports = sequelize;
