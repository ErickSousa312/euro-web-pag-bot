"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {  useToast as toastMUI } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "../../shared/context/AuthContext/AuthProvider";
import { useToast as toastCustom } from "../../shared/context/ToastContext";


interface Curso {
  id: number
  nome: string
  duracao: string
  diasSemana: string[]
  valor: number
  horario: string
  incluiEstagio: boolean
  materialIncluso: boolean
  possuiColacaoGrau: boolean
  descricao: string
}

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

export default function CursoTecnicoCRUD() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [cursoAtual, setCursoAtual] = useState<Curso | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { addToast } = toastCustom()
  const { toast } = toastMUI()
  const { logout } = useAuth()

  // const handleLogin = (username: string, password: string) => {
  //   if (username === "admin" && password === "password") {
  //     setIsAuthenticated(true)
  //     toast({
  //       title: "Login bem-sucedido",
  //       description: "Bem-vindo ao sistema de gerenciamento de cursos técnicos.",
  //     })
  //   }
  // }

  const handleLogout = () => {
    setIsAuthenticated(false)
    addToast({
      type: "success",
      message: "Você saiu do sistema com sucesso.",
    })
    logout()

  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const novoCurso = {
      id: cursoAtual ? cursoAtual.id : Date.now(),
      nome: formData.get("nome") as string,
      duracao: formData.get("duracao") as string,
      diasSemana: diasSemana.filter((dia) => formData.get(dia) === "on"),
      valor: Number.parseFloat(formData.get("valor") as string),
      horario: formData.get("horario") as string,
      incluiEstagio: formData.get("incluiEstagio") === "on",
      materialIncluso: formData.get("materialIncluso") === "on",
      possuiColacaoGrau: formData.get("possuiColacaoGrau") === "on",
      descricao: formData.get("descricao") as string,
    }

    if (cursoAtual) {
      setCursos(cursos.map((c) => (c.id === cursoAtual.id ? novoCurso : c)))
      toast({
        title: "Curso atualizado",
        description: `O curso ${novoCurso.nome} foi atualizado com sucesso.`,
      })
    } else {
      setCursos([...cursos, novoCurso])
      toast({
        title: "Curso adicionado",
        description: `O curso ${novoCurso.nome} foi adicionado com sucesso.`,
      })
    }

    setCursoAtual(null)
    e.currentTarget.reset()
  }

  const editarCurso = (curso: Curso) => {
    setCursoAtual(curso)
  }

  const deletarCurso = (id: number) => {
    setCursos(cursos.filter((c) => c.id !== id))
    toast({
      title: "Curso deletado",
      description: "O curso foi removido com sucesso.",
      variant: "destructive",
    })
  }

  // if (!isAuthenticated) {
  //   return <Login onLogin={handleLogin} />
  // }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Cursos Técnicos</h1>
        <Button onClick={handleLogout}>Sair</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="nome">Nome do Curso</Label>
          <Input id="nome" name="nome" defaultValue={cursoAtual?.nome} required />
        </div>
        <div>
          <Label htmlFor="duracao">Duração</Label>
          <Input id="duracao" name="duracao" defaultValue={cursoAtual?.duracao} required />
        </div>
        <div>
          <Label>Dias da Semana</Label>
          <div className="grid grid-cols-4 gap-2">
            {diasSemana.map((dia) => (
              <div key={dia} className="flex items-center space-x-2">
                <input type="checkbox" id={dia} name={dia} defaultChecked={cursoAtual?.diasSemana.includes(dia)} />
                <Label htmlFor={dia}>{dia}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="valor">Valor</Label>
          <Input id="valor" name="valor" type="number" step="0.01" defaultValue={cursoAtual?.valor} required />
        </div>
        <div>
          <Label htmlFor="horario">Horário</Label>
          <Input id="horario" name="horario" defaultValue={cursoAtual?.horario} required />
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="incluiEstagio" name="incluiEstagio" defaultChecked={cursoAtual?.incluiEstagio} />
          <Label htmlFor="incluiEstagio">Inclui Estágio</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="materialIncluso"
            name="materialIncluso"
            defaultChecked={cursoAtual?.materialIncluso}
          />
          <Label htmlFor="materialIncluso">Material Incluso</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="possuiColacaoGrau"
            name="possuiColacaoGrau"
            defaultChecked={cursoAtual?.possuiColacaoGrau}
          />
          <Label htmlFor="possuiColacaoGrau">Possui Colação de Grau</Label>
        </div>
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea id="descricao" name="descricao" defaultValue={cursoAtual?.descricao} required />
        </div>
        <Button type="submit">{cursoAtual ? "Atualizar Curso" : "Adicionar Curso"}</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Dias da Semana</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Inclui Estágio</TableHead>
            <TableHead>Material Incluso</TableHead>
            <TableHead>Colação de Grau</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cursos.map((curso) => (
            <TableRow key={curso.id}>
              <TableCell>{curso.nome}</TableCell>
              <TableCell>{curso.duracao}</TableCell>
              <TableCell>{curso.diasSemana.join(", ")}</TableCell>
              <TableCell>{curso.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
              <TableCell>{curso.horario}</TableCell>
              <TableCell>{curso.incluiEstagio ? "Sim" : "Não"}</TableCell>
              <TableCell>{curso.materialIncluso ? "Sim" : "Não"}</TableCell>
              <TableCell>{curso.possuiColacaoGrau ? "Sim" : "Não"}</TableCell>
              <TableCell>{curso.descricao}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => editarCurso(curso)} className="mr-2">
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => deletarCurso(curso.id)}>
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  )
}

