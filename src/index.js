const express = require('express');
const path = require('path');

const setupDb = require('./utils/setupDb');

const { config, app, db } = require('./globals');

setupDb();

app.use('/api/v1', require('./api/v1'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.port, config.hostname, () => console.log(`Listening at ${config.hostname || ''}:${config.port}`));