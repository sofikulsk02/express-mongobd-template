import { Router, RequestHandler } from 'express';

import healthRoutes from "./health/index.js";
import { apiKeyMiddleware } from './auth/apiKey.js';
import permission  from '../middlewares/permission.middleware.js';
import { Permission } from './../types/permissions';
import authRoutes from "./auth";

const router = Router();

router.use('/', healthRoutes);

router.use(apiKeyMiddleware);

router.use(permission(Permission.GENERAL) as RequestHandler);

router.use('/auth', authRoutes);

export default router;