import ShippingRate from '../models/ShippingRate.js';

class ShippingRateController {
  static async getAllShippingRates(req, res) {
    try {
      const { search, origin_city, destination_city, service_id } = req.query;

      let shippingRates;
      if (search) {
        shippingRates = await ShippingRate.search(search);
      } else if (origin_city && destination_city) {
        shippingRates = await ShippingRate.getByRoute(origin_city, destination_city);
      } else if (service_id) {
        shippingRates = await ShippingRate.getByServiceId(service_id);
      } else {
        shippingRates = await ShippingRate.getAll();
      }

      res.status(200).json({
        success: true,
        message: 'Shipping rates retrieved successfully',
        data: shippingRates,
        total: shippingRates.length
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getShippingRateById(req, res) {
    try {
      const { id } = req.params;
      const shippingRate = await ShippingRate.getById(id);

      if (!shippingRate) {
        return res.status(404).json({ success: false, message: 'Shipping rate not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Shipping rate retrieved successfully',
        data: shippingRate
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createShippingRate(req, res) {
    try {
      const { origin_city, destination_city, rate, service_id } = req.body;

      if (!origin_city || !destination_city || !rate || !service_id) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: origin_city, destination_city, rate, service_id'
        });
      }

      if (isNaN(rate) || rate < 0) {
        return res.status(400).json({
          success: false,
          message: 'Rate must be a valid positive number'
        });
      }

      const newShippingRate = await ShippingRate.create({
        origin_city: origin_city.trim(),
        destination_city: destination_city.trim(),
        rate: parseFloat(rate),
        service_id: parseInt(service_id)
      });

      res.status(201).json({
        success: true,
        message: 'Shipping rate created successfully',
        data: newShippingRate
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateShippingRate(req, res) {
    try {
      const { id } = req.params;
      const { origin_city, destination_city, rate, service_id } = req.body;

      if (!origin_city || !destination_city || !rate || !service_id) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: origin_city, destination_city, rate, service_id'
        });
      }

      if (isNaN(rate) || rate < 0) {
        return res.status(400).json({
          success: false,
          message: 'Rate must be a valid positive number'
        });
      }

      const updatedShippingRate = await ShippingRate.update(id, {
        origin_city: origin_city.trim(),
        destination_city: destination_city.trim(),
        rate: parseFloat(rate),
        service_id: parseInt(service_id)
      });

      if (!updatedShippingRate) {
        return res.status(404).json({
          success: false,
          message: 'Shipping rate not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Shipping rate updated successfully',
        data: updatedShippingRate
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteShippingRate(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ShippingRate.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Shipping rate not found'
        });
      }

      res.status(200).json({ success: true, message: 'Shipping rate deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAvailableRoutes(req, res) {
    try {
      const routes = await ShippingRate.getAvailableRoutes();
      res.status(200).json({
        success: true,
        message: 'Available routes retrieved successfully',
        data: routes
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async calculateShippingCost(req, res) {
    try {
      const { origin_city, destination_city, weight = 1 } = req.query;

      if (!origin_city || !destination_city) {
        return res.status(400).json({
          success: false,
          message: 'origin_city and destination_city are required'
        });
      }

      const rates = await ShippingRate.getByRoute(origin_city, destination_city);

      if (rates.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No shipping rates found for this route'
        });
      }

      const calculations = rates.map(rate => ({
        service_id: rate.service_id,
        base_rate: rate.rate,
        weight: parseFloat(weight),
        total_cost: rate.rate * parseFloat(weight),
        route: `${rate.origin_city} → ${rate.destination_city}`
      }));

      res.status(200).json({
        success: true,
        message: 'Shipping cost calculated successfully',
        data: {
          origin_city,
          destination_city,
          weight: parseFloat(weight),
          calculations
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default ShippingRateController;
