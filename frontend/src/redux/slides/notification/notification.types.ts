export type NotificationType = "internal" | "urgent" | "event" | "policy";
export type NotificationPriority = "low" | "high";
export type NotificationStatus = "open" | "closed";
export type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";

export interface Attachment {
  filename: string;
  path: string;
  mimetype: string;
}

export interface Notification {
  _id: string;
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  is_pinned: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateNotificationDto {
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
  is_pinned: boolean;
  attachments?: File[];
}

export interface NotificationsState {
  items: Notification[];
  status: LoadingStatus;
  error: string | null;
  searchTerm: string;
  statusFilter: NotificationStatus | "all";
}
export interface NotificationDetail {
  id: string;
  title: string;
  content: string;
  type: "urgent" | "info" | "maintenance";
  priority: "high" | "low";
  status: "open" | "closed";
  is_pinned: "true" | "false";
  created_at: string;
  created_by: string;
  department: string;
  views: number;
  attachments: Attachment[];
}
