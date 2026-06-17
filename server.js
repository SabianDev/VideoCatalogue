const express = require('express');
const cors = require('cors');
const db = require('./database');  // menghubungkan database.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/thumbnails', express.static('thumbnails'));

// ENDPOINT PERTAMA: tes koneksi database
app.get('/api/test-db', (req, res) => {
    try {
        const result = db.prepare('SELECT COUNT(*) as total FROM videos').get();
        res.json({ status: 'Database terhubung', totalVideo: result.total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ENDPOINT KEDUA : menambah video baru
// app.post('/api/videos', (req, res) => {
//     const { title, type, genre, duration, file_path, poster_path, year, country, description, bg_path } = req.body;

//     // Validasi sederhana
//     if (!title || !type || !file_path) {
//         return res.status(400).json({ error: 'title, type, dan file_path wajib diisi' });
//     }

//     if (type !== 'movie' && type !== 'series') {
//         return res.status(400).json({ error: 'type harus "movie" atau "series"' });
//     }

//     try {
//         const stmt = db.prepare(`
//         INSERT INTO videos (title, type, genre, duration, file_path, poster_path, year, country, description, bg_path)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `);

//         const info = stmt.run(title, type, genre, duration || null, file_path, poster_path || null, year || null, country || null, description || null);

//         res.status(201).json({ id: info.lastInsertRowid, message: 'Video berhasil ditambahkan' });

//     } catch (err) {
//         if (err.message.includes('UNIQUE constraint failed')) {
//             res.status(409).json({ error: 'File path sudah ada' });
//         } else {
//             res.status(500).json({ error: err.message });
//         }
//     }
// });
app.post('/api/videos', (req, res) => {
    const { title, type, genre, duration, file_path, poster_path, year, country, description, bg_path } = req.body;

    // Validasi
    if (!title || !type || !file_path) {
        return res.status(400).json({ error: 'title, type, dan file_path wajib diisi' });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO videos (
                title, type, genre, duration, file_path, 
                poster_path, year, country, description, bg_path
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(
            title, 
            type, 
            genre || null, 
            duration || null, 
            file_path, 
            poster_path || null, 
            year || null, 
            country || null, 
            description || null, 
            bg_path || null
        );
        res.status(201).json({ id: info.lastInsertRowid, message: 'Video berhasil ditambahkan' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'File path sudah ada' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Endpoint untuk mengambil semua video
app.get('/api/videos', (req, res) => {
    try {
        const videos = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint open with VLC
const { exec } = require('child_process');
app.post('/api/play/:id', (req, res) => {
    const id = req.params.id;
    try {
        const stmt = db.prepare('SELECT file_path FROM videos WHERE id = ?');
        const video = stmt.get(id);
        if (!video) {
            return res.status(404).json({ error: 'Video tidak ditemukan' });
        }
        const filePath = video.file_path;
        const command = `start vlc "${filePath}"`;

        // Jalankan perintah, tapi jangan tunggu selesai
        const child = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Gagal buka VLC: ${error.message}`);
            }
        });
        child.unref(); // lepaskan agar tidak menghalangi response

        // Langsung kirim response
        res.json({ message: `Memutar: ${filePath}` });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Konfigurasi multer
const storage = multer.diskStorage({
    // Tentukan folder tujuan
    destination: (req, file, cb) => {
        cb(null, 'thumbnails/');
    },
    // Tentukan nama file
    filename: (req, file, cb) => {
        // Format nama: videoId_timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.id}-${uniqueSuffix}${ext}`);
    }
});

// Filter agar hanya menerima file gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Endpoint untuk upload poster (ganti :id dengan ID video yang sesuai)
app.post('/api/videos/:id/upload-poster', upload.single('poster'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Gagal mengupload file.' });
    }

    const videoId = req.params.id;
    const posterPath = req.file.filename;

    // Update database dengan nama file poster
    const stmt = db.prepare('UPDATE videos SET poster_path = ? WHERE id = ?');
    const result = stmt.run(posterPath, videoId);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Video tidak ditemukan' });
    }

    res.json({ message: 'Poster berhasil diupload!', posterPath: posterPath });
});

// Endpoint upload backdrop details
app.post('/api/videos/:id/upload-bg', upload.single('bg'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Gagal upload background' });
    }
    const videoId = req.params.id;
    const bgPath = req.file.filename;

    const stmt = db.prepare('UPDATE videos SET bg_path = ? WHERE id = ?');
    const result = stmt.run(bgPath, videoId);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Video tidak ditemukan' });
    }

    res.json({ message: 'Background berhasil diupload', bgPath });
});

//Endpoint GET Details
app.get('/api/videos/:id', (req, res) => {
    const { id } = req.params;
    const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(id);
    if (!video) return res.status(404).json({ error: 'Video tidak ditemukan' });
    res.json(video);
});

//Endpoint UPDATE Details
app.put('/api/videos/:id', (req, res) => {
    const { id } = req.params;
    const { title, type, genre, duration, file_path, poster_path, year, country, description, bg_path } = req.body;

    if (!title || !type || !file_path) {
        return res.status(400).json({ error: 'title, type, dan file_path wajib diisi' });
    }

    try {
        const stmt = db.prepare(`
            UPDATE videos SET 
                title = ?, 
                type = ?, 
                genre = ?, 
                duration = ?, 
                file_path = ?, 
                poster_path = ?, 
                year = ?, 
                country = ?, 
                description = ?, 
                bg_path = ?
            WHERE id = ?
        `);
        const result = stmt.run(
            title, 
            type, 
            genre || null, 
            duration || null, 
            file_path, 
            poster_path || null, 
            year || null, 
            country || null, 
            description || null, 
            bg_path || null, 
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Video tidak ditemukan' });
        }

        res.json({ message: 'Video berhasil diupdate' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'File path sudah digunakan oleh video lain' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Endpoint Delete video (juga hapus file poster dan background jika ada)
app.delete('/api/videos/:id', (req, res) => {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');

    try {
        // Ambil data video untuk tahu file apa yang harus dihapus
        const video = db.prepare('SELECT poster_path, bg_path FROM videos WHERE id = ?').get(id);
        
        if (!video) {
            return res.status(404).json({ error: 'Video tidak ditemukan' });
        }

        // Hapus file poster jika ada
        if (video.poster_path) {
            const posterFile = path.join(__dirname, 'thumbnails', video.poster_path);
            if (fs.existsSync(posterFile)) {
                fs.unlinkSync(posterFile);
            }
        }

        // Hapus file background jika ada
        if (video.bg_path) {
            const bgFile = path.join(__dirname, 'thumbnails', video.bg_path);
            if (fs.existsSync(bgFile)) {
                fs.unlinkSync(bgFile);
            }
        }

        // Hapus record dari database
        const stmt = db.prepare('DELETE FROM videos WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Video tidak ditemukan' });
        }

        res.json({ message: 'Video berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint UPDATE video
app.put('/api/videos/:id', (req, res) => {
    const { id } = req.params;
    const { title, type, genre, duration, file_path, poster_path, year, country, description, bg_path } = req.body;

    // Validasi sederhana
    if (!title || !type || !file_path) {
        return res.status(400).json({ error: 'title, type, dan file_path wajib diisi' });
    }

    try {
        const stmt = db.prepare(`
            UPDATE videos SET 
                title = ?, 
                type = ?, 
                genre = ?, 
                duration = ?, 
                file_path = ?, 
                poster_path = ?, 
                year = ?, 
                country = ?, 
                description = ?, 
                bg_path = ?
            WHERE id = ?
        `);
        const result = stmt.run(
            title, type, genre, duration, 
            file_path, poster_path || null, 
            year || null, country || null, 
            description || null, bg_path || null, 
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Video tidak ditemukan' });
        }

        res.json({ message: 'Video berhasil diupdate' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            res.status(409).json({ error: 'File path sudah digunakan oleh video lain' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});