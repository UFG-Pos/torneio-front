"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, X } from "lucide-react"
import Link from "next/link"

type TournamentStatus = "ongoing" | "upcoming" | "finished"

interface TournamentTableProps {
  status: TournamentStatus
}

export function TournamentTable({ status }: TournamentTableProps) {
  // Mock data - in a real app, this would come from an API
  const tournaments = [
    {
      id: "1",
      name: "Summer Cup 2023",
      type: "Single Elimination",
      startDate: "2023-06-15",
      endDate: "2023-06-30",
      status: "ongoing",
      participants: 16,
    },
    {
      id: "2",
      name: "Winter Championship",
      type: "Double Elimination",
      startDate: "2023-12-01",
      endDate: "2023-12-15",
      status: "upcoming",
      participants: 32,
    },
    {
      id: "3",
      name: "Spring Tournament",
      type: "Group Stage",
      startDate: "2023-03-10",
      endDate: "2023-03-25",
      status: "finished",
      participants: 24,
    },
    {
      id: "4",
      name: "Fall Classic",
      type: "Single Elimination",
      startDate: "2023-09-05",
      endDate: "2023-09-20",
      status: "ongoing",
      participants: 8,
    },
    {
      id: "5",
      name: "Regional Qualifier",
      type: "Double Elimination",
      startDate: "2023-08-01",
      endDate: "2023-08-10",
      status: "finished",
      participants: 16,
    },
  ].filter((t) => t.status === status)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Badge variant="default">Ongoing</Badge>
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>
      case "finished":
        return <Badge variant="secondary">Finished</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="hidden md:table-cell">Dates</TableHead>
          <TableHead className="hidden md:table-cell">Participants</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell className="font-medium">
                {tournament.name}
                <div className="md:hidden mt-1">{getStatusBadge(tournament.status)}</div>
              </TableCell>
              <TableCell>{tournament.type}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
              </TableCell>
              <TableCell className="hidden md:table-cell">{tournament.participants}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/tournaments/${tournament.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/tournaments/${tournament.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
              No {status} tournaments found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

