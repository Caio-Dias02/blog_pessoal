import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Hash da senha
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verificar senha
  private async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Criar novo usuário
  async create(createUserDto: CreateUserDto) {
    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException(`User with email "${createUserDto.email}" already exists`);
    }

    // Hash da senha
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar senha
      }
    });

    return user;
  }

  // Buscar todos os usuários
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar senha
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return users;
  }

  // Buscar usuário por ID
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar senha
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            published: true,
            featured: true,
            views: true,
            likes: true,
            createdAt: true,
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

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Buscar usuário por email (usado para autenticação)
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      // Incluir senha apenas para autenticação
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return user;
  }

  // Atualizar usuário
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Verificar se usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verificar se email já existe em outro usuário
    if (updateUserDto.email) {
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email }
      });

      if (existingByEmail && existingByEmail.id !== id) {
        throw new ConflictException(`User with email "${updateUserDto.email}" already exists`);
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar senha
      }
    });

    return user;
  }

  // Alterar senha
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    // Buscar usuário com senha
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verificar senha atual
    const isValidPassword = await this.validatePassword(changePasswordDto.currentPassword, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash da nova senha
    const hashedNewPassword = await this.hashPassword(changePasswordDto.newPassword);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword
      }
    });

    return { message: 'Password changed successfully' };
  }

  // Deletar usuário
  async remove(id: string) {
    // Verificar se usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verificar se usuário possui posts
    if (user.posts.length > 0) {
      throw new ConflictException(`Cannot delete user "${user.name}" because they have ${user.posts.length} posts. Please transfer or delete posts first.`);
    }

    await this.prisma.user.delete({
      where: { id }
    });

    return { message: 'User deleted successfully' };
  }

  // Buscar usuários por role
  async findByRole(role: string) {
    const users = await this.prisma.user.findMany({
      where: { role: role as any },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar senha
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            published: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return users;
  }

  // Buscar estatísticas de usuários
  async getStats() {
    const [totalUsers, adminUsers, moderatorUsers, regularUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.user.count({ where: { role: 'MODERATOR' } }),
      this.prisma.user.count({ where: { role: 'USER' } })
    ]);

    return {
      totalUsers,
      adminUsers,
      moderatorUsers,
      regularUsers
    };
  }

  // Buscar usuários mais ativos (com mais posts)
  async findMostActive(limit: number = 10) {
    const users = await this.prisma.user.findMany({
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

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      postCount: user._count.posts,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }
} 