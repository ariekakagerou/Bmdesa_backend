import express from 'express';
import RegulationController from '../controller/RegulationController.js';

const router = express.Router();

// ✅ Middleware validasi regulation
const validateRegulation = (req, res, next) => {
  const { regulation_type, regulation_number, title, date, status } = req.body;

  if (req.method === 'POST') {
    if (!regulation_type || !regulation_number || !title || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: regulation_type, regulation_number, title, date',
      });
    }
  }

  if (
    regulation_type &&
    !['Peraturan Desa', 'Peraturan Bupati', 'Peraturan Daerah'].includes(regulation_type)
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid regulation_type. Must be one of: Peraturan Desa, Peraturan Bupati, Peraturan Daerah',
    });
  }

  if (status && !['berlaku', 'diproses'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be either "berlaku" or "diproses"',
    });
  }

  next();
};

// ✅ Order route: spesifik dulu baru umum
router.get('/type/:type', RegulationController.getRegulationsByType);
router.get('/:id', RegulationController.getRegulationById);
router.get('/', RegulationController.getAllRegulations);

router.post('/', validateRegulation, RegulationController.createRegulation);
router.put('/:id', validateRegulation, RegulationController.updateRegulation);
router.patch('/:id/status', RegulationController.updateRegulationStatus);
router.delete('/:id', RegulationController.deleteRegulation);

export default router;
