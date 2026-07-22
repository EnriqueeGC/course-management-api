const { body } = require("express-validator");

const dataValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("tittle is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Tittle must be between 2 and 100 characters"),

  body("description").trim().notEmpty().withMessage("description is required"),
];

module.exports = { dataValidator };
