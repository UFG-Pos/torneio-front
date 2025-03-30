"use client"

interface Jogador {
  id: number
  nome: string
}

export interface Equipe {
  id: number
  nome: string
  grupo: string | null
  jogadores: Jogador[]
}

interface ParticipantsListProps {
  equipes: Equipe[]
}

export function ParticipantsList({ equipes }: ParticipantsListProps) {
  // Agrupar equipes por grupo
  const equipesPorGrupo: Record<string, Equipe[]> = {}

  equipes.forEach((equipe) => {
    const grupo = equipe.grupo || "Sem Grupo"
    if (!equipesPorGrupo[grupo]) {
      equipesPorGrupo[grupo] = []
    }
    equipesPorGrupo[grupo].push(equipe)
  })

  return (
    <div className="space-y-6">
      {Object.entries(equipesPorGrupo).map(([grupo, equipes]) => (
        <div key={grupo}>
          <h3 className="text-lg font-semibold mb-2">{grupo}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipes.map((equipe) => (
              <div key={equipe.id} className="rounded-md border p-4">
                <h4 className="text-md font-medium">{equipe.nome}</h4>
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                  {equipe.jogadores?.map((jogador) => (
                    <li key={jogador.id}>{jogador.nome}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}