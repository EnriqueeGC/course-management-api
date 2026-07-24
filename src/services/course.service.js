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

  async getAll(){
    const courses = await Courses.findAll();
    // console.log(courses)
    // Devuelve una lista que sequelize interpreta como objeto [] por ende es verdadero
    // en REST APIs devolver una lista vacia con status 200 es correcto. Ya que te devuelve la lista pero tienes 0 elementos
    // if (!courses) {
      // throw new ConflictError("Courses does not exist");
    // }

    return {
      courses
    };
  }

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
