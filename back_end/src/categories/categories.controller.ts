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
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // POST /categories - Criar nova categoria
  @Post()
  @ApiOperation({
    summary: 'Criar nova categoria',
    description: 'Cria uma nova categoria para organizar os posts',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Dados da nova categoria',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    example: {
      id: 'clm123abc456def789',
      name: 'JavaScript',
      slug: 'javascript',
      description: 'Artigos sobre JavaScript, React, Node.js e outras tecnologias relacionadas',
      color: '#3B82F6',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // GET /categories - Buscar todas as categorias
  @Get()
  @ApiOperation({
    summary: 'Buscar todas as categorias',
    description: 'Retorna uma lista de todas as categorias',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Artigos sobre JavaScript, React, Node.js e outras tecnologias relacionadas',
        color: '#3B82F6',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  // GET /categories/count - Buscar categorias com contagem de posts
  @Get('count')
  @ApiOperation({
    summary: 'Buscar categorias com contagem de posts',
    description: 'Retorna todas as categorias com o número de posts em cada uma',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias com contagem retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Artigos sobre JavaScript, React, Node.js e outras tecnologias relacionadas',
        color: '#3B82F6',
        _count: {
          posts: 5,
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findAllWithPostCount() {
    return this.categoriesService.findAllWithPostCount();
  }

  // GET /categories/popular - Buscar categorias mais populares
  @Get('popular')
  @ApiOperation({
    summary: 'Buscar categorias mais populares',
    description: 'Retorna as categorias com mais posts, ordenadas por popularidade',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de categorias a retornar',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias populares retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Artigos sobre JavaScript, React, Node.js e outras tecnologias relacionadas',
        color: '#3B82F6',
        _count: {
          posts: 15,
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findPopular(@Query('limit') limit: string = '10') {
    return this.categoriesService.findPopular(+limit);
  }

  // GET /categories/slug/:slug - Buscar categoria por slug
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Buscar categoria por slug',
    description: 'Busca uma categoria específica pelo seu slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug da categoria',
    example: 'javascript',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    example: {
      id: 'clm123abc456def789',
      name: 'JavaScript',
      slug: 'javascript',
      description: 'Artigos sobre JavaScript, React, Node.js e outras tecnologias relacionadas',
      color: '#3B82F6',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  // GET /categories/:id - Buscar categoria por ID
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar categoria por ID',
    description: 'Busca uma categoria específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // PATCH /categories/:id - Atualizar categoria
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar categoria',
    description: 'Atualiza uma categoria existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: 'clm123abc456def789',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Dados para atualização da categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // DELETE /categories/:id - Deletar categoria
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar categoria',
    description: 'Remove uma categoria do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
} 