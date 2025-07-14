import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // POST /posts - Criar novo post
  @Post()
  @ApiOperation({
    summary: 'Criar novo post',
    description: 'Cria um novo post no blog',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Dados do novo post',
  })
  @ApiResponse({
    status: 201,
    description: 'Post criado com sucesso',
    example: {
      id: 'clm123abc456def789',
      title: 'Meu primeiro post sobre JavaScript',
      slug: 'meu-primeiro-post-javascript',
      excerpt: 'Este é um resumo do meu primeiro post sobre JavaScript...',
      content: 'JavaScript é uma linguagem de programação...',
      published: true,
      featured: false,
      image: 'https://blog-caio-dias.com/images/featured-post.jpg',
      readTime: 5,
      seoTitle: 'Guia Completo de JavaScript para Iniciantes',
      seoDescription: 'Aprenda JavaScript do zero com este guia completo e prático.',
      authorId: 'clm123abc456def789',
      categoryId: 'clm123abc456def789',
      tags: ['clm123abc456def789', 'clm987zyx654wvu321'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  // GET /posts - Buscar todos os posts (com paginação)
  @Get()
  @ApiOperation({
    summary: 'Buscar todos os posts',
    description: 'Retorna uma lista paginada de todos os posts',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de posts por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de posts retornada com sucesso',
    example: {
      posts: [
        {
          id: 'clm123abc456def789',
          title: 'Meu primeiro post sobre JavaScript',
          slug: 'meu-primeiro-post-javascript',
          excerpt: 'Este é um resumo do meu primeiro post sobre JavaScript...',
          published: true,
          featured: false,
          image: 'https://blog-caio-dias.com/images/featured-post.jpg',
          readTime: 5,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    },
  })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.postsService.findAll(+page, +limit);
  }

  // GET /posts/published - Buscar posts publicados (com paginação)
  @Get('published')
  @ApiOperation({
    summary: 'Buscar posts publicados',
    description: 'Retorna uma lista paginada de posts publicados',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de posts por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de posts publicados retornada com sucesso',
  })
  findPublished(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.postsService.findPublished(+page, +limit);
  }

  // GET /posts/slug/:slug - Buscar post por slug
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Buscar post por slug',
    description: 'Busca um post específico pelo seu slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug do post',
    example: 'meu-primeiro-post-javascript',
  })
  @ApiResponse({
    status: 200,
    description: 'Post encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Post não encontrado',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  // GET /posts/category/:categoryId - Buscar posts por categoria
  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Buscar posts por categoria',
    description: 'Retorna uma lista paginada de posts de uma categoria específica',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID da categoria',
    example: 'clm123abc456def789',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de posts por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de posts da categoria retornada com sucesso',
  })
  findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.postsService.findByCategory(categoryId, +page, +limit);
  }

  // GET /posts/tag/:tagId - Buscar posts por tag
  @Get('tag/:tagId')
  @ApiOperation({
    summary: 'Buscar posts por tag',
    description: 'Retorna uma lista paginada de posts de uma tag específica',
  })
  @ApiParam({
    name: 'tagId',
    description: 'ID da tag',
    example: 'clm123abc456def789',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de posts por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de posts da tag retornada com sucesso',
  })
  findByTag(
    @Param('tagId') tagId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.postsService.findByTag(tagId, +page, +limit);
  }

  // GET /posts/:id - Buscar post por ID
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar post por ID',
    description: 'Busca um post específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do post',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Post encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Post não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // PATCH /posts/:id - Atualizar post
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar post',
    description: 'Atualiza um post existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do post',
    example: 'clm123abc456def789',
  })
  @ApiBody({
    type: UpdatePostDto,
    description: 'Dados para atualização do post',
  })
  @ApiResponse({
    status: 200,
    description: 'Post atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Post não encontrado',
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  // DELETE /posts/:id - Deletar post
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar post',
    description: 'Remove um post do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do post',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Post não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
} 