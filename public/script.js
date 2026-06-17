async function loadVideos() {
    const container = document.getElementById('video-list');
    container.innerHTML = '<p>Loading...</p>';
    
    try {
        const response = await fetch('/api/videos');
        if (!response.ok) throw new Error('Gagal mengambil data');
        
        const videos = await response.json();
        
        if (videos.length === 0) {
            container.innerHTML = '<p class="error">Belum ada video. Tambahkan lewat POST /api/videos</p>';
            return;
        }
        
        container.innerHTML = '';
        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            
            // Format durasi (detik -> jam:menit)
            const durationFormatted = formatDuration(video.duration);
            
            card.innerHTML = `
                <div class="card-content">
                    <div class="video-type">${video.type === 'movie' ? '🎬 Film' : '📺 Series'}</div>
                    <div class="video-title">${escapeHtml(video.title)}</div>
                    <div class="video-genre">${video.genre || 'Tanpa genre'}</div>
                    <div class="video-duration">${durationFormatted}</div>
                    <button class="play-btn" data-id="${video.id}">▶ Putar</button>
                </div>
            `;
            
            // Tambah event listener ke tombol play
            const btn = card.querySelector('.play-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                playVideo(video.id);
            });
            
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="error">Gagal memuat video. Pastikan server berjalan.</p>';
    }
}

function formatDuration(seconds) {
    if (!seconds) return 'Durasi tidak diketahui';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours} jam ${minutes} menit`;
    }
    return `${minutes} menit`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function playVideo(id) {
    try {
        const response = await fetch(`/api/play/${id}`, { method: 'POST' });
        const data = await response.json();
        if (response.ok) {
            alert(data.message || 'Memutar video...');
        } else {
            alert('Error: ' + (data.error || 'Gagal memutar video'));
        }
    } catch (err) {
        alert('Gagal menghubungi server');
    }
}

// Jalankan saat halaman siap
loadVideos();