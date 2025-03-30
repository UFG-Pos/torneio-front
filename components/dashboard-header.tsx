import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader( {showButton = true} ) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 md:px-8">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        {showButton && <div className="ml-auto flex items-center space-x-4">
          <Button asChild>
            <Link href="/tournaments/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Tournament
            </Link>
          </Button>
        </div>}
      </div>
    </div>
  )
}

