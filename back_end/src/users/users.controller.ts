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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users - Criar novo usuário
  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados do novo usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    example: {
      id: 'clm123abc456def789',
      email: 'caio@email.com',
      name: 'Caio Dias',
      role: 'USER',
      avatar: 'https://blog-caio-dias.com/assets/profile.jpg',
      bio: 'Desenvolvedor fullstack apaixonado por tecnologia',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // GET /users - Buscar todos os usuários
  @Get()
  @ApiOperation({
    summary: 'Buscar todos os usuários',
    description: 'Retorna uma lista de todos os usuários',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        email: 'caio@email.com',
        name: 'Caio Dias',
        role: 'USER',
        avatar: 'https://blog-caio-dias.com/assets/profile.jpg',
        bio: 'Desenvolvedor fullstack apaixonado por tecnologia',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/stats - Estatísticas de usuários
  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas de usuários',
    description: 'Retorna estatísticas gerais dos usuários',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    example: {
      totalUsers: 150,
      totalAdmins: 5,
      totalModerators: 10,
      totalRegularUsers: 135,
      recentUsers: 25,
    },
  })
  getStats() {
    return this.usersService.getStats();
  }

  // GET /users/active - Usuários mais ativos
  @Get('active')
  @ApiOperation({
    summary: 'Usuários mais ativos',
    description: 'Retorna os usuários que mais criaram posts',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de usuários a retornar',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários ativos retornada com sucesso',
    example: [
      {
        id: 'clm123abc456def789',
        email: 'caio@email.com',
        name: 'Caio Dias',
        role: 'USER',
        avatar: 'https://blog-caio-dias.com/assets/profile.jpg',
        bio: 'Desenvolvedor fullstack apaixonado por tecnologia',
        _count: {
          posts: 25,
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  findMostActive(@Query('limit') limit: string = '10') {
    return this.usersService.findMostActive(+limit);
  }

  // GET /users/role/:role - Buscar usuários por role
  @Get('role/:role')
  @ApiOperation({
    summary: 'Buscar usuários por role',
    description: 'Retorna usuários com um role específico',
  })
  @ApiParam({
    name: 'role',
    description: 'Role do usuário',
    example: 'USER',
    enum: ['USER', 'ADMIN', 'MODERATOR'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários com o role especificado retornada com sucesso',
  })
  findByRole(@Param('role') role: string) {
    return this.usersService.findByRole(role);
  }

  // GET /users/:id - Buscar usuário por ID
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Busca um usuário específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    example: {
      id: 'clm123abc456def789',
      email: 'caio@email.com',
      name: 'Caio Dias',
      role: 'USER',
      avatar: 'https://blog-caio-dias.com/assets/profile.jpg',
      bio: 'Desenvolvedor fullstack apaixonado por tecnologia',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // PATCH /users/:id - Atualizar usuário
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: 'clm123abc456def789',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados para atualização do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // PATCH /users/:id/password - Alterar senha
  @Patch(':id/password')
  @ApiOperation({
    summary: 'Alterar senha do usuário',
    description: 'Altera a senha de um usuário existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: 'clm123abc456def789',
  })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Dados para alteração da senha',
  })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
    example: {
      message: 'Senha alterada com sucesso',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Senha atual incorreta',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  // DELETE /users/:id - Deletar usuário
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar usuário',
    description: 'Remove um usuário do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: 'clm123abc456def789',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
} 