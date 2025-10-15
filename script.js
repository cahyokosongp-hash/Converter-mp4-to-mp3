const videoInput = document.getElementById('videoInput');
const convertButton = document.getElementById('convertButton');
const statusDiv = document.getElementById('status');
const downloadLinkDiv = document.getElementById('downloadLink');
const downloadAnchor = document.getElementById('downloadAnchor');

videoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        convertButton.disabled = false;  // Aktifkan tombol setelah file dipilih
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
    convertButton.disabled = true;  // Nonaktifkan tombol saat proses

    try {
        const { createFFmpeg, fetchFile } = FFmpeg;  // From ffmpegwasm
        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

        // Jalankan perintah FFmpeg untuk ekstrak audio
        await ffmpeg.run('-i', 'input.mp4', '-q:a', '0', '-map', 'a', 'output.mp3');
        const data = ffmpeg.FS('readFile', 'output.mp3');

        // Buat blob untuk download
        const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        downloadAnchor.href = url;
        downloadLinkDiv.style.display = 'block';  // Tampilkan link download

        statusDiv.textContent = 'Konversi selesai! Klik tombol untuk unduh.';
    } catch (error) {
        statusDiv.textContent = 'Error: ' + error.message;
    } finally {
        convertButton.disabled = false;  // Aktifkan kembali tombol
    }
});
