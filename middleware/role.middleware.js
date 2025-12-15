import { Apierror } from "../utils/apierror";
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new Apierror(403, "Access denied");
        }
        next();
    };
};