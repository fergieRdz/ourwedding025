require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
require('./jobs/reminderJob');

const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });
