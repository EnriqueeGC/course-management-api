const AssignmentService = require('../services/assignment.service');

const assignmentService = new AssignmentService();

const create = async(req, res, next) => {
  try {
    const result = await assignmentService.create(req.body);
    res.status(201).json({
      message: 'Assignment created successfully',
      ...result
    })
  } catch (error) {
    next(error);
  };
};

const getAll = async(req, res, next) => {
  try {
    const { filters, page, limit } = req.query;

    const assignments = await assignmentService.getPaginatedAssignments({filters}, page, limit);

    const hasAssignments = assignments.data && assignments.data.length > 0;

    res.status(200).json({
      message: hasAssignments
      ? "Courses find successfully"
      : "You dont have any courses yet",
      ...assignments
    });
  } catch (error) {
    next(error);
  };
};

const getById = async(req, res, next) => {
  try {
    const assignment = await assignmentService.getById(req.params);
    res.status(200).json({
      message: 'Assignments retrived successfully',
      ...assignment
    });
  } catch (error) {
    next(error);
  };
};

const update = async(req, res, next) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await assignmentService.update({assignmentId, ...req.body}); 
    res.status(200).json({
      message: 'Assignment updated successfully',
      ...assignment
    });
  } catch (error) {
    next(error);
  };
};

const destroy = async(req, res, next) => {
  try {
    const assignment = await assignmentService.destroy(req.params);
    res.status(204).json({
      message: 'Assignment deleted successfully',
      ...assignment
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
