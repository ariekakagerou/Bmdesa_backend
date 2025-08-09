import Return from '../models/Return.js';

class ReturnController {
  static async createReturn(req, res) {
    try {
      const { transaction_id, user_id, reason, status } = req.body;
      const errors = Return.validate(req.body);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      const returnId = await Return.create({ transaction_id, user_id, reason, status });
      res.status(201).json({
        success: true,
        message: 'Return request created successfully',
        data: { return_id: returnId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating return',
        error: error.message
      });
    }
  }

  static async getAllReturns(req, res) {
    try {
      const rows = await Return.findAll();
      res.status(200).json({
        success: true,
        message: 'Returns retrieved successfully',
        data: rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving returns',
        error: error.message
      });
    }
  }

  static async getReturnById(req, res) {
    try {
      const { id } = req.params;
      const ret = await Return.findById(id);
      if (!ret) {
        return res.status(404).json({
          success: false,
          message: 'Return not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Return retrieved successfully',
        data: ret
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving return',
        error: error.message
      });
    }
  }

  static async getReturnsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const rows = await Return.findByUserId(userId);
      res.status(200).json({
        success: true,
        message: 'User returns retrieved successfully',
        data: rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving user returns',
        error: error.message
      });
    }
  }

  static async updateReturnStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const updated = await Return.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Return not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Return status updated successfully',
        data: { return_id: id, status }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating return status',
        error: error.message
      });
    }
  }

  static async deleteReturn(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Return.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Return not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Return deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting return',
        error: error.message
      });
    }
  }
}

export default ReturnController;
