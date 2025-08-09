import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import db from '../config/db.js'; // asumsikan ini default export

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


class PasswordResetController {
  // Request password reset
  static async requestReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if user exists
      const [users] = await db.execute(
        'SELECT id, nama, email FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User with this email does not exist'
        });
      }

      const user = users[0];

      // Generate reset token
      const token = crypto.randomBytes(32).toString('hex');
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

      // Set expiration time (1 hour from now)
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      // Check if reset request already exists
      const [existingReset] = await db.execute(
        'SELECT id FROM password_resets WHERE email = ?',
        [email]
      );

      if (existingReset.length > 0) {
        // Update existing record
        await db.execute(
          'UPDATE password_resets SET token = ?, code = ?, expires_at = ?, created_at = NOW() WHERE email = ?',
          [token, code, expiresAt, email]
        );
      } else {
        // Insert new record
        await db.execute(
          'INSERT INTO password_resets (email, token, code, expires_at) VALUES (?, ?, ?, ?)',
          [email, token, code, expiresAt]
        );
      }

      // Send email with reset link and code
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hello ${user.nama},</p>
          <p>You have requested to reset your password. Please use one of the following methods:</p>
          
          <h3>Method 1: Click the link below</h3>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          
          <h3>Method 2: Use this verification code</h3>
          <p style="font-size: 24px; font-weight: bold; color: #007bff;">${code}</p>
          
          <p>This link and code will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email',
        data: {
          email: email,
          expires_at: expiresAt
        }
      });

    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Verify reset token or code
  static async verifyReset(req, res) {
    try {
      const { token, code, email } = req.body;

      if (!token && !code) {
        return res.status(400).json({
          success: false,
          message: 'Token or code is required'
        });
      }

      let query, params;
      
      if (token) {
        query = 'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()';
        params = [token];
      } else {
        if (!email) {
          return res.status(400).json({
            success: false,
            message: 'Email is required when using code'
          });
        }
        query = 'SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()';
        params = [email, code];
      }

      const [resets] = await db.execute(query, params);

      if (resets.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token/code'
        });
      }

      const reset = resets[0];

      res.status(200).json({
        success: true,
        message: 'Reset token/code is valid',
        data: {
          email: reset.email,
          token: reset.token
        }
      });

    } catch (error) {
      console.error('Verify reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Reset password
  static async resetPassword(req, res) {
    try {
      const { token, code, email, newPassword, confirmPassword } = req.body;

      if (!newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password and confirmation are required'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      let query, params;
      
      if (token) {
        query = 'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()';
        params = [token];
      } else {
        if (!email || !code) {
          return res.status(400).json({
            success: false,
            message: 'Email and code are required'
          });
        }
        query = 'SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()';
        params = [email, code];
      }

      const [resets] = await db.execute(query, params);

      if (resets.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token/code'
        });
      }

      const reset = resets[0];
      const userEmail = reset.email;

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password
      await db.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, userEmail]
      );

      // Delete reset record
      await db.execute(
        'DELETE FROM password_resets WHERE email = ?',
        [userEmail]
      );

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });

    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all password reset requests (admin only)
  static async getAllResets(req, res) {
    try {
      const [resets] = await db.execute(
        'SELECT id, email, code, expires_at, created_at FROM password_resets ORDER BY created_at DESC'
      );

      res.status(200).json({
        success: true,
        message: 'Password reset requests retrieved successfully',
        data: resets
      });

    } catch (error) {
      console.error('Get all resets error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Clean expired reset requests
  static async cleanExpired(req, res) {
    try {
      const [result] = await db.execute(
        'DELETE FROM password_resets WHERE expires_at < NOW()'
      );

      res.status(200).json({
        success: true,
        message: `Cleaned ${result.affectedRows} expired reset requests`
      });

    } catch (error) {
      console.error('Clean expired error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default PasswordResetController;
