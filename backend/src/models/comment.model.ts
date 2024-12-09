import mongoose, { Schema, Document, Types } from 'mongoose';
import { User } from 'src/user/models/user.model';

const CommentSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' }, // Liên kết với Task
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Liên kết với User
    content: { type: String }, // Nội dung comment
  },
  {
    collection: 'comments',
    timestamps: true,
  },
);

export const CommentModel = mongoose.model('Comment', CommentSchema);

export { CommentSchema };

export interface Comment extends Document {
  taskId: Types.ObjectId; // ID của Task
  user: [User]; // ID của User
  content: string; // Nội dung comment
}
