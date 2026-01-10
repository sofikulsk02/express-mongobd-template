import { model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../../types/User";


export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';


const schema = new Schema<User>({
    name: {
        type: Schema.Types.String,
        trim: true,
        maxLength: 200,
    },
    email: {
        type: Schema.Types.String,
        unique: true,
        trim: true,
        toLowerCase: true,
        select: false
    },
    password: {
        type: Schema.Types.String,
        select: false,
    },
    roles: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
        required: true,
        select: false,
    },
    verified: {
        type: Schema.Types.Boolean,
        default: false,
    },
    status: {
        type: Schema.Types.Boolean,
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false
});

schema.index({ _id: 1, status: 1 });
schema.index({ status: 1 });

// Pre hook to save the password as hashed password
schema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 12);
    next();
});



export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);