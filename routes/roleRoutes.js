// routes/roleRoutes.js
import express from 'express';
import RoleController from '../controller/RoleController.js';

const router = express.Router();

// Middleware untuk validasi input (opsional)
const validateRoleInput = (req, res, next) => {
  const { name } = req.body;
  
  if (req.method === 'POST' && !name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }
  
  if (name && typeof name !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Name must be a string'
    });
  }
  
  if (name && name.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Name must not exceed 50 characters'
    });
  }
  
  next();
};

// Routes untuk Role management
router.get('/', RoleController.getAllRoles);
router.get('/:id', RoleController.getRoleById);
router.get('/jenis/:jenis', RoleController.getRolesByJenis);
router.post('/', validateRoleInput, RoleController.createRole);
router.put('/:id', validateRoleInput, RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);

// ✅ Export sebagai default agar dapat di-import dengan ES Module
export default router;
