import Setting from '../models/Setting.js';

class SettingController {
  static async getAllSettings(req, res) {
    try {
      const { page = 1, limit = 10, search = '', jenis = '' } = req.query;
      const offset = (page - 1) * limit;

      const { rows, count } = await Setting.findAll({ limit, offset, search, jenis });

      const parsed = rows.map(s => ({
        ...s,
        parsed_value: Setting.parseValue(s)
      }));

      res.json({
        success: true,
        data: parsed,
        pagination: {
          current_page: Number(page),
          per_page: Number(limit),
          total: count,
          total_pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving settings', error: error.message });
    }
  }

  static async getSettingById(req, res) {
    try {
      const { id } = req.params;
      const setting = await Setting.findById(id);

      if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });

      res.json({ success: true, data: { ...setting, parsed_value: Setting.parseValue(setting) } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
  }

  static async getSettingByKey(req, res) {
    try {
      const { key } = req.params;
      const setting = await Setting.findByKey(key);

      if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });

      res.json({ success: true, data: { ...setting, parsed_value: Setting.parseValue(setting) } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
  }

  static async createSetting(req, res) {
    try {
      const { nama, jenis, penyimpanan, setting_key, setting_value } = req.body;

      if (!nama || !jenis || !setting_key) {
        return res.status(400).json({ success: false, message: 'nama, jenis, setting_key wajib diisi' });
      }

      const existing = await Setting.findByKey(setting_key);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Setting key already exists' });
      }

      const id = await Setting.create({ nama, jenis, penyimpanan, setting_key, setting_value });
      const newSetting = await Setting.findById(id);

      res.status(201).json({ success: true, data: { ...newSetting, parsed_value: Setting.parseValue(newSetting) } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
  }

  static async updateSetting(req, res) {
    try {
      const { id } = req.params;
      const { setting_key } = req.body;

      const setting = await Setting.findById(id);
      if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });

      if (setting_key && setting_key !== setting.setting_key) {
        const exist = await Setting.findByKey(setting_key);
        if (exist && exist.id !== Number(id)) {
          return res.status(409).json({ success: false, message: 'Setting key already exists' });
        }
      }

      await Setting.updateById(id, req.body);
      const updated = await Setting.findById(id);

      res.json({ success: true, data: { ...updated, parsed_value: Setting.parseValue(updated) } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
  }

  static async updateSettingByKey(req, res) {
    try {
      const { key } = req.params;
      const setting = await Setting.findByKey(key);
      if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });

      await Setting.updateByKey(key, req.body);
      const updated = await Setting.findByKey(key);

      res.json({ success: true, data: { ...updated, parsed_value: Setting.parseValue(updated) } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
  }

  static async deleteSetting(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Setting.deleteById(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Setting not found' });
      res.json({ success: true, message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
  }

  static async deleteSettingByKey(req, res) {
    try {
      const { key } = req.params;
      const deleted = await Setting.deleteByKey(key);
      if (!deleted) return res.status(404).json({ success: false, message: 'Setting not found' });
      res.json({ success: true, message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error', error: error.message });
    }
  }
}

export default SettingController;
