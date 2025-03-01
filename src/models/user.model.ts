import mongoose, { Schema, Document, mongo } from "mongoose";

export interface LoginStatus extends Document {
  twitter: boolean;
  reddit: boolean;
  hashnode: boolean;
  medium: boolean;
  linkedIn: boolean;
}
export interface User extends Document {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  premiumTaken: boolean;
  loginStatus: LoginStatus;
}

const LoginStatusSchema: Schema<LoginStatus> = new Schema({
  twitter: {
    type: Boolean,
    default: false,
  },
  reddit: {
    type: Boolean,
    default: false,
  },
  hashnode: {
    type: Boolean,
    default: false,
  },
  medium: {
    type: Boolean,
    default:false
  },
  linkedIn: {
    type: Boolean,
    default: false,
  },
});

const UserSchema: Schema<User> = new Schema({
  firstname: {
    type: String,
    required: [true, "firstname is required"],
    min: [2, "firstname should atleast have 2 characters"],
    max: [20, "firstname should be atmost have 20 characters"],
  },
  lastname: {
    type: String,

    max: [20, "firstname should be atmost have 20 characters"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
    min: [2, "username should atleast have 2 characters"],
    max: [20, "username should be atmost have 20 characters"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please provide valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    min: [2, "password should atleast have 2 characters"],
    max: [20, "password should be atmost have 20 characters"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode:{
    type: String,
    required: [true, "verification code is required"],
    
  },
  verifyCodeExpiry:{
    type:Date,
    required:[true,'verificaiton code expiry is required']
  },
  premiumTaken:{
    type: Boolean,
    default: false,
  },
  loginStatus:{
    type:LoginStatusSchema,
    default:()=>({})
  }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User',UserSchema))

export default UserModel;
