import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Noticias Controller (e2e) - BDD', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Aplica as mesmas configurações do main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.setGlobalPrefix('api');

    await app.init();

    // Obtém o DataSource para limpar o banco entre os testes
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    // Limpa a tabela de notícias antes de cada teste
    await dataSource.query('DELETE FROM noticias');
  });

  describe('Funcionalidade: Criar uma nova notícia', () => {
    describe('Cenário: Criar notícia com dados válidos', () => {
      it('Dado que eu tenho dados válidos de uma notícia, Quando eu envio uma requisição POST, Então a notícia deve ser criada com sucesso', async () => {
        // Arrange - Preparação
        const noticiaValida = {
          titulo: 'Nova Tecnologia Revoluciona o Mercado',
          descricao:
            'Uma nova tecnologia promete transformar completamente a forma como trabalhamos e nos comunicamos.',
        };

        // Act - Ação
        const response = await request(app.getHttpServer())
          .post('/api/noticias')
          .send(noticiaValida)
          .expect(201);

        // Assert - Verificação
        expect(response.body).toHaveProperty('id');
        expect(response.body.titulo).toBe(noticiaValida.titulo);
        expect(response.body.descricao).toBe(noticiaValida.descricao);
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      });
    });

    describe('Cenário: Tentar criar notícia com dados inválidos', () => {
      it('Dado que eu envio um título muito curto, Quando eu tento criar a notícia, Então devo receber um erro de validação', async () => {
        // Arrange
        const noticiaInvalida = {
          titulo: 'Abc', // Título com menos de 5 caracteres
          descricao: 'Descrição válida com mais de 10 caracteres',
        };

        // Act & Assert
        const response = await request(app.getHttpServer())
          .post('/api/noticias')
          .send(noticiaInvalida)
          .expect(400);

        // Verifica a mensagem de erro
        expect(response.body.message).toContain('O título deve ter no mínimo 5 caracteres');
      });

      it('Dado que eu envio uma descrição muito curta, Quando eu tento criar a notícia, Então devo receber um erro de validação', async () => {
        // Arrange
        const noticiaInvalida = {
          titulo: 'Título válido com mais de 5 caracteres',
          descricao: 'Curta', // Descrição com menos de 10 caracteres
        };

        // Act & Assert
        const response = await request(app.getHttpServer())
          .post('/api/noticias')
          .send(noticiaInvalida)
          .expect(400);

        // Verifica a mensagem de erro
        expect(response.body.message).toContain('A descrição deve ter no mínimo 10 caracteres');
      });

      it('Dado que eu não envio o título, Quando eu tento criar a notícia, Então devo receber um erro de validação', async () => {
        // Arrange
        const noticiaInvalida = {
          descricao: 'Descrição válida com mais de 10 caracteres',
        };

        // Act & Assert
        const response = await request(app.getHttpServer())
          .post('/api/noticias')
          .send(noticiaInvalida)
          .expect(400);

        // Verifica a mensagem de erro
        expect(response.body.message).toContain('O título é obrigatório');
      });

      it('Dado que eu envio campos extras não permitidos, Quando eu tento criar a notícia, Então devo receber um erro de validação', async () => {
        // Arrange
        const noticiaComCampoExtra = {
          titulo: 'Título válido com mais de 5 caracteres',
          descricao: 'Descrição válida com mais de 10 caracteres',
          campoInvalido: 'Este campo não deveria existir',
        };

        // Act & Assert
        await request(app.getHttpServer())
          .post('/api/noticias')
          .send(noticiaComCampoExtra)
          .expect(400);
      });
    });
  });

  describe('Funcionalidade: Listar notícias com paginação e filtros', () => {
    beforeEach(async () => {
      // Cria notícias de teste
      await request(app.getHttpServer()).post('/api/noticias').send({
        titulo: 'Tecnologia Avança no Brasil',
        descricao: 'Notícia sobre avanços tecnológicos no país',
      });

      await request(app.getHttpServer()).post('/api/noticias').send({
        titulo: 'Economia em Alta',
        descricao: 'Mercado financeiro apresenta crescimento',
      });

      await request(app.getHttpServer()).post('/api/noticias').send({
        titulo: 'Tecnologia e Inovação',
        descricao: 'Startups brasileiras ganham destaque internacional',
      });
    });

    describe('Cenário: Listar todas as notícias com paginação', () => {
      it('Dado que existem notícias cadastradas, Quando eu solicito a listagem, Então devo receber as notícias paginadas com metadados', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .get('/api/noticias')
          .query({ page: 1, limit: 2 })
          .expect(200);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.data).toHaveLength(2);
        expect(response.body.meta.total).toBe(3);
        expect(response.body.meta.page).toBe(1);
        expect(response.body.meta.limit).toBe(2);
        expect(response.body.meta.totalPages).toBe(2);
      });
    });

    describe('Cenário: Filtrar notícias por título', () => {
      it('Dado que existem notícias com "Tecnologia" no título, Quando eu filtro por este termo, Então devo receber apenas as notícias correspondentes', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .get('/api/noticias')
          .query({ titulo: 'Tecnologia' })
          .expect(200);

        // Assert
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0].titulo).toContain('Tecnologia');
        expect(response.body.data[1].titulo).toContain('Tecnologia');
      });
    });

    describe('Cenário: Filtrar notícias por descrição', () => {
      it('Dado que existem notícias com "Brasil" na descrição, Quando eu filtro por este termo, Então devo receber apenas as notícias correspondentes', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .get('/api/noticias')
          .query({ descricao: 'brasil' })
          .expect(200);

        // Assert
        expect(response.body.data).toHaveLength(2);
        response.body.data.forEach((noticia) => {
          expect(noticia.descricao.toLowerCase()).toContain('brasil');
        });
      });
    });
  });

  describe('Funcionalidade: Atualizar notícia', () => {
    let noticiaId: string;

    beforeEach(async () => {
      // Cria uma notícia para atualizar
      const response = await request(app.getHttpServer()).post('/api/noticias').send({
        titulo: 'Título Original',
        descricao: 'Descrição original da notícia',
      });
      noticiaId = response.body.id;
    });

    it('Dado que eu tenho uma notícia existente, Quando eu atualizo seus dados, Então a notícia deve ser atualizada com sucesso', async () => {
      // Arrange
      const dadosAtualizados = {
        titulo: 'Título Atualizado',
        descricao: 'Descrição atualizada da notícia',
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch(`/api/noticias/${noticiaId}`)
        .send(dadosAtualizados)
        .expect(200);

      // Assert
      expect(response.body.id).toBe(noticiaId);
      expect(response.body.titulo).toBe(dadosAtualizados.titulo);
      expect(response.body.descricao).toBe(dadosAtualizados.descricao);
    });
  });

  describe('Funcionalidade: Deletar notícia', () => {
    let noticiaId: string;

    beforeEach(async () => {
      // Cria uma notícia para deletar
      const response = await request(app.getHttpServer()).post('/api/noticias').send({
        titulo: 'Notícia para Deletar',
        descricao: 'Esta notícia será deletada nos testes',
      });
      noticiaId = response.body.id;
    });

    it('Dado que eu tenho uma notícia existente, Quando eu a deleto, Então ela deve ser removida com sucesso', async () => {
      // Act - Deleta a notícia
      await request(app.getHttpServer()).delete(`/api/noticias/${noticiaId}`).expect(204);

      // Assert - Verifica que a notícia não existe mais
      await request(app.getHttpServer()).get(`/api/noticias/${noticiaId}`).expect(404);
    });
  });

  describe('Funcionalidade: Buscar notícia específica', () => {
    it('Dado que eu busco uma notícia inexistente, Quando eu faço a requisição, Então devo receber erro 404', async () => {
      // Arrange
      const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get(`/api/noticias/${idInexistente}`)
        .expect(404);

      expect(response.body.message).toContain('não encontrada');
    });
  });
});
