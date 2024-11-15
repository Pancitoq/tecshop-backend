import { UNAUTHORIZED } from "../constants/httpStatus.js";
import authMid from './auth.mid.js';

const adminMid = (req, res, next) => {
    if (!req.user.isAdmin) res.status(UNAUTHORIZED).send();

    return next();
};

// Usa primero el authMid para verificar si es un usuario y setear la info del usuario en req.user
// Luego ejecuta adminMid para ver si es un administrador a través de req.user.isAdmin
export default [authMid, adminMid];