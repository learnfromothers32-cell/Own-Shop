import React, { useState, useEffect, useRef } from "react";
import { useNotifications } from "../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    setIsOpen(false);
    markAsRead(notification.id);
    navigate(`/orders/${notification.orderId}`);
  };

  const handleClearNotification = (e, notificationId) => {
    e.stopPropagation(); // Prevent triggering the parent click
    clearNotification(notificationId);
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all notifications?")) {
      clearAllNotifications();
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/orders");
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center shadow-sm font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile overlay backdrop */}
            <div
              className="fixed inset-0 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className={`
                z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden
                /* Mobile: fixed, centered, nearly full-width */
                fixed left-3 right-3 top-[4.5rem]
                /* sm+: absolute, anchored to the bell */
                sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96
              `}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="Mark all as read"
                    >
                      Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Clear all notifications"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors ml-1"
                    aria-label="Close"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "min(24rem, 60vh)" }}
              >
                {notifications.length === 0 ? (
                  <div className="py-10 px-4 text-center text-gray-400">
                    <svg
                      className="w-10 h-10 mx-auto mb-3 opacity-30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No notifications yet
                    </p>
                    <p className="text-xs mt-1">New orders will appear here</p>
                  </div>
                ) : (
                  <>
                    {notifications.map((notif, index) => (
                      <motion.div
                        key={notif.id || index}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className={`relative group ${
                          !notif.read ? "bg-blue-50/60" : ""
                        }`}
                      >
                        {/* Delete button - appears on hover */}
                        <button
                          onClick={(e) => handleClearNotification(e, notif.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-red-50 hover:border-red-200 z-10"
                          title="Remove notification"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-gray-400 hover:text-red-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>

                        {/* Notification content */}
                        <div
                          onClick={() => handleNotificationClick(notif)}
                          className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">🛒</span>
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                              <p className="font-medium text-sm text-gray-800 truncate">
                                New Order #{notif.orderId?.slice(-6) || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                ₵{notif.amount} ·{" "}
                                {notif.customerName || "Customer"}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {notif.timestamp
                                  ? new Date(notif.timestamp).toLocaleString()
                                  : "Just now"}
                              </p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t bg-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {notifications.length} notification
                    {notifications.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={handleViewAll}
                    className="text-sm text-blue-600 hover:text-blue-800 py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    View All →
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
