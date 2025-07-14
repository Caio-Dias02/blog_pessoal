# 📝 Blog Pessoal - Projeto Full Stack

Um blog pessoal moderno e profissional desenvolvido com **NestJS** no backend e **React** no frontend, demonstrando boas práticas de desenvolvimento, arquitetura limpa e integração completa entre tecnologias.

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js para aplicações escaláveis
- **TypeScript** - Linguagem tipada para maior robustez
- **Prisma** - ORM moderno para banco de dados
- **JWT** - Autenticação e autorização segura
- **Swagger** - Documentação automática da API
- **PostgreSQL** - Banco de dados relacional

### Frontend  
- **React 18** - Biblioteca para interfaces de usuário
- **TanStack Query** - Gerenciamento de estado servidor
- **TanStack Router** - Roteamento type-safe
- **Shadcn UI** - Componentes modernos e acessíveis
- **Zod** - Validação de esquemas TypeScript
- **Vite** - Build tool moderna e rápida

### DevOps & Ferramentas
- **Docker** - Containerização da aplicação
- **ESLint** - Padronização de código
- **TypeScript** - Tipagem estática
- **Git** - Controle de versão

## 🏗️ Arquitetura do Projeto

### Backend (NestJS)
```
src/
├── auth/           # Autenticação e autorização
├── posts/          # Gerenciamento de posts
├── categories/     # Sistema de categorias
├── tags/           # Sistema de tags
├── users/          # Gerenciamento de usuários
└── prisma/         # Configuração do banco
```

### Frontend (React)
```
src/
├── components/     # Componentes reutilizáveis
├── hooks/          # Hooks customizados
├── services/       # Cliente de API
├── routes/         # Páginas e roteamento
├── types/          # Definições TypeScript
└── lib/            # Configurações e utilitários
```

## ⚡ Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- Login/logout com JWT
- Controle de permissões por roles (Admin, Moderator, User)
- Proteção de rotas
- Persistência de sessão

### 📚 **Gerenciamento de Posts**
- CRUD completo de posts
- Sistema de categorias e tags
- Paginação otimizada
- Filtros de busca
- Cache inteligente

### 🎨 **Interface Moderna**
- Design responsivo e acessível
- Componentes reutilizáveis
- Estados de loading e error
- Navegação intuitiva

### 📊 **Performance e Qualidade**
- Cache com TanStack Query
- Otimistic updates
- Error boundaries
- Validação de dados com Zod

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Backend
```bash
cd back_end
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd front_end
npm install
npm run dev
```

### Com Docker
```bash
docker-compose up -d
```

## 📖 Documentação da API

A API está completamente documentada com Swagger e pode ser acessada em:
```
http://localhost:3001/api
```

### Principais Endpoints

#### 🔐 Autenticação
- `POST /auth/login` - Login do usuário
- `GET /auth/profile` - Perfil do usuário logado
- `POST /auth/logout` - Logout

#### 📝 Posts
- `GET /posts` - Listar posts (com paginação)
- `POST /posts` - Criar novo post
- `GET /posts/:id` - Detalhes do post
- `PUT /posts/:id` - Atualizar post
- `DELETE /posts/:id` - Deletar post

#### 🏷️ Categorias & Tags
- `GET /categories` - Listar categorias
- `GET /tags` - Listar tags
- CRUD completo para ambos

## 🎯 Destaques Técnicos

### **Backend NestJS**
- Arquitetura modular e escalável
- Injeção de dependências
- Guards para autenticação
- DTOs com validação
- Interceptors para logging
- Exception filters customizados

### **Frontend React**
- Hooks customizados para lógica de negócio
- Context API para estado global
- Error boundaries para tratamento de erros
- Lazy loading de componentes
- Otimização de re-renders

### **Integração & Performance**
- Client HTTP tipado
- Cache inteligente com invalidação
- Debounce em buscas
- Paginação otimizada
- Tratamento de erros consistente

## 🔄 Fluxo de Desenvolvimento

1. **Planejamento** - Definição de requisitos e arquitetura
2. **Backend** - Desenvolvimento da API com NestJS
3. **Banco de Dados** - Modelagem com Prisma
4. **Autenticação** - Sistema JWT completo
5. **Frontend** - Interface React moderna
6. **Integração** - Conexão frontend-backend
7. **Documentação** - Swagger e README
8. **Deploy** - Preparação para produção

## 🎨 Demonstração das Habilidades

Este projeto demonstra:

- ✅ **Arquitetura limpa** e separação de responsabilidades
- ✅ **Boas práticas** de desenvolvimento
- ✅ **Código tipado** e bem documentado
- ✅ **Testes** e validação de dados
- ✅ **Performance** e otimização
- ✅ **Experiência do usuário** moderna
- ✅ **Integração** frontend-backend completa

## 🤝 Contribuição

Projeto desenvolvido como demonstração de habilidades técnicas em desenvolvimento Full Stack com foco em:
- Desenvolvimento Backend com NestJS
- APIs RESTful robustas
- Autenticação e segurança
- Integração frontend-backend
- Boas práticas de código

---

**Desenvolvido por [Caio Dias](https://github.com/Caio-Dias02)**  
*Back-end Developer | Node.js | NestJS | PHP | PostgreSQL | React | TypeScript*

### 👨‍💻 **Sobre o Desenvolvedor**
Desenvolvedor Back-end apaixonado por tecnologia, focado em construir APIs robustas, escaláveis e seguras. Atualmente estudando arquitetura de software, testes automatizados e boas práticas com TypeScript e NestJS.

**Tecnologias de domínio:**
- **Backend**: Node.js, NestJS, PHP
- **Frontend**: React, TypeScript, HTML, CSS  
- **Database**: PostgreSQL, MySQL
- **Tools**: Docker, Git, Postman, WordPress

📍 **Localização**: Cordeirópolis - SP  
🔗 **GitHub**: [@Caio-Dias02](https://github.com/Caio-Dias02)  
💼 **LinkedIn**: [Caio Dias](https://www.linkedin.com/in/caio-dias-755494204/) 
