"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface RefreshIndicatorProps {
  onRefresh: () => Promise<void>
  autoRefreshInterval?: number
  language: "en" | "tn"
}

export function RefreshIndicator({ onRefresh, autoRefreshInterval = 30000, language }: RefreshIndicatorProps) {
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeAgo, setTimeAgo] = useState("")

  const content = {
    en: {
      refresh: "Refresh",
      lastUpdated: "Last updated",
      justNow: "just now",
      minutesAgo: "minutes ago",
      refreshing: "Refreshing...",
    },
    tn: {
      refresh: "Ntšhwafatsa",
      lastUpdated: "Ntšhwafaditsweng la bofelo",
      justNow: "jaanong fela",
      minutesAgo: "metsotso e fetileng",
      refreshing: "E ntšhwafatsa...",
    },
  }

  const t = content[language]

  useEffect(() => {
    const updateTimeAgo = () => {
      const diff = Date.now() - lastRefresh.getTime()
      const minutes = Math.floor(diff / 60000)

      if (minutes < 1) {
        setTimeAgo(t.justNow)
      } else {
        setTimeAgo(`${minutes} ${t.minutesAgo}`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 10000)
    return () => clearInterval(interval)
  }, [lastRefresh, t])

  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const interval = setInterval(async () => {
        await handleRefresh()
      }, autoRefreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefreshInterval])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
      setLastRefresh(new Date())
      toast({
        title: language === "en" ? "Data refreshed" : "Data e ntšhwafaditswe",
        description: language === "en" ? "Latest data loaded successfully" : "Data e ntšha e lokile",
      })
    } catch (error) {
      toast({
        title: language === "en" ? "Refresh failed" : "Ntšhwafatso ga e a ka ya tsamaya",
        description: language === "en" ? "Please try again" : "Leka gape",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">
        {t.lastUpdated}: {timeAgo}
      </span>
      <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        <span className="ml-2">{isRefreshing ? t.refreshing : t.refresh}</span>
      </Button>
    </div>
  )
}
