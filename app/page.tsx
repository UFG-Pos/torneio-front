import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center">
      <div className="max-w-xl space-y-6">
        <div className="flex justify-center">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Bem-vindo ao Sistema de Gerenciamento de Torneios</h1>
        <p className="text-muted-foreground text-lg">
          Crie, gerencie e acompanhe torneios com facilidade. Cadastre participantes, acompanhe partidas e muito mais.
        </p>

        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/tournaments">Ver Torneios</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tournaments/create">Criar Novo Torneio</Link>
          </Button>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Dicas rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-left text-muted-foreground">
            <ul className="list-disc list-inside">
              <li>Use a aba "Torneios" para visualizar e editar seus torneios.</li>
              <li>Clique em um torneio para ver os participantes, partidas e resultados.</li>
              <li>Atualize o placar das partidas em tempo real pela aba "Chaveamento".</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}