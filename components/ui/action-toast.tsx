"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

export interface ActionToast {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

interface ActionToastContainerProps {
  toasts: ActionToast[]
  onClose: (id: string) => void
}

export function ActionToastContainer({ toasts, onClose }: ActionToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ActionToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

function ActionToastItem({
  toast,
  onClose,
}: {
  toast: ActionToast
  onClose: (id: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration ?? 3000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const isSuccess = toast.type === "success"

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg min-w-[280px] max-w-sm animate-in slide-in-from-right-4 ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-900"
          : "bg-red-50 border-red-200 text-red-900"
      }`}
    >
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        <p className="text-xs mt-0.5 opacity-80">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
