// Role-based access middleware
module.exports = function(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (allowedRoles.length === 0) return next();
    // user.role is like 'admin' or 'store_owner' or 'technician' or 'customer'
    if (allowedRoles.includes(user.role)) return next();
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  };
};
