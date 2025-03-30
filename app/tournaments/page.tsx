"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, X, Plus, Search } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"

interface Torneio {
  id: number
  nome: string
  tipo: string
  dataInicio: string
  dataFim: string
  status: string
  maxParticipantes: number
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Torneio[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetch("http://localhost:8080/api/torneios")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((err) => console.error("Erro ao buscar torneios:", err))
  }, [])

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch = t.nome.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    const matchesType = typeFilter === "all" || t.tipo === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "AGENDADO":
        return <Badge variant="outline">Agendado</Badge>
      case "EM_ANDAMENTO":
        return <Badge variant="default">Em andamento</Badge>
      case "CONCLUIDO":
        return <Badge variant="secondary">Finalizado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getFriendlyType = (tipo: string) => {
    switch (tipo) {
      case "ELIMINATORIA_SIMPLES":
        return "Eliminação Simples"
      case "FASE_DE_GRUPOS":
        return "Fase de Grupos"
      default:
        return tipo
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader showButton={false} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Torneios</h2>
            <p className="text-muted-foreground">Gerencie todos os seus torneios em um só lugar</p>
          </div>
          <Button asChild>
            <Link href="/tournaments/create">
              <Plus className="mr-2 h-4 w-4" />
              Criar Torneio
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar torneios..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="AGENDADO">Agendado</SelectItem>
              <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
              <SelectItem value="CONCLUIDO">Finalizado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="ELIMINATORIA_SIMPLES">Eliminação Simples</SelectItem>
              <SelectItem value="FASE_DE_GRUPOS">Fase de Grupos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Datas</TableHead>
                <TableHead className="hidden md:table-cell">Participantes</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.nome}</TableCell>
                    <TableCell>{getFriendlyType(t.tipo)}</TableCell>
                    <TableCell>{getStatusBadge(t.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(t.dataInicio)} - {formatDate(t.dataFim)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{t.maxParticipantes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/tournaments/${t.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/tournaments/${t.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhum torneio encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}