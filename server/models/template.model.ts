import { Schema } from 'mongoose';
import * as mongoose from "mongoose";
import {TemplateI} from "../interfaces/template";

let templateSchema: Schema = new Schema({
  createdAt: Date,
  name: String,
  active: Boolean,
  desc: String,
});

templateSchema.pre("save", next => {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

interface TemplateModelI extends TemplateI, mongoose.Document{};

export let TemplateModel = mongoose.model<TemplateModelI>('Template', templateSchema);
