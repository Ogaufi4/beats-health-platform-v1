"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { useState } from "react"

interface ActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  actionLabel: string
  isLoading: boolean
  result?: {
    success: boolean
    title: string
    details: Record<string, string | number>
  }
  onAction: () => Promise<void>
  language?: "en" | "tn"
}

export function ActionModal({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  isLoading,
  result,
  onAction,
  language = "en",
}: ActionModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-600 mb-6">
                {language === "en" ? "Processing your request..." : "Go go rulaganya kopo ya gago..."}
              </p>
            </div>
            <Button onClick={onAction} disabled={isLoading} className="w-full">
              {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              {actionLabel}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  result.success ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {Object.entries(result.details).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{value}</span>
                    {typeof value === "string" && (value.includes("-") || value.includes("APT")) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(value.toString())}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className={`h-3 w-3 ${copied ? "text-green-600" : ""}`} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => onOpenChange(false)} className="w-full" variant="outline">
              {language === "en" ? "Close" : "Tswalela"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
