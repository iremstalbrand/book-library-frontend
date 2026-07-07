import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => setMessage(""), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-60 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto bg-surface dark:bg-dark-surface text-ink dark:text-cream text-sm font-medium px-4 py-3 rounded-lg shadow-lg border border-muted/10 transition-colors">
            {message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
