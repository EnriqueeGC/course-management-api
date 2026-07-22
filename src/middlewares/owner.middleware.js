const ROLES = {
  ADMIN: 1,
  USER: 2
};

const isOwnerOrAdmin = (req, res, next) => {
  // 1. Validar autenticación
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const authenticatedUserId = req.user.sub;
  const authenticatedUserRole = req.user.role;
  const targetUserId = req.params.userId;

  // 2. Normalizar a String para evitar errores de tipo (ej: número vs string)
  const isOwner = String(authenticatedUserId) === String(targetUserId);
  const isAdmin = authenticatedUserRole === ROLES.ADMIN;

  // 3. Evaluar permisos
  if (isOwner || isAdmin) {
    return next();
  }

  // 4. Denegar acceso si no cumple ninguna
  return res.status(403).json({
    message: "Access denied. You can only manage your own account or must be an admin"
  });
};

module.exports = { isOwnerOrAdmin };
