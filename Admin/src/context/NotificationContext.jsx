import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, userId, isAdmin }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    // Register user
    newSocket.emit("register", { userId, isAdmin });

    // Listen for new orders (admin only)
    if (isAdmin) {
      newSocket.on("new_order", (orderData) => {
        // Create new notification with unique ID
        const newNotification = {
          id: Date.now() + Math.random(),
          ...orderData,
          read: false,
          timestamp: new Date().toISOString(),
        };

        // Add to notifications list
        setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50

        // Update unread count
        setUnreadCount((prev) => prev + 1);

        // Show toast notification
        toast.info(
          <div
            onClick={() =>
              (window.location.href = `/orders/${orderData.orderId}`)
            }
            className="cursor-pointer"
          >
            <strong>🛒 New Order!</strong>
            <p className="text-sm">
              ₵{orderData.amount} - {orderData.customerName}
            </p>
          </div>,
          {
            position: "top-right",
            autoClose: 8000,
            onClick: () =>
              (window.location.href = `/orders/${orderData.orderId}`),
          },
        );

        // Play sound (optional)
        try {
          new Audio("/notification.mp3").play();
        } catch (e) {
          console.log("Audio play failed:", e);
        }
      });
    }

    return () => {
      newSocket.disconnect();
    };
  }, [userId, isAdmin]);

  // ✅ Mark a single notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // ✅ Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // ✅ Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        socket,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
