import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Nome da tag',
    example: 'React',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Slug único da tag para URL',
    example: 'react',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
} 