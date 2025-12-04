import React, { createContext, useState, useCallback } from "react";

export const ToastContext = createContext({ showToast: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", timeout = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", right: 20, top: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              marginBottom: 8,
              minWidth: 240,
              padding: "10px 14px",
              borderRadius: 8,
              color: "white",
              background: t.type === "error" ? "#e53e3e" : t.type === "success" ? "#2f855a" : "#2b6cb0",
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            }}
          >
            {t.message}
            <button
              onClick={() => removeToast(t.id)}
              style={{
                marginLeft: 12,
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                float: "right",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
