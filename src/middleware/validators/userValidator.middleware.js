const { body, check } = require('express-validator');
const Role = require('../../utils/userRoles.utils');


exports.createUserSchema = [
    check('phone')
        .exists()
        .withMessage('phone is required')
        .isLength({ min: 10 })
        .withMessage('Must be at least 10 digits long'),
    check('name')
        .exists()
        .withMessage('Your name is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('role')
        .optional()
        .isIn([Role.Admin, Role.User])
        .withMessage('Invalid Role type'),
    check('status')
        .optional()
        .isIn([0, 1])
        .withMessage('Invalid Status type'),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
];

exports.updateUserSchema = [
    check('phone')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Must be at least 10 digits long'),
    check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('role')
        .optional()
        .isIn([Role.Admin, Role.User])
        .withMessage('Invalid Role type'),
    check('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
    check('status')
        .optional()
        .isIn([0, 1])
        .withMessage('Invalid Status type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['phone', 'password', 'email', 'role', 'name', 'status'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.validateLogin = [
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];