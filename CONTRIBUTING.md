# 🤝 Contribuindo para o Blog Pessoal

Obrigado por seu interesse em contribuir para este projeto! Este documento fornece diretrizes para contribuições.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- Node.js 18+ instalado
- PostgreSQL configurado
- Git configurado
- Conhecimento básico de NestJS e React

## 🚀 Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/Caio-Dias02/blog_pessoal.git
cd blog_pessoal
```

### 2. Configure o backend
```bash
cd back_end
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### 3. Configure o frontend
```bash
cd front_end
npm install
npm run dev
```

## 🎯 Como Contribuir

### Reportando Bugs
1. Verifique se o bug já foi reportado nas issues
2. Crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)

### Sugerindo Melhorias
1. Abra uma issue com a tag "enhancement"
2. Descreva detalhadamente a melhoria
3. Explique o benefício da mudança

### Enviando Pull Requests

#### Fluxo de Trabalho
1. Fork o projeto
2. Crie uma branch para sua feature/fix:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. Faça commits seguindo o padrão:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```
4. Envie para seu fork:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. Abra um Pull Request

#### Padrões de Commit
Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

## 📝 Padrões de Código

### Backend (NestJS)
- Use TypeScript estrito
- Siga os princípios SOLID
- Implemente DTOs para validação
- Use decorators apropriados
- Mantenha controllers enxutos

### Frontend (React)
- Use hooks funcionais
- Implemente proper loading states
- Use TypeScript para tipagem
- Mantenha componentes pequenos e reutilizáveis
- Use TanStack Query para cache

### Geral
- Escreva testes para novas funcionalidades
- Use nomes descritivos para variáveis
- Documente código complexo
- Mantenha arquivos pequenos e focados

## 🧪 Testes

### Backend
```bash
cd back_end
npm run test        # Testes unitários
npm run test:e2e    # Testes end-to-end
npm run test:cov    # Cobertura de código
```

### Frontend
```bash
cd front_end
npm run test        # Testes unitários
```

## 📚 Estrutura do Projeto

### Backend
```
src/
├── auth/           # Autenticação
├── posts/          # Posts
├── categories/     # Categorias
├── tags/           # Tags
├── users/          # Usuários
└── prisma/         # Database
```

### Frontend
```
src/
├── components/     # Componentes
├── hooks/          # Hooks customizados
├── services/       # API client
├── routes/         # Páginas
└── types/          # TypeScript types
```

## 🎨 Checklist para Pull Requests

- [ ] Código segue os padrões estabelecidos
- [ ] Testes foram escritos/atualizados
- [ ] Documentação foi atualizada
- [ ] Commits seguem o padrão conventional
- [ ] Branch está atualizada com main
- [ ] CI/CD está passando
- [ ] Funcionalidade foi testada localmente

## 🆘 Precisa de Ajuda?

- Abra uma issue com a tag "question"
- Entre em contato: [caio.dias@email.com](mailto:caio.dias@email.com)
- GitHub: [@Caio-Dias02](https://github.com/Caio-Dias02)
- LinkedIn: [Caio Dias](https://linkedin.com/in/caio-dias)

## 📜 Código de Conduta

Este projeto adere ao [Contributor Covenant](https://www.contributor-covenant.org/). 
Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

---

Obrigado por contribuir! 🚀 