// test-sqlite.js
const Database = require('better-sqlite3');

// Buat database di memori (otomatis hilang setelah program selesai)
const db = new Database(':memory:');

// Coba bikin tabel
db.exec(`
  CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`);

// Insert satu data
const insert = db.prepare("INSERT INTO movies (title) VALUES (?)");
insert.run('Inception');

// Ambil data
const select = db.prepare("SELECT * FROM movies");
const allMovies = select.all();

console.log("✅ Database SQLite berhasil!");
console.log("Data di tabel:", allMovies);

// Tutup koneksi
db.close();