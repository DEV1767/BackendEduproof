import { Apierror } from "../utils/apierror.js";

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new Apierror(403, "Access denied");
        }
        next();
    };
};
