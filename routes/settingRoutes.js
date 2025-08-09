// routes/settingRoutes.js
import express from 'express';
import SettingController from '../controller/SettingController.js';

const router = express.Router();

// Get all settings
router.get('/', SettingController.getAllSettings);

// Get setting by ID
router.get('/:id', SettingController.getSettingById);

// Get setting by key
router.get('/key/:key', SettingController.getSettingByKey);

// Create new setting
router.post('/', SettingController.createSetting);

// Update setting by ID
router.put('/:id', SettingController.updateSetting);

// Update setting by key
router.put('/key/:key', SettingController.updateSettingByKey);

// Delete setting by ID
router.delete('/:id', SettingController.deleteSetting);

// Delete setting by key
router.delete('/key/:key', SettingController.deleteSettingByKey);

// ✅ Export sebagai default agar bisa di-import dengan `import settingRoutes from ...`
export default router;
