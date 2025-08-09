// middleware/attendanceValidation.js
import { body, param, query } from 'express-validator';

// Validasi untuk membuat attendance
export const validateCreateAttendance = [
    body('user_id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    
    body('date')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Date must be in YYYY-MM-DD format'),
    
    body('check_in')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('Check-in time must be in HH:MM:SS format'),
    
    body('check_out')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('Check-out time must be in HH:MM:SS format'),
    
    body('status')
        .isIn(['present', 'absent', 'leave', 'late'])
        .withMessage('Status must be one of: present, absent, leave, late'),
    
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters')
];

// Validasi untuk update attendance
export const validateUpdateAttendance = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Attendance ID must be a positive integer'),
    
    body('check_in')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('Check-in time must be in HH:MM:SS format'),
    
    body('check_out')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('Check-out time must be in HH:MM:SS format'),
    
    body('status')
        .optional()
        .isIn(['present', 'absent', 'leave', 'late'])
        .withMessage('Status must be one of: present, absent, leave, late'),
    
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters')
];

// Validasi untuk parameter ID
export const validateAttendanceId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Attendance ID must be a positive integer')
];

// Validasi untuk user ID
export const validateUserId = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
];

// Validasi untuk user ID dan date
export const validateUserAndDate = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    
    param('date')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Date must be in YYYY-MM-DD format')
];

// Validasi untuk date range query
export const validateDateRange = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    
    query('startDate')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Start date must be in YYYY-MM-DD format'),
    
    query('endDate')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('End date must be in YYYY-MM-DD format'),
    
    query('startDate')
        .custom((startDate, { req }) => {
            if (new Date(startDate) > new Date(req.query.endDate)) {
                throw new Error('Start date must be before or equal to end date');
            }
            return true;
        })
];

// Validasi untuk statistik attendance
export const validateAttendanceStats = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    
    query('month')
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
    
    query('year')
        .isInt({ min: 2000, max: 2100 })
        .withMessage('Year must be between 2000 and 2100')
];

// Validasi untuk pagination
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];

// Validasi untuk update check-in
export const validateCheckIn = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Attendance ID must be a positive integer'),
    
    body('check_in')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('Check-in time must be in HH:MM:SS format')
];

// Validasi untuk update check-out
export const validateCheckOut = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Attendance ID must be a positive integer'),
    
    body('check_out')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('Check-out time must be in HH:MM:SS format')
];