import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Título do post',
    example: 'Meu primeiro post sobre JavaScript',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Slug único do post para URL',
    example: 'meu-primeiro-post-javascript',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    description: 'Resumo do post',
    example: 'Este é um resumo do meu primeiro post sobre JavaScript...',
  })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({
    description: 'Conteúdo completo do post',
    example: 'JavaScript é uma linguagem de programação...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Se o post está publicado',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean = false;

  @ApiPropertyOptional({
    description: 'Se o post é destacado',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  featured?: boolean = false;

  @ApiPropertyOptional({
    description: 'URL da imagem do post',
    example: 'https://blog-caio-dias.com/images/featured-post.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Tempo de leitura em minutos',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  readTime?: number;

  @ApiPropertyOptional({
    description: 'Título para SEO',
    example: 'Guia Completo de JavaScript para Iniciantes',
  })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({
    description: 'Descrição para SEO',
    example: 'Aprenda JavaScript do zero com este guia completo e prático.',
  })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiProperty({
    description: 'ID do autor do post',
    example: 'clm123abc456def789',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    description: 'ID da categoria do post',
    example: 'clm123abc456def789',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Lista de IDs das tags do post',
    example: ['clm123abc456def789', 'clm987zyx654wvu321'],
    type: [String],
  })
  @IsOptional()
  tags?: string[];
} 