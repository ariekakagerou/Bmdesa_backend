import Refund from '../models/Refund.js'; // Pakai import, bukan require

class RefundController {
  // Create a new refund request
  static async createRefund(req, res) {
    try {
      const { transaction_id, user_id, reason, amount, status } = req.body;

      const validationErrors = Refund.validateRefundData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      const refundData = {
        transaction_id,
        user_id,
        reason,
        amount: parseFloat(amount),
        status: status || 'requested'
      };

      const refundId = await Refund.create(refundData);

      res.status(201).json({
        success: true,
        message: 'Refund request created successfully',
        data: {
          refund_id: refundId,
          ...refundData
        }
      });
    } catch (error) {
      console.error('Error creating refund:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all refunds
  static async getAllRefunds(req, res) {
    try {
      const refunds = await Refund.findAll();
      res.status(200).json({
        success: true,
        message: 'Refunds retrieved successfully',
        data: refunds,
        count: refunds.length
      });
    } catch (error) {
      console.error('Error fetching refunds:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get refund by ID
  static async getRefundById(req, res) {
    try {
      const { id } = req.params;
      const refund = await Refund.findById(parseInt(id));
      if (!refund) {
        return res.status(404).json({
          success: false,
          message: 'Refund not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Refund retrieved successfully',
        data: refund
      });
    } catch (error) {
      console.error('Error fetching refund:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get refunds by user ID
  static async getRefundsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const refunds = await Refund.findByUserId(parseInt(userId));
      res.status(200).json({
        success: true,
        message: 'User refunds retrieved successfully',
        data: refunds,
        count: refunds.length
      });
    } catch (error) {
      console.error('Error fetching user refunds:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update refund status
  static async updateRefundStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['requested', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be requested, approved, or rejected'
        });
      }

      const updated = await Refund.updateStatus(parseInt(id), status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Refund not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Refund status updated successfully',
        data: {
          refund_id: parseInt(id),
          status: status
        }
      });
    } catch (error) {
      console.error('Error updating refund status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete refund
  static async deleteRefund(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Refund.deleteById(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Refund not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Refund deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting refund:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default RefundController;
