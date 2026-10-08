const { Router } = require('express');
const { login, logOut, me } = require('../controllers/auth.controller');
const { loginValidation  } = require('../validators/user.validator');
const validate = require('../middlewares/validate');
const { isAuth } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', loginValidation, validate, login);
router.post('/logout', logOut )
router.get('/me', isAuth, me);

module.exports = router;
