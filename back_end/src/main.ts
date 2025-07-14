import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Configurar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // URL do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Blog Pessoal API')
    .setDescription('API para blog pessoal com autenticação, posts, categorias e tags')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('posts', 'Endpoints de posts')
    .addTag('categories', 'Endpoints de categorias')
    .addTag('tags', 'Endpoints de tags')
    .addTag('users', 'Endpoints de usuários')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o token JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log('🚀 Aplicação rodando em http://localhost:3001');
  console.log('📚 Documentação Swagger disponível em http://localhost:3001/api');
}
bootstrap();
