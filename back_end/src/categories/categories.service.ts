import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Criar nova categoria
  async create(createCategoryDto: CreateCategoryDto) {
    // Verificar se nome já existe
    const existingByName = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name }
    });

    if (existingByName) {
      throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists`);
    }

    // Verificar se slug já existe
    const existingBySlug = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug }
    });

    if (existingBySlug) {
      throw new ConflictException(`Category with slug "${createCategoryDto.slug}" already exists`);
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
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

    return category;
  }

  // Buscar todas as categorias
  async findAll() {
    const categories = await this.prisma.category.findMany({
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

    return categories;
  }

  // Buscar categorias com contagem de posts
  async findAllWithPostCount() {
    const categories = await this.prisma.category.findMany({
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

    return categories.map(category => ({
      ...category,
      postCount: category._count.posts
    }));
  }

  // Buscar categoria por ID
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
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
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  // Buscar categoria por slug
  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
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
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  // Atualizar categoria
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Verificar se categoria existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Verificar se nome já existe em outra categoria
    if (updateCategoryDto.name) {
      const existingByName = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name }
      });

      if (existingByName && existingByName.id !== id) {
        throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists`);
      }
    }

    // Verificar se slug já existe em outra categoria
    if (updateCategoryDto.slug) {
      const existingBySlug = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug }
      });

      if (existingBySlug && existingBySlug.id !== id) {
        throw new ConflictException(`Category with slug "${updateCategoryDto.slug}" already exists`);
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
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

    return category;
  }

  // Deletar categoria
  async remove(id: string) {
    // Verificar se categoria existe
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        posts: true
      }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Verificar se categoria possui posts
    if (category.posts.length > 0) {
      throw new ConflictException(`Cannot delete category "${category.name}" because it has ${category.posts.length} posts associated with it`);
    }

    await this.prisma.category.delete({
      where: { id }
    });

    return { message: 'Category deleted successfully' };
  }

  // Buscar categorias mais populares
  async findPopular(limit: number = 10) {
    const categories = await this.prisma.category.findMany({
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

    return categories.map(category => ({
      ...category,
      postCount: category._count.posts
    }));
  }
} 