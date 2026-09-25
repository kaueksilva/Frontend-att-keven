# Professor Allocation App 🎓

Sistema web responsivo para alocação de professores e disciplinas, desenvolvido como projeto de avaliação para a cadeira de Front-end da Fafire.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Funcionalidades

O sistema possui um CRUD (Criar, Ler, Atualizar, Deletar) completo com validações e proteção de consistência de dados para as seguintes entidades:

- **Departamentos:** Cadastro das áreas acadêmicas (ex: Tecnologia, Humanas, Saúde).
- **Cursos:** Criação de cursos universitários.
- **Professores:** Cadastro do corpo docente. O CPF inclui máscara visual (`000.000.000-00`) automática.
- **Alocações:** Planejamento e organização de qual professor irá lecionar qual curso, informando o dia da semana e as horas de início e término.

### Validações de Sistema
- Impede a criação de Departamentos ou Cursos duplicados.
- Impede o cadastro de Professores com CPFs já existentes e verifica se contém 11 dígitos.
- Avaliação de choque de horário nas Alocações: impede a marcação de aulas sobrepostas para o mesmo professor num determinado dia e bloqueia horários inválidos (Ex: Término antes do Início).
- Modal nativo e elegante (shadcn/ui) solicitando confirmação de ações destrutivas como Excluir.
- Notificações de falha ou sucesso no canto da tela.

## 🚀 Tecnologias e UI

A interface foi projetada visando minimalismo e modernidade, abandonando bibliotecas legadas e adotando as abordagens mais novas de estilização front-end:

- **React + Vite:** Framework de interface e bundler de alta velocidade.
- **Tailwind CSS v3:** Para uma estilização via classes utilitárias completamente responsiva para desktop e mobile.
- **shadcn/ui & Radix UI:** Componentes sem estilização forçada e completamente acessíveis (A11y). Os Modais, Botões, Tabelas, Inputs, Notificações Toast e Cards são construídos e personalizados a partir da base Radix e Tailwind.
- **Lucide React:** Para os ícones de interface limpos e legíveis.
- **json-server:** Simulando uma Fake API REST com persistência de dados em arquivo local para agilizar as chamadas via **Axios**.

## 💻 Como Rodar o Projeto

1. Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em seu ambiente (idealmente versão 20.x ou superior).
2. Faça o clone do repositório.
3. Instale as dependências executando na raiz:
   ```bash
   npm install
   ```
4. Execute o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
5. O comando irá subir a simulação do backend (`json-server`) paralelamente à interface gráfica (`Vite`).
6. Abra `http://localhost:5173` no seu navegador para utilizar o sistema. O menu lateral vai te guiar em todos os recursos.

## 👤 Avaliação
Projeto elaborado para a avaliação exigida pelo professor **Keven Leone**, utilizando a estrutura backend / API sugerida no curso.
