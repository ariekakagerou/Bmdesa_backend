import Session from '../models/Session.js';

class SessionController {
  static async getAllSessions(req, res) {
    try {
      const { page = 1, limit = 10, user_id } = req.query;
      const offset = (page - 1) * limit;

      const { rows, count } = await Session.findAll({
        limit: Number(limit),
        offset: Number(offset),
        user_id
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: Number(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data session',
        error: error.message
      });
    }
  }

  static async getSessionById(req, res) {
    try {
      const { id } = req.params;
      const session = await Session.findById(id);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data session',
        error: error.message
      });
    }
  }

  static async createSession(req, res) {
    try {
      const { user_id, ip_address, user_agent, payload } = req.body;

      if (!user_id || !payload) {
        return res.status(400).json({
          success: false,
          message: 'user_id dan payload wajib diisi'
        });
      }

      const newId = await Session.create({
        user_id,
        ip_address: ip_address || req.ip,
        user_agent: user_agent || req.get('User-Agent'),
        payload
      });

      const newSession = await Session.findById(newId);

      res.status(201).json({
        success: true,
        message: 'Session berhasil dibuat',
        data: newSession
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal membuat session',
        error: error.message
      });
    }
  }

  static async updateSession(req, res) {
    try {
      const { id } = req.params;
      const { payload, ip_address, user_agent } = req.body;

      const session = await Session.findById(id);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session tidak ditemukan'
        });
      }

      await Session.update(id, { payload, ip_address, user_agent });
      const updated = await Session.findById(id);

      res.json({
        success: true,
        message: 'Session berhasil diupdate',
        data: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate session',
        error: error.message
      });
    }
  }

  static async deleteSession(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Session.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Session tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Session berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus session',
        error: error.message
      });
    }
  }

  static async getSessionsByUserId(req, res) {
    try {
      const { user_id } = req.params;
      const { active_only = false } = req.query;

      const sessions = await Session.findByUserId(user_id, active_only === 'true');

      res.json({
        success: true,
        data: sessions,
        count: sessions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil session user',
        error: error.message
      });
    }
  }

  static async cleanupExpiredSessions(req, res) {
    try {
      const { max_lifetime = 7200 } = req.query;

      const deleted = await Session.cleanupExpired(parseInt(max_lifetime));

      res.json({
        success: true,
        message: `${deleted} session expired berhasil dihapus`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus session expired',
        error: error.message
      });
    }
  }

  static async deleteUserSessions(req, res) {
    try {
      const { user_id } = req.params;
      const { except_id } = req.query;

      const deleted = await Session.deleteUserSessions(user_id, except_id || null);

      res.json({
        success: true,
        message: `${deleted} session user berhasil dihapus`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus session user',
        error: error.message
      });
    }
  }
}

export default SessionController;
