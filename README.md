# 🏟️ Torneios Frontend

Aplicação web para gerenciamento de torneios esportivos, desenvolvida em **Next.js** com **TypeScript** e **Tailwind CSS**. Esta interface permite que usuários visualizem torneios, equipes, jogadores, partidas e resultados, com uma experiência moderna e responsiva.

## 🌐 Funcionalidades

- Página inicial com resumo dos torneios e partidas
- Visualização detalhada dos torneios:
  - Informações básicas
  - Participantes e jogadores
  - Tabela de partidas (bracket)
  - Agendamento e resultados
- Atualização do placar das partidas
- Geração automática das partidas via botão

## 🛠️ Tecnologias Utilizadas

- [Next.js 15 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [ShadCN UI](https://ui.shadcn.dev/) (componentes)
- API: integração com backend Spring Boot

## 🧪 Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/UFG-Pos/torneio-front
cd torneios-frontend
```

2. Instale as dependências:

```bash
pnpm install
```

4. Rode o projeto localmente:

```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## 📂 Estrutura do Projeto

```bash
torneios-frontend/
├── app/               # App Router pages
│   └── tournaments/   # Listagem, criação, detalhes
├── components/        # Componentes reutilizáveis
├── styles/            # Estilos globais
├── lib/               # Funções utilitárias
├── public/            # Assets estáticos
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 📝 Autor

**João Pedro José Santos da Silva Guedes**  - Pós-Graduação em TI - Universidade Federal de Goiás (UFG)
