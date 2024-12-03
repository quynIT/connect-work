import mongoose, { Schema, Document, Types } from 'mongoose';

const TaskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    dueDate: { type: Date, default: null }, // Trường để lưu các comment liên quan
  },
  {
    collection: 'tasks',
    timestamps: true,
  },
);

export const TaskModel = mongoose.model('Task', TaskSchema); // Register Task model
export { TaskSchema };

export interface Task extends Document {
  name: string;
  description?: string;
  projectId: Types.ObjectId;
  assignedTo: Types.ObjectId[];
  status: string;
  dueDate?: Date;
}
