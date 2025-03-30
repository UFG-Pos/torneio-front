"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock } from "lucide-react"
import { Partida } from "./tournament-bracket"

interface Equipe {
  id: number
  nome: string
}


interface MatchScheduleProps {
  partidas: Partida[]
}

export function MatchSchedule({ partidas }: MatchScheduleProps) {
  const [filter, setFilter] = useState("all")

  const filteredMatches =
    filter === "all"
      ? partidas
      : partidas.filter((p) =>
          filter === "scheduled" ? p.status === "AGENDADA" : p.status === "CONCLUIDA"
        )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONCLUIDA":
        return <Badge variant="secondary">Concluída</Badge>
      case "AGENDADA":
        return <Badge variant="outline">Agendada</Badge>
      default:
        return null
    }
  }

  const formatDate = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleDateString()
  }

  const formatTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredMatches.length} partidas
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar partidas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="scheduled">Agendadas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partida</TableHead>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <div className="font-medium">
                    {match.equipeA.nome} vs {match.equipeB.nome}
                  </div>
                  {match.status === "CONCLUIDA" && (
                    <div className="text-sm text-muted-foreground">
                      {match.placarEquipeA} - {match.placarEquipeB}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(match.horario)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatTime(match.horario)}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(match.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}