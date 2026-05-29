"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { NavigationItems } from "./navigation-items"
import { QuickActions } from "./quick-actions"
import { UserProfile } from "./user-profile"

export function MobileSidebar({ isMobileOpen, setIsMobileOpen, direction = "ltr" }) {
  return (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen} side="left">
      <SheetContent side="left" className="p-0 w-[280px]">
        <div className="flex h-16 shrink-0 items-center border-b px-4">
          <div className="flex items-center justify-between w-full">
            <Logo onClick={() => setIsMobileOpen(false)} />
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-65px)]">
          <ScrollArea className="flex-1">
            <div className="px-3 py-4">
              <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">MAIN NAVIGATION</h2>
              <NavigationItems
                onClick={() => setIsMobileOpen(false)}
                isCollapsed={false}
                mobile={true}
                direction={direction}
              />
            </div>

            <div className="px-3 py-4">
              <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">QUICK ACTIONS</h2>
              <QuickActions mobile={true} onItemClick={() => setIsMobileOpen(false)} isCollapsed={false} />
            </div>
          </ScrollArea>

          <div className="mt-auto border-t p-3">
            <UserProfile mobile={true} isCollapsed={false} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
