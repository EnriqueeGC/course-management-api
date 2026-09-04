const { Assignments, User, Courses } = require('../models/index.models');
const {ConflictError, NotFoundError} = require('../utils/errors');
const UserService = require('./user.service');
const CoursesService = require('./course.service');
const { where } = require('sequelize');

const userService = new UserService();
const coursesService = new CoursesService();

class AssignmentService{
  async _ensureAssignmentExist(assignmentId){
    const assignment = await Assignments.findByPk(assignmentId);
    if(!assignment){
      throw new NotFoundError('Assignment does not exist');
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

  async getPaginatedAssignments(filters = {}, page =1, limit =10){
    const validPage = Math.max(1, parseInt(page, 10) || 1);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const offset = (validPage - 1) * validLimit;

    const { courseId, userId } = filters;
    const whereConditions = {};

    if (userId){
      await userService._ensureUserExist(userId);
      whereConditions.userId = userId;
    };

    if (courseId){
      await coursesService._ensureCourseExist(courseId);
      whereConditions.courseId = courseId;
    };

    const { count, rows }= await Assignments.findAndCountAll({
      limit: validLimit,
      offset: offset,
      order: [['createdAt', 'DESC']],
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

    const totalPages = Math.ceil(count/validLimit);

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
      },
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
