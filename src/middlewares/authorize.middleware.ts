import { RequestHandler } from 'express';
import { RoleCode } from '../types/Role';
import { ProtectedRequest } from '../types/app-requests';
import { ForbiddenError } from '../core/ApiError';

export const authorize = (...allowedRoles: RoleCode[]): RequestHandler => {
    return (req, _res, next) => {
        try {
            const protectedReq = req as ProtectedRequest;

            if (!protectedReq.user) {
                throw new ForbiddenError('Authentication required');
            }

            if (!allowedRoles.includes(protectedReq.user.role)) {
                throw new ForbiddenError(
                    `Forbidden: required roles [${allowedRoles.join(', ')}], found: ${protectedReq.user.role}`,
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
