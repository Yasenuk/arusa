type NotificationType = "success" | "error" | "info" | "warning";

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

type ContextType = {
  notify: (message: string, type?: NotificationType) => void;
};

export type { Notification, NotificationType, ContextType };