import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Classe para documentar resposta de login
class LoginResponse {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    example: {
      id: 1,
      email: 'caio@email.com',
      name: 'Caio Dias',
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// Classe para documentar resposta de perfil
class ProfileResponse {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Caio Dias',
  })
  name: string;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;
}

// Classe para documentar resposta de logout
class LogoutResponse {
  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Logout realizado com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp da operação',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica um usuário com email e senha, retornando um token JWT',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Dados de login do usuário',
    examples: {
              'Login bem-sucedido': {
        value: {
          email: 'usuario@email.com',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponse,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        email: 'caio@email.com',
        name: 'Caio Dias',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    example: {
      message: 'Email ou senha incorretos',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    example: {
      message: ['Email deve ter um formato válido', 'Senha deve ter pelo menos 6 caracteres'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obter perfil do usuário',
    description: 'Retorna os dados do usuário autenticado usando o token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
    type: ProfileResponse,
    example: {
      id: 1,
      email: 'caio@email.com',
      name: 'Caio Dias',
      createdAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou expirado',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Realizar logout',
    description: 'Invalida a sessão do usuário (o cliente deve remover o token)',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
    type: LogoutResponse,
    example: {
      message: 'Logout realizado com sucesso',
      timestamp: '2024-01-15T10:30:00Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou expirado',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  async logout() {
    // No lado do servidor, não precisamos fazer nada específico
    // O cliente deve remover o token do lado dele
    return {
      message: 'Logout realizado com sucesso',
      timestamp: new Date().toISOString(),
    };
  }
} 