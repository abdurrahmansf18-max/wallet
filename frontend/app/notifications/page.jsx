"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notificationApi } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const data = await notificationApi.getAll()
				setNotifications(data)
			} catch (error) {
				console.error("Failed to fetch notifications:", error)
			} finally {
				setLoading(false)
			}
		}
		fetchNotifications()
	}, [])

	const handleMarkAllAsRead = async () => {
		try {
			await notificationApi.markAllAsRead()
			setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
		} catch (error) {
			console.error("Failed to mark all as read:", error)
		}
	}

	const handleMarkAsRead = async (id, isRead) => {
		if (isRead) return
		try {
			await notificationApi.markAsRead(id)
			setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
		} catch (error) {
			console.error("Failed to mark as read:", error)
		}
	}

	const renderList = (filterPath) => {
		let list = notifications
		if (filterPath === "unread") {
			list = notifications.filter(n => !n.is_read)
		} else if (filterPath === "alerts") {
			list = notifications.filter(n => n.type === "warning" || n.type === "error" || n.type === "info") // Approximate category
		} else if (filterPath === "transactions") {
			list = notifications.filter(n => n.type === "success")
		}

		if (loading) {
			return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
		}

		if (list.length === 0) {
			return <div className="text-center p-8 text-muted-foreground">No notifications found.</div>
		}

		return (
			<div className="space-y-4">
				{list.map((notification) => (
					<div
						key={notification.id}
						className={`relative rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50 ${!notification.is_read ? 'bg-muted/40 font-semibold' : 'bg-background'}`}
						onClick={() => handleMarkAsRead(notification.id, notification.is_read)}
					>
						{!notification.is_read && <div className="absolute left-2 top-4 h-2 w-2 rounded-full bg-blue-500" />}
						<div className="pl-4">
							<div className="mb-1 flex items-center justify-between">
								<h3 className="font-medium">{notification.title}</h3>
								<span className="text-xs text-muted-foreground">
									{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								{notification.message}
							</p>
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<Layout>
			<div>
				<div className="mb-4 sm:mb-6">
					<h1 className="text-xl sm:text-2xl font-semibold">Notifications</h1>
					<p className="text-muted-foreground text-sm">Stay updated with your account activity.</p>
				</div>

				<div className="mx-auto max-w-4xl">
					<Card>
						<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-0">
							<div>
								<CardTitle>Your Notifications</CardTitle>
								<CardDescription>Stay updated with your account activity.</CardDescription>
							</div>
							<Button variant="outline" size="sm" className="mt-2 sm:mt-0" onClick={handleMarkAllAsRead}>
								Mark All as Read
							</Button>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="all">
								<TabsList className="mb-4 sm:mb-6 w-full overflow-x-auto flex-nowrap">
									<TabsTrigger value="all">All</TabsTrigger>
									<TabsTrigger value="unread">Unread</TabsTrigger>
									<TabsTrigger value="transactions">Transactions</TabsTrigger>
									<TabsTrigger value="alerts">Alerts</TabsTrigger>
								</TabsList>

								<TabsContent value="all">{renderList("all")}</TabsContent>
								<TabsContent value="unread">{renderList("unread")}</TabsContent>
								<TabsContent value="transactions">{renderList("transactions")}</TabsContent>
								<TabsContent value="alerts">{renderList("alerts")}</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	)
}
