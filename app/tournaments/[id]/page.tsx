"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Users } from "lucide-react"
import { Partida, TournamentBracket } from "@/components/tournament-bracket"
import { Equipe, ParticipantsList } from "@/components/participants-list"
import { MatchSchedule } from "@/components/match-schedule"

interface Tournament {
  id: number
  nome: string
  tipo: string
  dataInicio: string
  dataFim: string
  maxParticipantes: number
  status: string
  numeroGrupos?: number
  partidas: Partida[]
  equipes: Equipe[]
}

export default function TournamentDetailsPage() {
  const { id } = useParams() as { id: string }
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8080/api/torneios/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTournament(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div>Carregando...</div>
  if (!tournament) return <div>Torneio não encontrado</div>

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return <Badge variant="default">Em andamento</Badge>
      case "upcoming":
        return <Badge variant="outline">Futuro</Badge>
      case "finished":
        return <Badge variant="secondary">Finalizado</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
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
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/tournaments">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div className="ml-4 flex-1">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold">{tournament.nome}</h1>
              <div className="ml-2">{getStatusBadge(tournament.status)}</div>
            </div>
            <p className="text-sm text-muted-foreground">
              {getFriendlyType(tournament.tipo)} • {formatDate(tournament.dataInicio)} - {formatDate(tournament.dataFim)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Máx. de Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tournament.maxParticipantes}</div>
            </CardContent>
          </Card>
          {tournament.tipo === "FASE_DE_GRUPOS" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Número de Grupos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tournament.numeroGrupos}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="bracket">
          <TabsList>
            <TabsTrigger value="bracket">Chaveamento</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="bracket" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Chaveamento do Torneio</CardTitle>
                <CardDescription>Progresso atual do torneio e confrontos</CardDescription>
              </CardHeader>
              <CardContent>
                <TournamentBracket partidas={tournament.partidas} torneioId={tournament.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Participantes Registrados</CardTitle>
                <CardDescription>Equipes e jogadores que estão neste torneio</CardDescription>
              </CardHeader>
              <CardContent>
                <ParticipantsList equipes={tournament.equipes} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Agenda de Partidas</CardTitle>
                <CardDescription>Próximas partidas e partidas passadas</CardDescription>
              </CardHeader>
              <CardContent>
                <MatchSchedule partidas={tournament.partidas} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Resultados do Torneio</CardTitle>
                <CardDescription>Placar das partidas e classificação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-6 text-center text-muted-foreground">
                    Os resultados serão exibidos conforme as partidas forem concluídas.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}