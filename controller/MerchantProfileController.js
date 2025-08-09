// controller/MerchantProfileController.js
import MerchantProfile from '../models/MerchantProfile.js';

const merchantProfileController = {
  // Get all merchant profiles
  getAllMerchants: async (req, res) => {
    try {
      const merchants = await MerchantProfile.findAll();
      res.status(200).json({
        success: true,
        message: 'Merchants retrieved successfully',
        data: merchants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving merchants',
        error: error.message
      });
    }
  },

  // Get merchant profile by ID
  getMerchantById: async (req, res) => {
    try {
      const { id } = req.params;
      const merchant = await MerchantProfile.findById(id);
      if (!merchant) {
        return res.status(404).json({
          success: false,
          message: 'Merchant not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Merchant retrieved successfully',
        data: merchant
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving merchant',
        error: error.message
      });
    }
  },

  // Create new merchant profile
  createMerchant: async (req, res) => {
    try {
      const { user_id, store_name, logo_url, description, open_hour } = req.body;
      if (!user_id || !store_name) {
        return res.status(400).json({
          success: false,
          message: 'user_id and store_name are required'
        });
      }

      const merchantData = {
        user_id,
        store_name,
        logo_url: logo_url || null,
        description: description || null,
        open_hour: open_hour || null,
        created_at: new Date()
      };

      const newMerchant = await MerchantProfile.create(merchantData);

      res.status(201).json({
        success: true,
        message: 'Merchant profile created successfully',
        data: newMerchant
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating merchant profile',
        error: error.message
      });
    }
  },

  // Update merchant profile
  updateMerchant: async (req, res) => {
    try {
      const { id } = req.params;
      const { store_name, logo_url, description, open_hour } = req.body;

      const merchant = await MerchantProfile.findById(id);
      if (!merchant) {
        return res.status(404).json({
          success: false,
          message: 'Merchant not found'
        });
      }

      const updateData = {};
      if (store_name !== undefined) updateData.store_name = store_name;
      if (logo_url !== undefined) updateData.logo_url = logo_url;
      if (description !== undefined) updateData.description = description;
      if (open_hour !== undefined) updateData.open_hour = open_hour;

      const updatedMerchant = await MerchantProfile.update(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Merchant profile updated successfully',
        data: updatedMerchant
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating merchant profile',
        error: error.message
      });
    }
  },

  // Delete merchant profile
  deleteMerchant: async (req, res) => {
    try {
      const { id } = req.params;
      const merchant = await MerchantProfile.findById(id);
      if (!merchant) {
        return res.status(404).json({
          success: false,
          message: 'Merchant not found'
        });
      }

      await MerchantProfile.delete(id);

      res.status(200).json({
        success: true,
        message: 'Merchant profile deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting merchant profile',
        error: error.message
      });
    }
  },

  // Search merchant by store name
  getMerchantByStoreName: async (req, res) => {
    try {
      const { storeName } = req.params;
      const merchants = await MerchantProfile.findByStoreName(storeName);

      res.status(200).json({
        success: true,
        message: 'Merchants retrieved successfully',
        data: merchants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching merchants',
        error: error.message
      });
    }
  }
};

export default merchantProfileController;
