"use client"

import Link from "next/link"
import { Bell, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { notificationApi } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getAll({ limit: 5 })
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground/60 hover:text-foreground hidden sm:flex"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">You have {unreadCount} unread notifications</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
           <div className="flex justify-center p-4">
             <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
           </div>
        ) : notifications.length === 0 ? (
          <div className="flex justify-center p-4">
             <p className="text-sm text-muted-foreground">No recent notifications</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className="flex flex-col items-start p-0 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault()
                handleMarkAsRead(notification.id, notification.is_read)
              }}
            >
              <div className={`w-full p-2 ${notification.is_read ? 'opacity-60' : 'bg-muted/50'}`}>
                <div className="flex justify-between w-full">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full cursor-pointer justify-center">
          <Link href="/notifications" className="flex items-center justify-center">
            <span className="text-sm">View all notifications</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
