require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
require('./jobs/reminderJob');

const PORT = process.env.PORT || 3000;

console.log('DB config:', {
  url:  process.env.MYSQL_URL      ? 'SET' : 'NOT SET',
  host: process.env.MYSQLHOST      || process.env.DB_HOST      || 'NOT SET',
  user: process.env.MYSQLUSER      || process.env.DB_USER      || 'NOT SET',
  name: process.env.MYSQLDATABASE  || process.env.DB_NAME      || 'NOT SET',
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });
