"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { UpdateMatchModal } from "@/components/modals/UpdateMatchModal"

interface Equipe {
  id: number
  nome: string
}

export interface Partida {
  id: number
  horario: string
  equipeA: Equipe
  equipeB: Equipe
  placarEquipeA: number | null
  placarEquipeB: number | null
  status: string // "AGENDADA" | "CONCLUIDA"
  fase: string
}

interface TournamentBracketProps {
  partidas: Partida[]
  torneioId: number
}

export function TournamentBracket({ partidas, torneioId }: TournamentBracketProps) {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPartida, setSelectedPartida] = useState<Partida | null>(null)

  const partidasPorFase: Record<string, Partida[]> = {}
  partidas.forEach((partida) => {
    const fase = partida.fase || "RODADA_UNICA"
    if (!partidasPorFase[fase]) {
      partidasPorFase[fase] = []
    }
    partidasPorFase[fase].push(partida)
  })

  // 🧠 Define peso para ordenar as fases de forma lógica
  const fasePeso: Record<string, number> = {
    GRUPOS: 1,
    OITAVAS_DE_FINAL: 2,
    QUARTAS_DE_FINAL: 3,
    SEMIFINAL: 4,
    FINAL: 5,
  }

  const fasesOrdenadas = Object.keys(partidasPorFase).sort(
    (a, b) => (fasePeso[a] ?? 99) - (fasePeso[b] ?? 99)
  )

  const partidasGeradas = partidas.length > 0

  const openModal = (partida: Partida) => {
    setSelectedPartida(partida)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedPartida(null)
  }

  const gerarChave = async () => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:8080/api/torneios/${torneioId}/gerar-partidas`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Erro ao gerar partidas")

      toast({ title: "Partidas geradas com sucesso!" })
      window.location.reload()
    } catch (err: any) {
      toast({
        title: "Erro ao gerar partidas",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatFase = (fase: string) => {
    switch (fase) {
      case "GRUPOS":
        return "Fase de Grupos"
      case "OITAVAS_DE_FINAL":
        return "Oitavas de Final"
      case "QUARTAS_DE_FINAL":
        return "Quartas de Final"
      case "SEMIFINAL":
        return "Semifinal"
      case "FINAL":
        return "Final"
      default:
        return fase
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!partidasGeradas && (
        <div className="text-center">
          <Button onClick={gerarChave} disabled={loading}>
            {loading ? "Gerando..." : "Gerar Chave de Partidas"}
          </Button>
        </div>
      )}

      <div className="flex gap-6 overflow-x-auto pb-4">
        {fasesOrdenadas.map((fase) => (
          <div key={fase} className="flex flex-col gap-4 min-w-[250px]">
            <div className="text-sm font-semibold text-center">{formatFase(fase)}</div>
            {partidasPorFase[fase]?.map((p) => {
              const date = new Date(p.horario)
              return (
                <Card key={p.id} className="p-3 border flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{p.equipeA.nome}</span>
                    <span className="font-bold">{p.placarEquipeA ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{p.equipeB.nome}</span>
                    <span className="font-bold">{p.placarEquipeB ?? "-"}</span>
                  </div>
                  <div className="mt-1 text-xs text-center text-muted-foreground">
                    {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="text-center text-xs font-semibold">
                    {p.status === "CONCLUIDA" ? (
                      <span className="text-green-500">✅ Concluída</span>
                    ) : (
                      <span className="text-yellow-500">⏳ Agendada</span>
                    )}
                  </div>

                  {p.status === "AGENDADA" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => openModal(p)}
                    >
                      Atualizar Resultado
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>
        ))}
      </div>

      {selectedPartida && (
        <UpdateMatchModal
          partida={selectedPartida}
          open={modalOpen}
          onClose={closeModal}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  )
}