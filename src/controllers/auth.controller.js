const AuthService = require('../services/auth.service');

const authService = new AuthService();

const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);

    res.cookie('authToken', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.status(200).json({
      message: 'Login successfully',
      ...user
    });
  } catch (error) {
    next(error);
  };
};

const logOut = (req, res, next) => {
  res.clearCookie('authToken', {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return res.json({
    message: "Logout successfully",
  });
};

module.exports = {
  login,
  logOut
};
