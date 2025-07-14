import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'JavaScript',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Slug único da categoria para URL',
    example: 'javascript',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Artigos sobre JavaScript, React, Node.js e outras tecnologias relacionadas',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Cor da categoria em hexadecimal',
    example: '#3B82F6',
  })
  @IsString()
  @IsOptional()
  color?: string;
} 