"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return "alert alert-success";
      case "error":
        return "alert alert-error";
      case "info":
        return "alert alert-info";
      case "warning":
        return "alert alert-warning";
      default:
        return "alert alert-info";
    }
  };

  return (
    <div
      className={`toast toast-top toast-end z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className={getToastStyle()}>
        <span>{message}</span>
      </div>
    </div>
  );
}
