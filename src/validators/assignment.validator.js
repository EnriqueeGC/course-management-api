const { body } = require('express-validator');
   
const assignmentValidator = [
  body('userId')
  .trim()
  .notEmpty()
  .withMessage('User is required'),    

  body('courseId')
  .trim()
  .notEmpty()
  .withMessage('Course is required')
]

module.exports = { assignmentValidator };
