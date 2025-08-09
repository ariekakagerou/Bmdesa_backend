// middleware/debugMiddleware.js
export const debugShipmentRoutes = (req, res, next) => {
    console.log(`🚀 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('📝 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Params:', JSON.stringify(req.params, null, 2));
    console.log('❓ Query:', JSON.stringify(req.query, null, 2));
    console.log('-------------------------------------------');
    next();
};

// Tambahkan ini ke dalam app.js setelah import express
// app.use('/api/shipments', debugShipmentRoutes);