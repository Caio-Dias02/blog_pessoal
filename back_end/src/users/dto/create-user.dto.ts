import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'caio@email.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Caio Dias',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'Role do usuário no sistema',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;

  @ApiPropertyOptional({
    description: 'URL do avatar do usuário',
    example: 'https://blog-caio-dias.com/assets/profile.jpg',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Biografia do usuário',
    example: 'Desenvolvedor fullstack apaixonado por tecnologia',
  })
  @IsString()
  @IsOptional()
  bio?: string;
} 