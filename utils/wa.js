import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

dotenv.config();

const { Client, LocalAuth } = pkg;

let client = null;
let isReady = false;
let isInitializing = false;

const initializeWhatsApp = () => {
    if (client) return client;
    if (isInitializing) return client;

    isInitializing = true;

    try {
        client = new Client({
            authStrategy: new LocalAuth({ clientId: "bumdes-wa-session" }),
            puppeteer: {
                headless: false, // Ubah ke false untuk debugging
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection'
                ],
                timeout: 60000,
                protocolTimeout: 60000
            }
        });

        client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
            console.log('📱 Silakan scan QR code untuk login ke WhatsApp!');
        });

        client.on('ready', () => {
            console.log('✅ WhatsApp client siap digunakan!');
            isReady = true;
            isInitializing = false;
        });

        client.on('auth_failure', msg => {
            console.error('❌ Gagal autentikasi WhatsApp:', msg);
            isReady = false;
            isInitializing = false;
        });

        client.on('disconnected', reason => {
            console.warn('⚠️ WhatsApp client terputus:', reason);
            isReady = false;
            isInitializing = false;

            // Coba reconnect setelah 5 detik
            setTimeout(() => {
                if (!isInitializing) {
                    console.log('🔄 Mencoba reconnect WhatsApp...');
                    initializeWhatsApp();
                }
            }, 5000);
        });

        client.on('loading_screen', (percent, message) => {
            console.log(`📱 Loading WhatsApp: ${percent}% - ${message}`);
        });

        // Handle Puppeteer errors
        client.on('puppeteer_error', (error) => {
            console.error('❌ Puppeteer error:', error);
            isInitializing = false;
        });

        client.initialize().catch(error => {
            console.error('❌ Error initializing WhatsApp client:', error);
            isInitializing = false;
        });

        return client;
    } catch (error) {
        console.error('❌ Error creating WhatsApp client:', error);
        isInitializing = false;
        throw error;
    }
};

const sendMessage = async(phone, message) => {
    try {
        // Pastikan client sudah siap
        if (!client) {
            console.log('🔄 Initializing WhatsApp client...');
            initializeWhatsApp();
        }

        // Tunggu sampai client siap
        let attempts = 0;
        const maxAttempts = 30; // 30 detik timeout

        while (!isReady && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            console.log(`⏳ Menunggu WhatsApp client siap... (${attempts}/${maxAttempts})`);
        }

        if (!isReady) {
            throw new Error('WhatsApp client tidak siap setelah 30 detik');
        }

        // Format nomor telepon untuk WhatsApp
        let cleanPhone = phone.replace(/[^0-9]/g, '');

        // Hapus awalan 0 dan ganti dengan 62
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.substring(1);
        }

        // Pastikan format 62xxxxxxxxxx
        if (!cleanPhone.startsWith('62')) {
            cleanPhone = '62' + cleanPhone;
        }

        // Validasi panjang nomor (minimal 10, maksimal 15 digit)
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            throw new Error('Nomor telepon tidak valid');
        }

        console.log(`📱 Mencoba kirim ke: ${cleanPhone}`);

        // Format chatId untuk WhatsApp
        const chatId = `${cleanPhone}@c.us`;

        // Cek apakah user terdaftar dengan timeout
        try {
            const isRegistered = await Promise.race([
                client.isRegisteredUser(chatId),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout checking user')), 10000)
                )
            ]);

            if (!isRegistered) {
                throw new Error('Nomor tidak terdaftar di WhatsApp');
            }
        } catch (checkError) {
            console.warn('⚠️ Tidak bisa mengecek status user, lanjutkan pengiriman...');
        }

        const text = typeof message === 'string' ? message : message.text;

        // Kirim pesan dengan timeout
        await Promise.race([
            client.sendMessage(chatId, text),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout sending message')), 3000)
            )
        ]);

        console.log(`✅ Pesan terkirim ke ${cleanPhone}`);
        return true;
    } catch (error) {
        console.error('❌ Error mengirim pesan WhatsApp:', error.message);

        // Jika error terkait connection, coba reconnect
        if (error.message.includes('Protocol error') || error.message.includes('Execution context was destroyed')) {
            console.log('🔄 Mencoba reconnect WhatsApp...');
            client = null;
            isReady = false;
            isInitializing = false;
            initializeWhatsApp();
        }

        throw new Error('Gagal mengirim pesan WhatsApp: ' + error.message);
    }
};

// Initialize WhatsApp saat module dimuat
setTimeout(() => {
    initializeWhatsApp();
}, 2000); // Delay 2 detik untuk memastikan semua module sudah dimuat

export { sendMessage, isReady };