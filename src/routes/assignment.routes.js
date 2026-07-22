const { Router } = require('express');
const { create, getAll, getById, update, destroy } = require('../controllers/assignment.controller');
const { assignmentValidator } = require('../validators/assignment.validator.js');
const validate = require('../middlewares/validate');
const { isAuth } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const { isOwnerOrAdmin } = require("../middlewares/owner.middleware");

const router = Router()

router.post('/', [isAuth], validate, assignmentValidator, create);
router.get('/', isAuth, validate, getAll);
router.get('/:assignmentId', isAuth, validate, getById);
router.put('/:assignmentId', [isAuth, isAdmin], validate, assignmentValidator, update);
router.delete('/:assignmentId', [isAuth, isAdmin], validate, destroy);

module.exports = router;

