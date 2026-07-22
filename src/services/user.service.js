const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index.models");
const authConfig = require("../config/auth.config");
const { ConflictError } = require("../utils/errors");

class UserService {
  async _ensureUserExist(userId){
    const user = await User.findByPk(userId);
    if(!user){
      throw new ConflictError('User does not exist');
    };

    return {
      user
    };
  };

  async register({ name, email, password, role }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictError("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, authConfig.saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 2,
    });

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn },
    );

    return {
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
  async getAll() {
    const result = await User.findAll();
    if (!result) {
      throw new ConflictError("Not users found");
    }

    return {
    users: result,
    };
  }

  async getByPk({ userId }) {
    const user = await this._ensureUserExist(userId);
    
    return {
      user
    };
  };

  async update({ userId, name, email, role }) {
    await this._ensureUserExist(userId);

    const [affectedCount] = await User.update({
      name,
      email,
      role, //: role || existingUser.role,
    }, {
      where: {userId}
    });

    return {
      user: {
        userId, 
        name,
        email,
      },
    };
  };

  async updatePassword({userId, oldPassword, newPassword}){
    const user = await User.scope('withPassword').findByPk(userId);
    if(!user){
      throw new ConflictError('User not found');
    };

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
      throw new ConflictError('Wrong password');
    };

    user.password = await bcrypt.hash(newPassword, authConfig.saltRounds);
    await user.save()

    return {
      success: true, 
      message: 'Password updated successfully'
    };
  };

  async delete({ userId }){
    await this._ensureUserExist(userId);
    const result = await User.destroy({
      where: {userId}
    });

    return {
      result
    };
  };
};

module.exports = UserService;
