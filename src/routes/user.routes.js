const { Router } = require("express");
const {
  register,
  getAll,
  getByPk,
  update,
  updatePassword,
  deleted,
} = require("../controllers/user.controller");
const { registerValidation } = require("../validators/user.validator");
const validate = require("../middlewares/validate");
const { isAuth } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const { isOwnerOrAdmin } = require("../middlewares/owner.middleware");

const router = Router();

router.post("/", registerValidation, validate, register);
router.get("/", [isAuth, isAdmin], validate, getAll);
router.get("/:userId", [isAuth, isOwnerOrAdmin ], validate, getByPk);
router.put("/profile/:userId", [isAuth, isOwnerOrAdmin], validate, registerValidation, update);
router.put("/:userId", [isAuth, isOwnerOrAdmin], validate, updatePassword);
router.delete("/:userId", [isAuth, isOwnerOrAdmin], validate, deleted);

module.exports = router;
