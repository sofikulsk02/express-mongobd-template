import { Types } from "mongoose";
import Role  from "./Role.js";

export default interface User {
    _id: Types.ObjectId;
    name?: string;
    email: string;
    password: string;
    roles: Role[];
    verified?: boolean;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    isPasswordCorrect(password: string): Promise<boolean>;
}
