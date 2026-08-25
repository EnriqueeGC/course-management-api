const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index.models");
const authConfig = require("../config/auth.config");
const { ConflictError, NotFoundError, UnauthorizedError } = require("../utils/errors");

class UserService {
  async _ensureUserExist(userId){
    const user = await User.findByPk(userId);
    if(!user){
      throw new NotFoundError('User does not exist');
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

  async getPaginatedUser(page=1, limit=10){
    const validPage = Math.max(1, parseInt(page, 10) || 1);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const offset = (validPage -1 ) * validLimit;

    const { count, rows } = await User.findAndCountAll({
      limit: validLimit,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / validLimit);

    return {
      data: rows,
      meta: {
        totalItems: count,
        itemCount: rows.length,
        itemsPerPage: validLimit,
        totalPages: totalPages,
        currentPage: validPage,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      }
    };
  };

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
      throw new NotFoundError('User not found');
    };

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
      throw new UnauthorizedError('Wrong password');
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
