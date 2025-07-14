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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('tags')
@Controller('tags')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // POST /tags - Criar nova tag
  @Post()
  @ApiOperation({
    summary: 'Criar nova tag',
    description: 'Cria uma nova tag para marcar os posts',
  })
  @ApiBody({
    type: CreateTagDto,
    description: 'Dados da nova tag',
  })
  @ApiResponse({
    status: 201,
    description: 'Tag criada com sucesso',
    example: {
      id: 'clm123abc456def789',
      name: 'React',
      slug: 'react',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  // GET /tags - Buscar todas as tags
  @Get()
  @ApiOperation({
    summary: 'Buscar todas as tags',
    description: 'Retorna uma lista de todas as tags',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tags retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        name: 'React',
        slug: 'react',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findAll() {
    return this.tagsService.findAll();
  }

  // GET /tags/count - Buscar tags com contagem de posts
  @Get('count')
  @ApiOperation({
    summary: 'Buscar tags com contagem de posts',
    description: 'Retorna todas as tags com o número de posts em cada uma',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tags com contagem retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        name: 'React',
        slug: 'react',
        _count: {
          posts: 8,
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findAllWithPostCount() {
    return this.tagsService.findAllWithPostCount();
  }

  // GET /tags/popular - Buscar tags mais populares
  @Get('popular')
  @ApiOperation({
    summary: 'Buscar tags mais populares',
    description: 'Retorna as tags com mais posts, ordenadas por popularidade',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de tags a retornar',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tags populares retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        name: 'React',
        slug: 'react',
        _count: {
          posts: 15,
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findPopular(@Query('limit') limit: string = '10') {
    return this.tagsService.findPopular(+limit);
  }

  // GET /tags/search - Buscar tags por nome
  @Get('search')
  @ApiOperation({
    summary: 'Buscar tags por nome',
    description: 'Busca tags que correspondem ao termo de pesquisa',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Termo de pesquisa',
    example: 'react',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de tags a retornar',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tags encontradas com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        name: 'React',
        slug: 'react',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  search(
    @Query('q') query: string,
    @Query('limit') limit: string = '10'
  ) {
    return this.tagsService.search(query, +limit);
  }

  // GET /tags/slug/:slug - Buscar tag por slug
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Buscar tag por slug',
    description: 'Busca uma tag específica pelo seu slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug da tag',
    example: 'react',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag encontrada com sucesso',
    example: {
      id: 'clm123abc456def789',
      name: 'React',
      slug: 'react',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tag não encontrada',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.tagsService.findBySlug(slug);
  }

  // GET /tags/:id - Buscar tag por ID
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar tag por ID',
    description: 'Busca uma tag específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da tag',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tag não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  // PATCH /tags/:id - Atualizar tag
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar tag',
    description: 'Atualiza uma tag existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da tag',
    example: 'clm123abc456def789',
  })
  @ApiBody({
    type: UpdateTagDto,
    description: 'Dados para atualização da tag',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tag não encontrada',
  })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  // DELETE /tags/:id - Deletar tag
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar tag',
    description: 'Remove uma tag do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da tag',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tag não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
} 