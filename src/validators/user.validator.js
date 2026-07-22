const { body } = require("express-validator");

const emailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Must be a valid email")
  .normalizeEmail();

const passwordValidation = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters");

const nameValidation = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .isLength({ min: 2, max: 100 })
  .withMessage("Name must be between 2 and 100 characters");

const roleValidation = body("role")
  .optional()
  .isInt({ min: 1, max: 2 })
  .withMessage("Role must be 1 (admin) or 2 (student)");

const passwordValidationLogin = body("password")
  .notEmpty()
  .withMessage("Password is required");

const registerValidation = [
  nameValidation,
  emailValidation,
  passwordValidation,
  roleValidation,
];

const loginValidation = [emailValidation, passwordValidationLogin];

module.exports = {
  registerValidation,
  loginValidation,
};
