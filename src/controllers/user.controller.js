const UserService = require("../services/user.service");

const userService = new UserService();

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await userService.getAll();
    const hasUsers = result.users && result.users.length > 0;
    res.status(200).json({
      message: hasUsers
      ? "Users find successfully"
      : "You dont have any users yet",
      ...result,
    });
  } catch (error) {
    next(error);
  };
};

const getByPk = async (req, res, next) => {
  try {
    const result = await userService.getByPk(req.params);
    res.status(200).json({
      message: "User find successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { userId }= req.params;
  try {
    const result = await userService.update({userId, ...req.body});
    res.status(200).json({
      message: 'User updated successfully',
      ...result
    });
  } catch (error) {
    next(error);
  };
};

const updatePassword = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const result = await userService.updatePassword({userId, ...req.body });
    res.status(200).json({
      message: 'Password updated successfully',
      ...result
    });
  } catch (error) {
    next(error);
  };
};

const deleted = async (req, res, next) => {
  try {
    const result = await userService.delete(req.params);
    res.status(204).json({
      message: 'User deleted successfully',
      ...result
    })
  } catch (error) {
    next(error);
  };
};

module.exports = {
  register,
  getAll,
  getByPk,
  update,
  updatePassword,
  deleted
};
