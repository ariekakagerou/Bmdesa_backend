import Faq from '../models/Faq.js';


class FaqController {
  // Get all FAQs
  static async getAllFaqs(req, res) {
    try {
      const faqs = await Faq.getAll();
      res.status(200).json({
        success: true,
        message: 'FAQs retrieved successfully',
        data: faqs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving FAQs',
        error: error.message
      });
    }
  }

  // Get FAQ by ID
  static async getFaqById(req, res) {
    try {
      const { id } = req.params;
      const faq = await Faq.getById(id);
      
      if (!faq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'FAQ retrieved successfully',
        data: faq
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving FAQ',
        error: error.message
      });
    }
  }

  // Get FAQs by category
  static async getFaqsByCategory(req, res) {
    try {
      const { category } = req.params;
      const faqs = await Faq.getByCategory(category);
      
      res.status(200).json({
        success: true,
        message: `FAQs for category '${category}' retrieved successfully`,
        data: faqs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving FAQs by category',
        error: error.message
      });
    }
  }

  // Create new FAQ
  static async createFaq(req, res) {
    try {
      const { question, answer, category } = req.body;

      // Validation
      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          message: 'Question and answer are required'
        });
      }

      const faqData = { question, answer, category };
      const faqId = await Faq.create(faqData);

      res.status(201).json({
        success: true,
        message: 'FAQ created successfully',
        data: { faq_id: faqId, ...faqData }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating FAQ',
        error: error.message
      });
    }
  }

  // Update FAQ
  static async updateFaq(req, res) {
    try {
      const { id } = req.params;
      const { question, answer, category } = req.body;

      // Check if FAQ exists
      const existingFaq = await Faq.getById(id);
      if (!existingFaq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }

      // Validation
      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          message: 'Question and answer are required'
        });
      }

      const faqData = { question, answer, category };
      const updated = await Faq.update(id, faqData);

      if (updated) {
        res.status(200).json({
          success: true,
          message: 'FAQ updated successfully',
          data: { faq_id: id, ...faqData }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to update FAQ'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating FAQ',
        error: error.message
      });
    }
  }

  // Delete FAQ
  static async deleteFaq(req, res) {
    try {
      const { id } = req.params;

      // Check if FAQ exists
      const existingFaq = await Faq.getById(id);
      if (!existingFaq) {
        return res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
      }

      const deleted = await Faq.delete(id);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'FAQ deleted successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to delete FAQ'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting FAQ',
        error: error.message
      });
    }
  }

  // Search FAQs
  static async searchFaqs(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const faqs = await Faq.search(q);

      res.status(200).json({
        success: true,
        message: `Search results for '${q}'`,
        data: faqs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching FAQs',
        error: error.message
      });
    }
  }

  // Get all categories
  static async getCategories(req, res) {
    try {
      const categories = await Faq.getCategories();

      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving categories',
        error: error.message
      });
    }
  }
}

export default FaqController;

