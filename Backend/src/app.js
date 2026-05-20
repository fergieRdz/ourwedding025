const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/guests',    require('./routes/guests'));
app.use('/api/tables',    require('./routes/tables'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/budget',    require('./routes/budget'));
app.use('/api/calendar',  require('./routes/calendar'));
app.use('/api/todos',     require('./routes/todos'));
app.use('/api/shopping',  require('./routes/shopping'));
app.use('/api/moodboard', require('./routes/moodboard'));
app.use('/api/honeymoon', require('./routes/honeymoon'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

module.exports = app;
