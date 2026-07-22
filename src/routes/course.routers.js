const { Router } = require('express')
const { create, getAll, getById, update, destroy } = require('../controllers/course.controller');
const {dataValidator} = require('../validators/course.validator');
const validate = require('../middlewares/validate');
const { isAuth } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const { isOwnerOrAdmin } = require("../middlewares/owner.middleware");

const router = Router();

router.post('/', [isAuth, isAdmin], dataValidator, validate, create);
router.get('/', isAuth, validate, getAll);
router.get('/:courseId', isAuth, getById);
router.put('/:courseId', [isAuth, isAdmin], dataValidator, validate, update);
router.delete('/:courseId', [isAuth, isAdmin], destroy)

module.exports = router
