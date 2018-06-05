function requireLogin  (req, res, next)  {
    if (req.isAuthenticated()) return next();
    res.status(403).send({msg: "You are not authorized, need login first"})
}

function hasAdminPermission  (req, res, next)  {
    if (req.user.role === 'admin') return next();
    res.status(403).send({msg: "You are not authorized, need admin permission"})
}

function hasModPermission (req, res, next){
    if (req.user.role === 'mod' || req.user.role === 'admin') return next();
    res.status(403).send({msg: "You are not authorized, need mod permission"})
}

function hasUserPermission (req, res, next) {
    if (req.user.role === 'user' || req.user.role === 'mod' || req.user.role === 'admin') return next();
    res.status(403).send({msg: "You are not authorized, need user permission"})
}


exports.AdminAuthorized = [requireLogin, hasAdminPermission]
exports.ModAuthorized = [requireLogin, hasModPermission]
exports.UserAuthorized = [requireLogin, hasUserPermission]