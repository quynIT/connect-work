import mongoose, { Schema, Document } from 'mongoose';
import { User } from 'src/user/models/user.model';

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, default: null },
    description: { type: String, default: null },
    projectCategory: { type: String, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: String, required: true },
  },
  {
    collection: 'projects',
    timestamps: true,
  },
);

export const ProjectModel = mongoose.model('Project', ProjectSchema);
export { ProjectSchema };
export interface Project extends Document {
  name: string;
  url?: string;
  description?: string;
  projectCategory: string;
  user?: [User];
  createdBy: string;
}
