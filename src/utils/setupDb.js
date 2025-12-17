const { db } = require('../globals');

function setupDb() {
    db.pragma('journal_mode = WAL');

    db.prepare('DROP TABLE IF EXISTS scans').run();
    db.prepare('DROP TABLE IF EXISTS ip_ranges').run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host TEXT,
            ip_address TEXT NOT NULL,
            port INTEGER NOT NULL,
            ip_range_id INTEGER,
            name TEXT,
            description TEXT,
            version_name TEXT,
            protocol_version INTEGER,
            favicon TEXT,
            max_players INTEGER,
            player_count INTEGER,
            players_online TEXT,
            has_whitelist INTEGER,
            whitelist_message TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS ip_ranges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            cidr TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
};

module.exports = setupDb;