"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

interface Jogador {
  nome: string
}

interface Equipe {
  nome: string
  jogadores: Jogador[]
}

interface Props {
  equipes: Equipe[]
  onChange: (equipes: Equipe[]) => void
  onNext: () => void
  onBack: () => void
}

export function TournamentStep2({ equipes, onChange, onNext, onBack }: Props) {
  const [nomeEquipe, setNomeEquipe] = useState("")
  const [nomesJogadores, setNomesJogadores] = useState(["", ""])

  const adicionarEquipe = () => {
    if (!nomeEquipe.trim() || nomesJogadores.some((j) => !j.trim())) return

    const novaEquipe: Equipe = {
      nome: nomeEquipe.trim(),
      jogadores: nomesJogadores.map((nome) => ({ nome: nome.trim() })),
    }

    onChange([...equipes, novaEquipe])
    setNomeEquipe("")
    setNomesJogadores(["", ""])
  }

  const removerEquipe = (index: number) => {
    const novaLista = equipes.filter((_, i) => i !== index)
    onChange(novaLista)
  }

  const atualizarJogador = (index: number, valor: string) => {
    const novosJogadores = [...nomesJogadores]
    novosJogadores[index] = valor
    setNomesJogadores(novosJogadores)
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Cadastro de Equipes</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nova Equipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nome da Equipe"
            value={nomeEquipe}
            onChange={(e) => setNomeEquipe(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nomesJogadores.map((nome, idx) => (
              <Input
                key={idx}
                placeholder={`Jogador ${idx + 1}`}
                value={nome}
                onChange={(e) => atualizarJogador(idx, e.target.value)}
              />
            ))}
          </div>
          <Button type="button" onClick={adicionarEquipe}>
            Adicionar Equipe
          </Button>
        </CardContent>
      </Card>

      {equipes.length > 0 && (
        <div className="space-y-4">
          {equipes.map((equipe, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{equipe.nome}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removerEquipe(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-sm text-muted-foreground">
                  {equipe.jogadores.map((jogador, i) => (
                    <li key={i}>{jogador.nome}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext} disabled={equipes.length === 0}>
          Próximo
        </Button>
      </div>
    </div>
  )
}