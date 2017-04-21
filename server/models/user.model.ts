
import {UserI} from "../interfaces/user";
import * as mongoose from "mongoose";
let userSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  password: String,
  role: String,
  email: String,
  date: Date,
});

userSchema.pre("save", next => {
  if (!this.date) {
    this.date = new Date();
  }
  next();
});

export interface UserModelI extends UserI, mongoose.Document{};

export let UserModel = mongoose.model<UserModelI>('User', userSchema);
