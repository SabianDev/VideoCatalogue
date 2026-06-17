const Database = require('better-sqlite3');
// HAPUS file videos.db yang lama sebelum menjalankan kode ini!
const db = new Database('videos.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT CHECK(type IN ('movie', 'series')) NOT NULL,
        genre TEXT,
        duration INTEGER,
        file_path TEXT NOT NULL UNIQUE,
        poster_path TEXT,
        bg_path TEXT,
        year INTEGER,
        country TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);
module.exports = db;