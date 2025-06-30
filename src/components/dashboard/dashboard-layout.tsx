"use client"
import { useState } from "react"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { DashboardContent } from "./dashboard-content"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ModeToggle } from "../mode-toggle"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">Filters</h1>
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <FilterSidebar />
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:static lg:inset-y-0 lg:left-0 lg:z-50 lg:w-80 bg-card border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">Filters</h1>
            <ModeToggle />
          </div>
          <div className="flex-1 overflow-hidden">
            <FilterSidebar />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 p-4 border-b lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Visualization Dashboard</h1>
        </div>
        <div className="flex-1 overflow-auto">
          <DashboardContent />
        </div>
      </div>
    </div>
  )
}
