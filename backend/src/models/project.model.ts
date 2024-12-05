import mongoose, { Schema, Document, Types } from 'mongoose';
import { User } from 'src/user/models/user.model';

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, default: null },
    description: { type: String, default: null },
    projectCategory: { type: String, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }], // References to User
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }], // References to Task
    createdBy: { type: String, required: true },
  },
  {
    collection: 'projects',
    timestamps: true,
  },
);

export const ProjectModel = mongoose.model('Project', ProjectSchema); // Register Project model
export { ProjectSchema };
export interface Project extends Document {
  name: string;
  url?: string;
  description?: string;
  projectCategory: string;
  user?: [User];
  tasks?: Types.ObjectId[];
  createdBy: string;
}
