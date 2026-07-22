const CoursesService = require("../services/course.service");

const coursesService = new CoursesService();

const create = async (req, res, next) => {
  try {
    const result = await coursesService.create(req.body);
    res.status(201).json({
      message: "Course created succesfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await coursesService.getAll();
    const hasCourses = result.courses && result.courses.length > 0;

    res.status(200).json({
      message: hasCourses 
      ? "Courses find successfully"
      : "You dont have any courses yet",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async(req, res, next) => {
  try {
    const result = await coursesService.getById(req.params);
    res.status(200).json({
      message: "course find successfully",
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const update = async(req, res, next) => {
  const { courseId } = req.params;    
  try {
    const result = await coursesService.update({courseId, ...req.body})
    res.status(200).json({
      message: "Course updated successfully",
      ...result
    })
  } catch (error) {
    next(error);
  };
};

const destroy = async(req, res, next) => {
  try {
    const result = await coursesService.delete(req.params);
    res.status(200).json({
      message: "Course deleted successfully",
      ...result
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  destroy
};
