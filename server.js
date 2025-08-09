// server.js
import app from './app.js';

// Mengambil port dari environment variable, default ke 3000
const port = process.env.PORT || 3000;

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
    console.log(`Buka di browser: http://localhost:${port}`);
});