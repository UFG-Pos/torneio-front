// components/modals/UpdateMatchModal.tsx

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface Equipe {
  id: number
  nome: string
}

export interface Partida {
  id: number
  equipeA: Equipe
  equipeB: Equipe
  placarEquipeA: number | null
  placarEquipeB: number | null
}

interface Props {
  partida: Partida
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UpdateMatchModal({ partida, open, onClose, onSuccess }: Props) {
  const [placarA, setPlacarA] = useState(partida.placarEquipeA ?? 0)
  const [placarB, setPlacarB] = useState(partida.placarEquipeB ?? 0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/api/partidas/${partida.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placarEquipeA: placarA,
          placarEquipeB: placarB,
          status: "CONCLUIDA",
        }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar partida")

      toast({ title: "Resultado atualizado com sucesso!" })
      onClose()
      onSuccess?.()
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Resultado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>{partida.equipeA.nome}</span>
            <Input
              type="number"
              min={0}
              value={placarA}
              onChange={(e) => setPlacarA(Number(e.target.value))}
              className="w-16 text-center"
            />
          </div>
          <div className="flex justify-between items-center">
            <span>{partida.equipeB.nome}</span>
            <Input
              type="number"
              min={0}
              value={placarB}
              onChange={(e) => setPlacarB(Number(e.target.value))}
              className="w-16 text-center"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}