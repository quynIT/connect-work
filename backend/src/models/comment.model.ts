import mongoose, { Schema, Document, Types } from 'mongoose';

const CommentSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' }, // Liên kết với Task
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Liên kết với User
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
  userId: Types.ObjectId; // ID của User
  content: string; // Nội dung comment
}
