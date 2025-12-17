const express = require('express');
const sqlite3 = require('better-sqlite3');

const config = require('./config.json');

module.exports = {
    config,
    app: express(),
    db: sqlite3(config.dbPath),
};