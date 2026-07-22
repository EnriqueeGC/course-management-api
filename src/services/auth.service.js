const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index.models");
const authConfig = require("../config/auth.config");
const { ConflictError } = require("../utils/errors");

class AuthService {
  async login({email, password}) {
    const user = await User.scope('withPassword').findOne({ where: {email} });
    if(!user){
      throw new ConflictError('Email or password incorrect');
    };

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      throw new ConflictError('Email or password incorrect');
    };

    // const token = jwt.sign(
    //   { userId: user.userId, role: user.role },
    //   authConfig.jwtSecret,
    //   { expiresIn: authConfig.jwtExpiresIn},
    // );

    const token = jwt.sign(
      { sub: user.userId, role: user.role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn},
    );

    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  };
};

module.exports = AuthService;
