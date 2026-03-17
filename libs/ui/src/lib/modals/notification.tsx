import React, { createContext, useContext, useState, useCallback } from "react";
import { ContextType, Notification, NotificationType } from "@org/shared-types";

import styles from "../../styles/components/notification.module.scss";

const NotificationContext = createContext<ContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  let id = 0;

  const remove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notify = useCallback((message: string, type: NotificationType = "info") => {
    const newNotification = { id: ++id, message, type };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => remove(newNotification.id), 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationContainer notifications={notifications} remove={remove} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({
  notifications,
  remove,
}: {
  notifications: any[];
  remove: (id: number) => void;
}) => {
  return (
    <div className={styles.notification__container}>
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`${styles.notification__toast} ${styles[`notification__${n.type}`]}`}
          onClick={() => remove(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification має бути використаний всередині NotificationProvider");
  return ctx;
}

export default { NotificationProvider, useNotification };