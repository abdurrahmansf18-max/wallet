"use client"

import Link from "next/link"
import { Search, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function SearchDialog({ searchOpen, setSearchOpen, searchQuery, setSearchQuery, searchResults }) {
  const handleSearchClose = () => {
    setSearchOpen(false)
    setSearchQuery("")
  }

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Search
            {/* <Button variant="ghost" size="icon" onClick={handleSearchClose} className="h-6 w-6 rounded-full p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button> */}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for anything..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {searchQuery && (
            <div className="mt-4 space-y-4">
              <h4 className="text-sm font-medium">Results</h4>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                      <div>
                        <h5 className="text-sm font-medium">{result.title}</h5>
                        <p className="text-xs text-muted-foreground">{result.type}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={result.href}>
                          <span>View</span>
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
              )}
            </div>
          )}

          {!searchQuery && (
            <div className="mt-4 space-y-4">
              <h4 className="text-sm font-medium">Recent Searches</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Budget overview</p>
                <p className="text-sm text-muted-foreground">Savings account</p>
                <p className="text-sm text-muted-foreground">Monthly expenses</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
