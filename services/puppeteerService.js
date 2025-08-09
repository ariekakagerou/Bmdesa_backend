import puppeteer from 'puppeteer'; // Menggunakan puppeteer lengkap dengan Chromium

// Fungsi untuk meluncurkan browser dan melakukan tugas tertentu
const launchBrowser = async() => {
    try {
        const browser = await puppeteer.launch();
        console.log("Browser berhasil diluncurkan");

        // Tambahkan pekerjaan lain yang ingin dilakukan dengan Puppeteer
        const page = await browser.newPage();
        try {
            await page.goto('https://example.com');
        } catch (err) {
            console.error("Gagal membuka halaman:", err);
            await browser.close(); // Pastikan browser ditutup jika terjadi kesalahan
            throw err; // Lempar ulang kesalahan setelah menutup browser
        }

        // Tunggu elemen yang diperlukan muncul
        try {
            await page.waitForSelector('selector_untuk_WidFactory', { timeout: 5000 });
        } catch (err) {
            console.error("Elemen WidFactory tidak ditemukan:", err);
            await browser.close();
            throw err;
        }

        const title = await page.title();
        console.log('Title halaman:', title);

        await browser.close(); // Jangan lupa menutup browser setelah selesai
    } catch (err) {
        console.error("Gagal meluncurkan browser:", err);
    }
};

export default launchBrowser;