module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        defaultValue: 2,
    },
  }, {
    defaultScope: {
      attributes: { exclude: ['password']}
    },
    scopes: {
      withPassword: {attributes: {}, }
    }
  });
  return Users;
};
