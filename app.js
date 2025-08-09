import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

import './services/passport-setup.js';
dotenv.config();

// ===== ✅ Validasi ENV WAJIB =====
if (!process.env.KOMERCE_SHIPPING_COST_API_KEY) {
  console.error('❌ KOMERCE_SHIPPING_COST_API_KEY wajib diatur!');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error('❌ SESSION_SECRET wajib diatur!');
  process.exit(1);
}

console.log(
  '🔑 Komerce Shipping Cost API Key:',
  process.env.KOMERCE_SHIPPING_COST_API_KEY.substring(0, 8) + '...'
);

if (process.env.KOMERCE_SHIPPING_DELIVERY_API_KEY) {
  console.log(
    '🔑 Komerce Shipping Delivery API Key:',
    process.env.KOMERCE_SHIPPING_DELIVERY_API_KEY.substring(0, 8) + '...'
  );
}

// ===== ✅ Inisialisasi Aplikasi =====
const app = express();

// ===== ✅ Middleware Keamanan & Logging =====
app.use(helmet());
app.use(
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined')
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100
});
app.use(limiter);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://localhost:57976'
    
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000 // 2 jam
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ===== ✅ Import Controller Utama =====
import { getSummary } from './controller/summaryController.js';

// ===== ✅ Import Semua Routes =====
import waRoutes from './routes/waRoutes.js';
import authRoutes from './routes/authRoutes.js';
import businessUnitRoutes from './routes/businessUnitRoutes.js';
import productRoutes from './routes/productRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRequestRoutes from './routes/leaveRequestRoutes.js';
import worksLogRoutes from './routes/worksLogRoutes.js';
import publicComplaintRoutes from './routes/publicComplaintRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import autoReplyRoutes from './routes/autoReplyRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import userLogRoutes from './routes/userLogRoutes.js';
import shippingAddressRoutes from './routes/shippingAddressRoutes.js';
import trackingLogRoutes from './routes/trackingLogRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import adminRoutes from './routes/adminRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import courierRoutes from './routes/CourierRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import merchantProfileRoutes from './routes/merchantProfileRoutes.js';
import merchantRoutes from './routes/merchantRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import productReviewRoutes from './routes/productReviewRoutes.js';
import productTagMapRoutes from './routes/productTagMapRoutes.js';
import productTagRoutes from './routes/productTagRoutes.js';
import productVariantRoutes from './routes/productVariantRoutes.js';
import refundRoutes from './routes/refundRoutes.js';
import regulationRoutes from './routes/regulationRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import shippingRateRoutes from './routes/shippingRateRoutes.js';
import summaryRoute from './routes/summaryRoute.js';
import transactionItemRoutes from './routes/transactionItemRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import voucherRoutes from './routes/voucherRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

// ===== ✅ Pasang Semua Routing =====
app.get('/api/summary', getSummary);

app.use('/api/wa', waRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/business-units', businessUnitRoutes);
app.use('/api/products', productRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/works-log', worksLogRoutes);
app.use('/api/public-complaints', publicComplaintRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auto-replies', autoReplyRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api', apiRoutes);
app.use('/api/user-logs', userLogRoutes);
app.use('/api/shipping-addresses', shippingAddressRoutes);
app.use('/api/tracking-logs', trackingLogRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/admins', adminRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/merchant-profiles', merchantProfileRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/product-reviews', productReviewRoutes);
app.use('/api/product-tag-maps', productTagMapRoutes);
app.use('/api/product-tags', productTagRoutes);
app.use('/api/product-variants', productVariantRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/regulations', regulationRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/shipping-rates', shippingRateRoutes); // ✅ PENTING: JANGAN DIATUR SETELAH /:id ROUTE
app.use('/api/summary-route', summaryRoute);
app.use('/api/transaction-items', transactionItemRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/wishlists', wishlistRoutes);

// ===== ✅ Default Root =====
app.get('/', (req, res) => {
  res.json({ message: 'API BUMDes Semplak Barat is running.' });
});

// ===== ✅ 404 =====
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// ===== ✅ 500 =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan server',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
