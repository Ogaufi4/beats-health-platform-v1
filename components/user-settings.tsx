"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface UserSettingsProps {
  language: "en" | "tn"
  onLanguageChange: (lang: "en" | "tn") => void
}

export function UserSettings({ language, onLanguageChange }: UserSettingsProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const content = {
    en: {
      title: "User Settings",
      description: "Customize your dashboard preferences",
      language: "Language",
      theme: "Theme",
      timeFormat: "Time Format",
      autoRefresh: "Auto-refresh data",
      notifications: "Enable notifications",
      save: "Save Changes",
      cancel: "Cancel",
      light: "Light",
      dark: "Dark",
      english: "English",
      setswana: "Setswana",
    },
    tn: {
      title: "Ditlhophiso tsa Modirisi",
      description: "Fetola ditlhophiso tsa dashboard ya gago",
      language: "Puo",
      theme: "Mokhoa",
      timeFormat: "Fomete ya Nako",
      autoRefresh: "Ntšhwafatsa ka go itiragalela",
      notifications: "Kgontsha dikitsiso",
      save: "Boloka Diphetogo",
      cancel: "Khansela",
      light: "Lesedi",
      dark: "Lefifi",
      english: "Sekgoa",
      setswana: "Setswana",
    },
  }

  const t = content[language]

  const handleSave = () => {
    toast({
      title: language === "en" ? "Settings saved" : "Ditlhophiso di bolokilwe",
      description: language === "en" ? "Your preferences have been updated" : "Ditlhophiso tsa gago di ntšhwafaditswe",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>{t.language}</Label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t.english}</SelectItem>
                <SelectItem value="tn">{t.setswana}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.theme}</Label>
            <Select value={theme} onValueChange={(v: "light" | "dark") => setTheme(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t.light}</SelectItem>
                <SelectItem value="dark">{t.dark}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.timeFormat}</Label>
            <Select value={timeFormat} onValueChange={(v: "12h" | "24h") => setTimeFormat(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-refresh">{t.autoRefresh}</Label>
            <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">{t.notifications}</Label>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogTrigger asChild>
            <Button variant="outline">{t.cancel}</Button>
          </DialogTrigger>
          <Button onClick={handleSave}>{t.save}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
