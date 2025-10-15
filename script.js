const videoInput = document.getElementById('videoInput');
const convertButton = document.getElementById('convertButton');
const statusDiv = document.getElementById('status');
const downloadLinkDiv = document.getElementById('downloadLink');
const downloadAnchor = document.getElementById('downloadAnchor');

videoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        convertButton.disabled = false; // Aktifkan tombol setelah file dipilih
        statusDiv.textContent = 'File siap untuk dikonversi!';
    }
});

convertButton.addEventListener('click', async () => {
    const file = videoInput.files[0];
    if (!file) {
        statusDiv.textContent = 'Pilih file video terlebih dahulu!';
        return;
    }

    statusDiv.textContent = 'Memproses... Ini mungkin memakan waktu beberapa detik.';
    convertButton.disabled = true;

    try {
        // Pastikan kamu memanggil ffmpeg dari library yang benar
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({
            log: true,
            corePath: 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/ffmpeg-core.js'
        });

        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

        // Ekstrak audio
        await ffmpeg.run('-i', 'input.mp4', '-q:a', '0', '-map', 'a', 'output.mp3');
        const data = ffmpeg.FS('readFile', 'output.mp3');

        const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        downloadAnchor.href = url;
        downloadLinkDiv.style.display = 'block';

        statusDiv.textContent = '✅ Konversi selesai! Klik tombol di bawah untuk unduh MP3.';
    } catch (error) {
        statusDiv.textContent = '❌ Terjadi kesalahan: ' + error.message;
        console.error(error);
    } finally {
        convertButton.disabled = false;
    }
});
