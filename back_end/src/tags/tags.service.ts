import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  // Criar nova tag
  async create(createTagDto: CreateTagDto) {
    // Verificar se nome já existe
    const existingByName = await this.prisma.tag.findUnique({
      where: { name: createTagDto.name }
    });

    if (existingByName) {
      throw new ConflictException(`Tag with name "${createTagDto.name}" already exists`);
    }

    // Verificar se slug já existe
    const existingBySlug = await this.prisma.tag.findUnique({
      where: { slug: createTagDto.slug }
    });

    if (existingBySlug) {
      throw new ConflictException(`Tag with slug "${createTagDto.slug}" already exists`);
    }

    const tag = await this.prisma.tag.create({
      data: createTagDto,
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true
          }
        }
      }
    });

    return tag;
  }

  // Buscar todas as tags
  async findAll() {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true
          }
        }
      }
    });

    return tags;
  }

  // Buscar tags com contagem de posts
  async findAllWithPostCount() {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            posts: {
              where: { published: true }
            }
          }
        }
      }
    });

    return tags.map(tag => ({
      ...tag,
      postCount: tag._count.posts
    }));
  }

  // Buscar tag por ID
  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            published: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  // Buscar tag por slug
  async findBySlug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { published: true },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            published: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return tag;
  }

  // Atualizar tag
  async update(id: string, updateTagDto: UpdateTagDto) {
    // Verificar se tag existe
    const existingTag = await this.prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    // Verificar se nome já existe em outra tag
    if (updateTagDto.name) {
      const existingByName = await this.prisma.tag.findUnique({
        where: { name: updateTagDto.name }
      });

      if (existingByName && existingByName.id !== id) {
        throw new ConflictException(`Tag with name "${updateTagDto.name}" already exists`);
      }
    }

    // Verificar se slug já existe em outra tag
    if (updateTagDto.slug) {
      const existingBySlug = await this.prisma.tag.findUnique({
        where: { slug: updateTagDto.slug }
      });

      if (existingBySlug && existingBySlug.id !== id) {
        throw new ConflictException(`Tag with slug "${updateTagDto.slug}" already exists`);
      }
    }

    const tag = await this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true
          }
        }
      }
    });

    return tag;
  }

  // Deletar tag
  async remove(id: string) {
    // Verificar se tag existe
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        posts: true
      }
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    // Verificar se tag possui posts (apenas aviso, não bloqueia)
    if (tag.posts.length > 0) {
      console.warn(`Tag "${tag.name}" has ${tag.posts.length} posts associated. Removing tag from posts...`);
    }

    await this.prisma.tag.delete({
      where: { id }
    });

    return { message: 'Tag deleted successfully' };
  }

  // Buscar tags mais populares
  async findPopular(limit: number = 10) {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: { published: true }
            }
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      },
      take: limit
    });

    return tags.map(tag => ({
      ...tag,
      postCount: tag._count.posts
    }));
  }

  // Buscar tags por nome (busca parcial)
  async search(query: string, limit: number = 10) {
    const tags = await this.prisma.tag.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            slug: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        _count: {
          select: {
            posts: {
              where: { published: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' },
      take: limit
    });

    return tags.map(tag => ({
      ...tag,
      postCount: tag._count.posts
    }));
  }

  // Criar ou encontrar tag (usado internamente pelos posts)
  async findOrCreate(name: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const existingTag = await this.prisma.tag.findUnique({
      where: { name }
    });

    if (existingTag) {
      return existingTag;
    }

    return this.prisma.tag.create({
      data: { name, slug }
    });
  }
} 