import { Request } from 'express';
import User from '../database/models/User';
import Keystore from '../database/models/Keystore';
import ApiKey from './ApiKey';
declare interface PublicRequest extends Request {
    apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
    currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
    user: User;
    accessToken: string;
    keystore: Keystore;
}

declare interface Tokens {
    accessToken: string;
    refreshToken: string;
}
