const AuthService = require('../services/auth.service');

const authService = new AuthService();

const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    res.status(201).json({
      message: 'Login successfully',
      ...user
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  login,
};
