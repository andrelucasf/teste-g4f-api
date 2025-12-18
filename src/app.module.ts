import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from './database/database.module';
import { NoticiasModule } from './noticias/noticias.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuração de cache em memória
    CacheModule.register({
      isGlobal: true,
      ttl: parseInt(process.env.CACHE_TTL || '300') * 1000, // 5 minutos em ms
      max: 100, // máximo de 100 itens no cache
    }),

    // Database com TypeORM
    DatabaseModule,

    // Módulo de fila mock
    QueueModule,

    // Módulo de Notícias
    NoticiasModule,
  ],
})
export class AppModule {}
