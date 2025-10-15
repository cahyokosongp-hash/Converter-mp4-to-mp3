// script.js

const videoInput = document.getElementById('videoInput');
const convertButton = document.getElementById('convertButton');
const statusElement = document.getElementById('status');
const downloadLink = document.getElementById('downloadLink');
const downloadAnchor = document.getElementById('downloadAnchor');

let file;

videoInput.addEventListener('change', (event) => {
    file = event.target.files[0];
    convertButton.disabled = !file;
});

convertButton.addEventListener('click', async () => {
    if (!file) return;

    statusElement.innerHTML = "⏳ Sedang memuat FFmpeg...";
    downloadLink.style.display = 'none';

    try {
        // ✅ Gunakan versi resmi FFmpeg WASM
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({ log: true });

        await ffmpeg.load();

        statusElement.innerHTML = "🎬 Mengonversi video ke MP3...";

        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        await ffmpeg.run('-i', file.name, 'output.mp3');
        const data = ffmpeg.FS('readFile', 'output.mp3');

        const blob = new Blob([data.buffer], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);

        downloadAnchor.href = url;
        downloadLink.style.display = 'block';
        statusElement.innerHTML = "✅ Konversi selesai!";

    } catch (err) {
        console.error(err);
        statusElement.innerHTML = "❌ Terjadi kesalahan: " + err.message;
    }
});
