const { Assignments, User, Courses } = require('../models/index.models');
const {ConflictError} = require('../utils/errors');
const UserService = require('./user.service');
const CoursesService = require('./course.service');
const { where } = require('sequelize');

const userService = new UserService();
const coursesService = new CoursesService();

class AssignmentService{
  async _ensureAssignmentExist(assignmentId){
    const assignment = await Assignments.findByPk(assignmentId);
    if(!assignment){
      throw new ConflictError('Assignment does not exist');
    };

    return {
      assignment
    };
  };

  async create({userId, courseId}){
    await userService._ensureUserExist(userId);

    await coursesService._ensureCourseExist(courseId);

    const assignmentExist = await Assignments.findOne({
      where: {
        userId,
        courseId
      }
    });

    if(assignmentExist){
      throw new ConflictError('User with this course alredy exist');
    };

    const assignment = await Assignments.create({
      userId,
      courseId
    });
    
    return {
      assignment
    };
  };

  async getAll(filters = {}){
    const { courseId } = filters;
    const whereConditions = {};

    if (courseId){
      await coursesService._ensureCourseExist(courseId);
      whereConditions.courseId = courseId;
    }

    const assignment = await Assignments.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user', 
          attributes: ['userId', 'name']
        },
        {
          model: Courses,
          as: 'courses',
          attributes: ['courseId', 'title']
        }
      ]
    });
    return {
      assignment
    };
  };

  async getCourseByUser({courseId}){
    await coursesService._ensureCourseExist(courseId);

    const courses = await Assignments.findAll({
      where: { courseId: courseId },
      include: [
        {
          model: User,
          as: 'user', 
          attributes: ['userId', 'name']
        },
        {
          model: Courses,
          as: 'courses',
          attributes: ['courseId', 'title']
        }
      ]
    });
    return { 
      courses
    }
  };

  async getById({assignmentId}){
    const assignment = await this._ensureAssignmentExist(assignmentId);

    return {
      assignment
    };
  };

  async update({assignmentId, userId, courseId}){
    await this._ensureAssignmentExist(assignmentId);

    const assignmentExist = await Assignments.findOne({
      where: {
        userId,
        courseId
      }
    });

    if(assignmentExist){
      throw new ConflictError('User with this course alredy exist');
    };

    const assignmentUpdate = await Assignments.update({
      userId, 
      courseId,
    },{
      where: {assignmentId} 
    });

    return {
      assignmentUpdate
    };
  };

  async destroy({assignmentId}){
    await this._ensureAssignmentExist(assignmentId);

    await Assignments.destroy({
      where: {assignmentId}
    });

    return {
      assignmentId
    };
  };
};  

module.exports = AssignmentService
