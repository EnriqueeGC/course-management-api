const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize'); 

const User = require('./user.model')(sequelize, DataTypes);
const Courses = require('./course.model')(sequelize, DataTypes);
const Assignments = require('./assignments.model')(sequelize, DataTypes);

//Associations
User.hasMany(Assignments, {foreignKey: 'userId', as: 'assignments' });
Courses.hasMany(Assignments, {foreignKey: 'courseId', as: 'assignments' });
Assignments.belongsTo(User, {foreignKey: 'userId', as: 'user' });
Assignments.belongsTo(Courses, {foreignKey: 'courseId', as: 'courses' });

module.exports = {
    sequelize, 
    User, 
    Courses,
    Assignments
};