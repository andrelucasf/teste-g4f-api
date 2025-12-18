import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { Noticia } from './entities/noticia.entity';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Noticia]), QueueModule],
  controllers: [NoticiasController],
  providers: [NoticiasService],
})
export class NoticiasModule {}
