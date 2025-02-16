import mongoose, { Schema, Document } from 'mongoose';

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['internal', 'urgent', 'event', 'policy'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'high'],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    is_pinned: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        type: String, // Lưu URL hoặc đường dẫn của file đính kèm
      },
    ],
  },
  {
    collection: 'notifications',
    timestamps: true,
  },
);

export const NotificationModel = mongoose.model(
  'Notification',
  NotificationSchema,
);
export { NotificationSchema };

export interface Notification extends Document {
  title: string;
  content: string;
  type: 'internal' | 'urgent' | 'event' | 'policy';
  priority: 'low' | 'high';
  status: 'open' | 'closed';
  is_pinned: boolean;
  attachments?: string[];
}
