import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash da senha para o usuário admin
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  // Criar usuário de teste
  const user = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {
      password: hashedPassword, // Forçar atualização da senha
    },
    create: {
      email: 'admin@blog.com',
      name: 'Admin Blog',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'Administrador do blog pessoal',
      avatar: 'https://blog-caio-dias.com/assets/profile.jpg',
    },
  });

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tecnologia' },
      update: {},
      create: {
        name: 'Tecnologia',
        slug: 'tecnologia',
        description: 'Posts sobre tecnologia e desenvolvimento',
        color: '#3B82F6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        description: 'Posts sobre React e desenvolvimento frontend',
        color: '#06B6D4',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'nodejs' },
      update: {},
      create: {
        name: 'Node.js',
        slug: 'nodejs',
        description: 'Posts sobre Node.js e backend',
        color: '#10B981',
      },
    }),
  ]);

  // Criar tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: {
        name: 'JavaScript',
        slug: 'javascript',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'nestjs' },
      update: {},
      create: {
        name: 'NestJS',
        slug: 'nestjs',
      },
    }),
  ]);

  // Criar posts iniciais
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'introducao-ao-react' },
      update: {},
      create: {
        title: 'Introdução ao React',
        slug: 'introducao-ao-react',
        excerpt: 'Aprenda os conceitos básicos do React de forma prática',
        content: `# Introdução ao React

React é uma biblioteca JavaScript para construir interfaces de usuário. Neste post, vamos explorar os conceitos fundamentais.

## Componentes

Os componentes são a base do React. Eles permitem dividir a UI em partes reutilizáveis.

\`\`\`jsx
function Welcome(props) {
  return <h1>Olá, {props.name}!</h1>;
}
\`\`\`

## Estado

O estado permite que os componentes tenham dados que podem mudar ao longo do tempo.

Este é um post introdutório para quem está começando com React.`,
        published: true,
        featured: true,
        image: 'https://via.placeholder.com/800x400/61DAFB/000000?text=React',
        readTime: 8,
        seoTitle: 'Introdução ao React - Aprenda os Básicos',
        seoDescription: 'Guia completo para iniciantes em React. Aprenda componentes, estado e muito mais.',
        publishedAt: new Date(),
        authorId: user.id,
        categoryId: categories[1].id, // React
        tags: {
          connect: [
            { id: tags[0].id }, // JavaScript
            { id: tags[2].id }, // React
          ],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: 'criando-api-com-nestjs' },
      update: {},
      create: {
        title: 'Criando API REST com NestJS',
        slug: 'criando-api-com-nestjs',
        excerpt: 'Passo a passo para criar uma API robusta com NestJS e TypeScript',
        content: `# Criando API REST com NestJS

NestJS é um framework progressivo para Node.js que utiliza TypeScript por padrão.

## Instalação

\`\`\`bash
npm i -g @nestjs/cli
nest new projeto-api
\`\`\`

## Controllers

Os controllers são responsáveis por lidar com as requisições HTTP.

\`\`\`typescript
@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return 'Todos os posts';
  }
}
\`\`\`

## Services

Os services contêm a lógica de negócio da aplicação.

Este post te ensina como criar APIs profissionais com NestJS.`,
        published: true,
        featured: false,
        image: 'https://via.placeholder.com/800x400/E0234E/FFFFFF?text=NestJS',
        readTime: 12,
        seoTitle: 'Como Criar API REST com NestJS e TypeScript',
        seoDescription: 'Tutorial completo para criar APIs robustas com NestJS, TypeScript e Prisma.',
        publishedAt: new Date(),
        authorId: user.id,
        categoryId: categories[2].id, // Node.js
        tags: {
          connect: [
            { id: tags[1].id }, // TypeScript
            { id: tags[3].id }, // NestJS
          ],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: 'typescript-para-iniciantes' },
      update: {},
      create: {
        title: 'TypeScript para Iniciantes',
        slug: 'typescript-para-iniciantes',
        excerpt: 'Descubra como TypeScript pode melhorar sua experiência com JavaScript',
        content: `# TypeScript para Iniciantes

TypeScript é um superset do JavaScript que adiciona tipagem estática.

## Por que usar TypeScript?

- ✅ Detecção de erros em tempo de compilação
- ✅ Melhor IntelliSense e autocompletar
- ✅ Refatoração mais segura
- ✅ Documentação automática

## Tipos Básicos

\`\`\`typescript
let nome: string = "João";
let idade: number = 30;
let ativo: boolean = true;
\`\`\`

## Interfaces

\`\`\`typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}
\`\`\`

TypeScript torna o desenvolvimento JavaScript mais produtivo e seguro.`,
        published: true,
        featured: true,
        image: 'https://via.placeholder.com/800x400/3178C6/FFFFFF?text=TypeScript',
        readTime: 10,
        seoTitle: 'TypeScript para Iniciantes - Guia Completo',
        seoDescription: 'Aprenda TypeScript do zero com exemplos práticos e dicas essenciais.',
        publishedAt: new Date(),
        authorId: user.id,
        categoryId: categories[0].id, // Tecnologia
        tags: {
          connect: [
            { id: tags[0].id }, // JavaScript
            { id: tags[1].id }, // TypeScript
          ],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: 'post-em-rascunho' },
      update: {},
      create: {
        title: 'Post em Rascunho',
        slug: 'post-em-rascunho',
        excerpt: 'Este é um post que ainda não foi publicado',
        content: `# Post em Rascunho

Este post ainda está sendo escrito e não foi publicado.

## Conteúdo em desenvolvimento

Aqui teremos mais conteúdo em breve...`,
        published: false, // Não publicado
        featured: false,
        readTime: 5,
        authorId: user.id,
        categoryId: categories[0].id, // Tecnologia
      },
    }),
  ]);

  console.log('✅ Seed executado com sucesso!');
  console.log(`👤 Usuário criado: ${user.email}`);
  console.log(`📚 Categorias: ${categories.length}`);
  console.log(`🏷️ Tags: ${tags.length}`);
  console.log(`📝 Posts: ${posts.length}`);
  console.log('\n🎯 IDs para testar:');
  console.log(`User ID: ${user.id}`);
  console.log(`Category IDs: ${categories.map(c => `${c.name}: ${c.id}`).join(', ')}`);
  console.log(`Tag IDs: ${tags.map(t => `${t.name}: ${t.id}`).join(', ')}`);
  console.log(`Post IDs: ${posts.map(p => `${p.title}: ${p.id}`).join(', ')}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 