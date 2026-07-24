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
    const filters = req.query;
    // Desestructuramos { assignment } directo del objeto que devuelve el servicio
    const { assignment } = await assignmentService.getAll(filters);

    res.status(200).json({
      message: "Assignments retrieved successfully",
      data: assignment // Mandamos el arreglo limpio bajo la propiedad 'data'
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
