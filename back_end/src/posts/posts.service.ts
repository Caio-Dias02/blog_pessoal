import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // Criar novo post
  async create(createPostDto: CreatePostDto) {
    const { tags, ...postData } = createPostDto;

    const post = await this.prisma.post.create({
      data: {
        ...postData,
        publishedAt: createPostDto.published ? new Date() : null,
        tags: tags ? {
          connectOrCreate: tags.map(tagName => ({
            where: { name: tagName },
            create: { 
              name: tagName, 
              slug: tagName.toLowerCase().replace(/\s+/g, '-') 
            }
          }))
        } : undefined
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return post;
  }

  // Buscar todos os posts
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          tags: {
            select: { id: true, name: true, slug: true }
          }
        }
      }),
      this.prisma.post.count()
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Buscar posts publicados
  async findPublished(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { published: true },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          tags: {
            select: { id: true, name: true, slug: true }
          }
        }
      }),
      this.prisma.post.count({ where: { published: true } })
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Buscar post por ID
  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true, bio: true }
        },
        category: {
          select: { id: true, name: true, slug: true, description: true }
        },
        tags: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Incrementar visualizações
    await this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return post;
  }

  // Buscar post por slug
  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true, bio: true }
        },
        category: {
          select: { id: true, name: true, slug: true, description: true }
        },
        tags: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    // Incrementar visualizações
    await this.prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    return post;
  }

  // Atualizar post
  async update(id: string, updatePostDto: UpdatePostDto) {
    const { tags, ...postData } = updatePostDto;

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        publishedAt: updatePostDto.published ? new Date() : null,
        tags: tags ? {
          set: [], // Remove todas as tags atuais
          connectOrCreate: tags.map(tagName => ({
            where: { name: tagName },
            create: { 
              name: tagName, 
              slug: tagName.toLowerCase().replace(/\s+/g, '-') 
            }
          }))
        } : undefined
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return post;
  }

  // Deletar post
  async remove(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.prisma.post.delete({
      where: { id }
    });

    return { message: 'Post deleted successfully' };
  }

  // Buscar posts por categoria
  async findByCategory(categoryId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { 
          categoryId,
          published: true 
        },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          tags: {
            select: { id: true, name: true, slug: true }
          }
        }
      }),
      this.prisma.post.count({ 
        where: { 
          categoryId,
          published: true 
        }
      })
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Buscar posts por tag
  async findByTag(tagId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { 
          tags: {
            some: { id: tagId }
          },
          published: true 
        },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          category: {
            select: { id: true, name: true, slug: true }
          },
          tags: {
            select: { id: true, name: true, slug: true }
          }
        }
      }),
      this.prisma.post.count({ 
        where: { 
          tags: {
            some: { id: tagId }
          },
          published: true 
        }
      })
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
} 