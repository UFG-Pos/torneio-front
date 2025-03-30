"use client"

import { z } from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
  tipo: z.string({ required_error: "Selecione um tipo de torneio" }),
  dataInicio: z.date({ required_error: "Data de início obrigatória" }),
  dataFim: z.date({ required_error: "Data de término obrigatória" }),
  maxParticipantes: z.coerce.number().min(2).max(128),
  numeroGrupos: z
    .union([
      z.coerce.number().min(2, { message: "Mínimo de 2 grupos" }),
      z.literal(null),
    ])
    .optional(),
})

type FormType = z.infer<typeof formSchema>

interface Props {
  data: FormType
  onChange: (data: FormType) => void
  onNext: () => void
}

export function TournamentStep1({ data, onChange, onNext }: Props) {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  })

  const tipoSelecionado = form.watch("tipo")

  function onSubmit(values: FormType) {
    // Se não for fase de grupos, zera o numeroGrupos
    if (values.tipo !== "FASE_DE_GRUPOS") {
      values.numeroGrupos = null
    }

    onChange(values)
    onNext()
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Informações do Torneio</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Desafio Valorant 2x2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ELIMINATORIA_SIMPLES">Eliminação Simples</SelectItem>
                    <SelectItem value="FASE_DE_GRUPOS">Fase de Grupos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {tipoSelecionado === "FASE_DE_GRUPOS" && (
            <FormField
              control={form.control}
              name="numeroGrupos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Grupos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""} // evitar warning de uncontrolled
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Selecione uma data</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar selected={field.value} onSelect={field.onChange} mode="single" initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataFim"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Término</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Selecione uma data</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar selected={field.value} onSelect={field.onChange} mode="single" initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="maxParticipantes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número Máximo de Participantes</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">Próximo</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}