const { Router } = require('express');
const { login, logOut } = require('../controllers/auth.controller');
const { loginValidation  } = require('../validators/user.validator');
const validate = require('../middlewares/validate');

const router = Router();

router.post('/', loginValidation, validate, login);
router.post('/logout', logOut )

module.exports = router;
