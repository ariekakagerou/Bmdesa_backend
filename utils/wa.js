import dotenv from 'dotenv';
dotenv.config();

// ===================================================
// WhatsApp Service
// Mode: DISABLED (untuk deployment cloud)
// Aktifkan dengan set env WA_ENABLED=true
// ===================================================

const WA_ENABLED = process.env.WA_ENABLED === 'true';

let client = null;
let isReady = false;
let isInitializing = false;

const initializeWhatsApp = async () => {
    if (!WA_ENABLED) {
        console.log('⚠️ WhatsApp dinonaktifkan (WA_ENABLED != true). Set WA_ENABLED=true untuk mengaktifkan.');
        return null;
    }

    if (client) return client;
    if (isInitializing) return client;

    isInitializing = true;

    try {
        // Dynamic import agar tidak crash jika module tidak tersedia
        const pkg = await import('whatsapp-web.js');
        const qrcode = await import('qrcode-terminal');
        const { Client, LocalAuth } = pkg.default;

        client = new Client({
            authStrategy: new LocalAuth({ clientId: "bumdes-wa-session" }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                ],
                timeout: 60000,
            }
        });

        client.on('qr', (qr) => {
            qrcode.default.generate(qr, { small: true });
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
            setTimeout(() => {
                if (!isInitializing) {
                    console.log('🔄 Mencoba reconnect WhatsApp...');
                    initializeWhatsApp();
                }
            }, 5000);
        });

        client.initialize().catch(error => {
            console.error('❌ Error initializing WhatsApp client:', error);
            isInitializing = false;
        });

        return client;
    } catch (error) {
        console.error('❌ Error creating WhatsApp client:', error);
        isInitializing = false;
        return null;
    }
};

const sendMessage = async (phone, message) => {
    if (!WA_ENABLED) {
        console.warn('⚠️ WhatsApp dinonaktifkan. Pesan tidak dikirim.');
        return false;
    }

    try {
        if (!client) {
            console.log('🔄 Initializing WhatsApp client...');
            await initializeWhatsApp();
        }

        let attempts = 0;
        const maxAttempts = 30;

        while (!isReady && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }

        if (!isReady) {
            throw new Error('WhatsApp client tidak siap setelah 30 detik');
        }

        let cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);
        if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            throw new Error('Nomor telepon tidak valid');
        }

        const chatId = `${cleanPhone}@c.us`;
        const text = typeof message === 'string' ? message : message.text;

        await Promise.race([
            client.sendMessage(chatId, text),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout sending message')), 30000))
        ]);

        console.log(`✅ Pesan terkirim ke ${cleanPhone}`);
        return true;
    } catch (error) {
        console.error('❌ Error mengirim pesan WhatsApp:', error.message);
        throw new Error('Gagal mengirim pesan WhatsApp: ' + error.message);
    }
};

// Hanya initialize jika WA_ENABLED
if (WA_ENABLED) {
    setTimeout(() => { initializeWhatsApp(); }, 2000);
}

export { sendMessage, isReady, initializeWhatsApp };
