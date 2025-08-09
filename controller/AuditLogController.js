import AuditLog from '../models/AuditLog.js';

class AuditLogController {
  static async createAuditLog(req, res) {
    try {
      const { userId, action, tableName, recordId, description } = req.body;

      if (!userId || !action || !tableName) {
        return res.status(400).json({
          success: false,
          message: 'userId, action, dan tableName wajib diisi',
        });
      }

      const auditLog = await AuditLog.logActivity({
        userId,
        action,
        tableName,
        recordId,
        description,
      });

      res.status(201).json({
        success: true,
        message: 'Audit log berhasil dibuat',
        data: auditLog,
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal membuat audit log',
        error: error.message,
      });
    }
  }

  static async getAllAuditLogs(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const logs = await AuditLog.findAndCountAll({ limit, offset });

      res.status(200).json({
        success: true,
        data: logs.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(logs.count / limit),
          totalItems: logs.count,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil audit log',
        error: error.message,
      });
    }
  }

  static async getAuditLogsByUser(req, res) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const logs = await AuditLog.getByUser(userId, limit, offset);
      const totalCount = await AuditLog.count({ user_id: userId });

      res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error('Error fetching audit logs by user:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil audit log berdasarkan user',
        error: error.message,
      });
    }
  }

  static async getAuditLogsByTable(req, res) {
    try {
      const { tableName } = req.params;
      const { recordId } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const logs = await AuditLog.getByTable(tableName, recordId, limit, offset);

      const whereClause = { table_name: tableName };
      if (recordId) whereClause.record_id = recordId;
      const totalCount = await AuditLog.count(whereClause);

      res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error('Error fetching audit logs by table:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil audit log berdasarkan table',
        error: error.message,
      });
    }
  }

  static async getAuditLogById(req, res) {
    try {
      const { id } = req.params;
      const auditLog = await AuditLog.findByPk(id);

      if (!auditLog) {
        return res.status(404).json({
          success: false,
          message: 'Audit log tidak ditemukan',
        });
      }

      res.status(200).json({
        success: true,
        data: auditLog,
      });
    } catch (error) {
      console.error('Error fetching audit log by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil audit log',
        error: error.message,
      });
    }
  }

  static async searchAuditLogs(req, res) {
    try {
      const { query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Parameter query wajib diisi',
        });
      }

      const [rows] = await AuditLog.searchLogs(query, limit, offset);
      const [countResult] = await AuditLog.countSearch(query);
      const totalCount = countResult[0]?.count || 0;

      res.status(200).json({
        success: true,
        data: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error('Error searching audit logs:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mencari audit log',
        error: error.message,
      });
    }
  }

  static auditMiddleware(action, tableName) {
    return async (req, res, next) => {
      try {
        const originalSend = res.send;

        res.send = function (data) {
          originalSend.call(this, data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const userId = req.user?.id || req.body?.userId || 'anonymous';
            const recordId = req.params?.id || req.body?.id || null;
            AuditLog.logActivity({
              userId,
              action,
              tableName,
              recordId,
              description: `${action} pada ${tableName} ${recordId ? `dengan ID ${recordId}` : ''}`,
            }).catch(console.error);
          }
        };
        next();
      } catch (error) {
        console.error('Error in audit middleware:', error);
        next();
      }
    };
  }
}

export default AuditLogController;
