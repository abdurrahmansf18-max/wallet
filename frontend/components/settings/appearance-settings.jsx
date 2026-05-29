"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

export function AppearanceSettings() {
  const { toast } = useToast()
  const { setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    theme: "system",
    ui_animations: true,
    compact_mode: false,
    large_text: false,
    ui_layout: "default",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = await authApi.getCurrentUser()
        const fetchedSettings = {
          theme: user.theme ?? "system",
          ui_animations: user.ui_animations ?? true,
          compact_mode: user.compact_mode ?? false,
          large_text: user.large_text ?? false,
          ui_layout: user.ui_layout ?? "default",
        }
        setSettings(fetchedSettings)
        
        // Settings yÃ¼klendiÄŸinde mevcut ayarlarÄ± UI'a yedir
        setTheme(fetchedSettings.theme)
        
        const html = document.documentElement
        html.classList.toggle("disable-animations", !fetchedSettings.ui_animations)
        html.classList.toggle("compact-mode", fetchedSettings.compact_mode)
        html.classList.toggle("large-text", fetchedSettings.large_text)
        html.setAttribute("data-layout", fetchedSettings.ui_layout)

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load appearance settings.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [toast, setTheme])

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleValueChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await authApi.updateProfile(settings)
      toast({
        title: "Success",
        description: "Appearance preferences updated successfully.",
      })
      
      // Theme'i sistemde doÄŸrudan uygula (next-themes kullanarak)
      setTheme(settings.theme)
      
      // DiÄŸer ayarlarÄ± global olarak deÄŸiÅŸtirmek iÃ§in HTML elementine class ekle/Ã§Ä±kar
      const html = document.documentElement
      html.classList.toggle("disable-animations", !settings.ui_animations)
      html.classList.toggle("compact-mode", settings.compact_mode)
      html.classList.toggle("large-text", settings.large_text)
      
      html.setAttribute("data-layout", settings.ui_layout)

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appearance preferences.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">Appearance</h3>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Theme</Label>
        <RadioGroup 
          value={settings.theme} 
          onValueChange={(value) => handleValueChange('theme', value)}
          className="grid grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light" className="text-sm">Light</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark" className="text-sm">Dark</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <RadioGroupItem value="system" id="theme-system" />
            <Label htmlFor="theme-system" className="text-sm">System</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="my-2" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="animations" className="text-sm">Animations</Label>
          <Switch 
            id="animations" 
            checked={settings.ui_animations}
            onCheckedChange={() => handleToggle('ui_animations')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="compact-mode" className="text-sm">Compact Mode</Label>
          <Switch 
            id="compact-mode" 
            checked={settings.compact_mode}
            onCheckedChange={() => handleToggle('compact_mode')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="large-text" className="text-sm">Large Text</Label>
          <Switch 
            id="large-text" 
            checked={settings.large_text}
            onCheckedChange={() => handleToggle('large_text')}  
          />
        </div>
      </div>

      <Separator className="my-2" />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Layout</Label>
        <RadioGroup 
          value={settings.ui_layout} 
          onValueChange={(value) => handleValueChange('ui_layout', value)}
          className="grid grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <RadioGroupItem value="default" id="layout-default" />
            <Label htmlFor="layout-default" className="text-sm">Default</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <RadioGroupItem value="compact" id="layout-compact" />
            <Label htmlFor="layout-compact" className="text-sm">Compact</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-2">
            <RadioGroupItem value="expanded" id="layout-expanded" />
            <Label htmlFor="layout-expanded" className="text-sm">Expanded</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-2">
        <Button size="sm" className="w-full" onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  )
}
