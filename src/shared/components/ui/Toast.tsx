"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

interface ToastMessage {
    id: number;
    text: string;
}

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, text: message }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDone={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onDone }: { toast: ToastMessage; onDone: (id: number) => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDone(toast.id), 300);
        }, 2500);
        return () => clearTimeout(timer);
    }, [toast.id, onDone]);

    return (
        <div
            className={`pointer-events-auto px-6 py-3 bg-foreground text-tactile-light font-bold text-sm uppercase tracking-wider border-[2px] border-foreground hard-shadow transition-all duration-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
            {toast.text}
        </div>
    );
}
