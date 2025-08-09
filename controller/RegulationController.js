import Regulation from '../models/Regulation.js';

class RegulationController {
  // ✅ GET ALL with filter, search, pagination
  static async getAllRegulations(req, res) {
    try {
      const { page = 1, limit = 10, regulation_type, status, search } = req.query;
      const offset = (page - 1) * limit;

      const { rows, count } = await Regulation.findAll({
        limit,
        offset,
        whereClause: { regulation_type, status },
        search
      });

      res.status(200).json({
        success: true,
        message: 'Regulations retrieved successfully',
        data: {
          regulations: rows,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: Number(limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving regulations',
        error: error.message
      });
    }
  }

  // ✅ GET by ID
  static async getRegulationById(req, res) {
    try {
      const { id } = req.params;
      const regulation = await Regulation.findById(id);

      if (!regulation) {
        return res.status(404).json({
          success: false,
          message: 'Regulation not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Regulation retrieved successfully',
        data: regulation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving regulation',
        error: error.message
      });
    }
  }

  // ✅ GET by TYPE (INI YANG WAJIB ADA)
  static async getRegulationsByType(req, res) {
    try {
      const { type } = req.params;
      const { page = 1, limit = 10, search, status } = req.query;
      const offset = (page - 1) * limit;

      const { rows, count } = await Regulation.findAll({
        limit,
        offset,
        whereClause: { regulation_type: type, status },
        search
      });

      res.status(200).json({
        success: true,
        message: `${type} regulations retrieved successfully`,
        data: {
          regulations: rows,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: Number(limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving regulations by type',
        error: error.message
      });
    }
  }

  // ✅ CREATE
  static async createRegulation(req, res) {
    try {
      const { regulation_type, regulation_number, title, date, status = 'diproses', file_url } = req.body;

      if (!regulation_type || !regulation_number || !title || !date) {
        return res.status(400).json({
          success: false,
          message: 'Required fields missing'
        });
      }

      const exists = await Regulation.findByNumber(regulation_number);
      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'Regulation number already exists'
        });
      }

      const newId = await Regulation.create({
        regulation_type,
        regulation_number,
        title,
        date,
        status,
        file_url
      });

      res.status(201).json({
        success: true,
        message: 'Regulation created successfully',
        data: { id: newId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating regulation',
        error: error.message
      });
    }
  }

  // ✅ UPDATE
  static async updateRegulation(req, res) {
    try {
      const { id } = req.params;
      const regulation = await Regulation.findById(id);

      if (!regulation) {
        return res.status(404).json({
          success: false,
          message: 'Regulation not found'
        });
      }

      if (req.body.regulation_number && req.body.regulation_number !== regulation.regulation_number) {
        const exists = await Regulation.findByNumber(req.body.regulation_number);
        if (exists && exists.id !== Number(id)) {
          return res.status(409).json({
            success: false,
            message: 'Regulation number already exists'
          });
        }
      }

      await Regulation.update(id, req.body);
      const updated = await Regulation.findById(id);

      res.status(200).json({
        success: true,
        message: 'Regulation updated successfully',
        data: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating regulation',
        error: error.message
      });
    }
  }

  // ✅ UPDATE STATUS
  static async updateRegulationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['berlaku', 'diproses'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be "berlaku" or "diproses"'
        });
      }

      const regulation = await Regulation.findById(id);
      if (!regulation) {
        return res.status(404).json({
          success: false,
          message: 'Regulation not found'
        });
      }

      await Regulation.update(id, { status });
      const updated = await Regulation.findById(id);

      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        data: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating status',
        error: error.message
      });
    }
  }

  // ✅ DELETE
  static async deleteRegulation(req, res) {
    try {
      const { id } = req.params;
      const success = await Regulation.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Regulation not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Regulation deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting regulation',
        error: error.message
      });
    }
  }
}

export default RegulationController;
