import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

/**
 * Live order-status updates for the logged-in customer.
 *
 * - Connects once, joins a room keyed by userId.
 * - Calls `onStatus({ orderId, status })` for every update.
 * - Shows a toast + browser notification when enabled.
 */
const useOrderSocket = ({ onStatus } = {}) => {
  const { user, isAuthenticated } = useAuth();
  const handlerRef = useRef(onStatus);

  useEffect(() => {
    handlerRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join", user._id);
    });

    socket.on("order:status", (payload) => {
      handlerRef.current?.(payload);

      // Toast notification
      toast.success(`Your order status: ${payload.status}`);

      // Browser push notification
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification("QuickBite — Order Update", {
          body: `Your order status changed to: ${payload.status}`,
          icon: "/vite.svg",
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user?._id]);

  return null;
};

// Ask the browser for notification permission.
export const requestNotificationPermission = async () => {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export default useOrderSocket;
