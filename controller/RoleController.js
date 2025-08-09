import Role from '../models/Role.js';

class RoleController {
  static async getAllRoles(req, res) {
    try {
      const { page = 1, limit = 10, search = '', jenis = '' } = req.query;
      const offset = (page - 1) * limit;

      const { rows, count } = await Role.findAll({ limit, offset, search, jenis });

      res.status(200).json({
        success: true,
        message: 'Roles retrieved successfully',
        data: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving roles',
        error: error.message
      });
    }
  }

  static async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);

      if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Role retrieved successfully',
        data: role
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving role',
        error: error.message
      });
    }
  }

  static async createRole(req, res) {
    try {
      const { name, jenis, description } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }

      const exists = await Role.findOneByName(name);
      if (exists) {
        return res.status(409).json({ success: false, message: 'Role with this name already exists' });
      }

      const newId = await Role.create({ name, jenis, description });
      const newRole = await Role.findById(newId);

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: newRole
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating role',
        error: error.message
      });
    }
  }

  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, jenis, description } = req.body;

      const role = await Role.findById(id);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found' });
      }

      if (name && name !== role.name) {
        const exists = await Role.findOneByNameExcludingId(name, id);
        if (exists) {
          return res.status(409).json({ success: false, message: 'Role with this name already exists' });
        }
      }

      await Role.update(id, { name, jenis, description });
      const updated = await Role.findById(id);

      res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating role',
        error: error.message
      });
    }
  }

  static async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const success = await Role.delete(id);

      if (!success) {
        return res.status(404).json({ success: false, message: 'Role not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting role',
        error: error.message
      });
    }
  }

  static async getRolesByJenis(req, res) {
    try {
      const { jenis } = req.params;
      const roles = await Role.findByJenis(jenis);

      res.status(200).json({
        success: true,
        message: `Roles with jenis '${jenis}' retrieved successfully`,
        data: roles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving roles by jenis',
        error: error.message
      });
    }
  }
}

export default RoleController;
