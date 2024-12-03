import mongoose, { Schema, Document, Types } from 'mongoose';

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, default: null },
    description: { type: String, default: null },
    projectCategory: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // References to User
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }], // References to Task
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
  members?: Types.ObjectId[];
  tasks?: Types.ObjectId[];
}
