const { Courses } = require("../models/index.models");
const { ConflictError, NotFoundError } = require("../utils/errors");

class CoursesService {
  async _ensureCourseExist(courseId){
    const course = await Courses.findByPk(courseId);
    if(!course){
      throw new NotFoundError('Course does not exist');
    };
    return {
      course
    };
  };

  async create({ title, description }) {
    const existingCourse = await Courses.findOne({
      where: { title },
    });

    if (existingCourse) {
      throw new ConflictError("Course alredy exists");
    }

    const course = await Courses.create({
      title,
      description,
    });

    return {
      course: {
        courseId: course.courseId,
        title: course.title,
        description: course.description,
      },
    };
  }

  async getPaginatedCourses(page=1, limit=10){
    const validPage = Math.max(1, parseInt(page, 10) || 1);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10 ));

    const offset = (validPage - 1 ) * validLimit;

    const { count, rows } = await Courses.findAndCountAll({
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
      },
    };
  };

  async getById({courseId}){
    const course = await this._ensureCourseExist(courseId);
    return {
      course
    };
  };

  async update({courseId, title, description}){
    await this._ensureCourseExist(courseId);

    await Courses.update({
      title,
      description
    }, {
      where: {courseId}
    });

    return {
      course: {
        courseId,
        title,
        description
      }
    };
  };

  async delete({courseId}){
    await this._ensureCourseExist(courseId);

    const result = await Courses.destroy({
      where: {courseId}
    });

    return {
      result
    };
  };
}

module.exports = CoursesService;
