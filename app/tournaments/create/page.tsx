"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { TournamentStep1 } from "@/components/step1-tournament"
import { TournamentStep2 } from "@/components/step2-teams"
import axios from "axios"

interface Jogador {
  nome: string
}

interface Equipe {
  nome: string
  jogadores: Jogador[]
}

interface TournamentData {
  nome: string
  tipo: string
  dataInicio: Date
  dataFim: Date
  maxParticipantes: number
}

export default function CreateTournamentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [tournamentData, setTournamentData] = useState<TournamentData>({
    nome: "",
    tipo: "",
    dataInicio: new Date(),
    dataFim: new Date(),
    maxParticipantes: 8,
  })
  const [equipes, setEquipes] = useState<Equipe[]>([])

  const goToNextStep = () => setCurrentStep((prev) => prev + 1)
  const goToPrevStep = () => setCurrentStep((prev) => prev - 1)

  const handleFinish = async () => {
    try {
      // 1. Criar o torneio
      const response = await axios.post("http://localhost:8080/api/torneios", {
        ...tournamentData,
      })

      const torneioId = response.data.id

      // 2. Criar equipes e jogadores
      for (const equipe of equipes) {
        const equipeResponse = await axios.post("http://localhost:8080/api/equipes", {
          nome: equipe.nome,
          torneioId,
        })

        const equipeId = equipeResponse.data.id

        for (const jogador of equipe.jogadores) {
          await axios.post("http://localhost:8080/api/jogadores", {
            nome: jogador.nome,
            equipeId,
          })
        }
      }

      router.push(`/tournaments/${torneioId}`)
    } catch (error) {
      console.error("Erro ao criar torneio:", error)
      alert("Erro ao criar torneio. Verifique os dados e tente novamente.")
    }
  }

  return (
    <>
      {currentStep === 1 && (
        <TournamentStep1
          data={tournamentData}
          onNext={goToNextStep}
          onChange={setTournamentData}
        />
      )}
      {currentStep === 2 && (
        <TournamentStep2
          equipes={equipes}
          onNext={handleFinish}
          onBack={goToPrevStep}
          onChange={setEquipes}
        />
      )}
    </>
  )
}