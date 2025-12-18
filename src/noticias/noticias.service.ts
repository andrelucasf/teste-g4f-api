import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Noticia } from './entities/noticia.entity';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { ListNoticiasDto } from './dto/list-noticias.dto';
import { PaginatedNoticias } from './interfaces/paginated-response.interface';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private readonly noticiaRepository: Repository<Noticia>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly queueService: QueueService,
  ) {}

  async create(createNoticiaDto: CreateNoticiaDto): Promise<Noticia> {
    const noticia = this.noticiaRepository.create(createNoticiaDto);
    const savedNoticia = await this.noticiaRepository.save(noticia);

    // Invalida o cache após criar uma notícia
    await this.invalidateListCache();

    // Enfileira notificação assíncrona
    await this.queueService.addNotification({
      type: 'noticia_criada',
      noticiaId: savedNoticia.id,
      titulo: savedNoticia.titulo,
    });

    return savedNoticia;
  }

  async findAll(listDto: ListNoticiasDto): Promise<PaginatedNoticias> {
    const { page, limit, titulo, descricao } = listDto;

    // Gera chave de cache baseada nos parâmetros
    const cacheKey = `noticias:${page}:${limit}:${titulo || ''}:${descricao || ''}`;

    // Tenta buscar do cache
    const cachedData = await this.cacheManager.get<PaginatedNoticias>(cacheKey);
    if (cachedData) {
      console.log('📦 Retornando dados do cache');
      return cachedData;
    }

    // Constrói a query com filtros
    const where: any = {};
    if (titulo) {
      where.titulo = Like(`%${titulo}%`);
    }
    if (descricao) {
      where.descricao = Like(`%${descricao}%`);
    }

    // Busca paginada
    const [data, total] = await this.noticiaRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    const result: PaginatedNoticias = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Salva no cache
    await this.cacheManager.set(cacheKey, result);
    console.log('💾 Dados salvos no cache');

    return result;
  }

  async findOne(id: string): Promise<Noticia> {
    const noticia = await this.noticiaRepository.findOne({ where: { id } });

    if (!noticia) {
      throw new NotFoundException(`Notícia com ID ${id} não encontrada`);
    }

    return noticia;
  }

  async update(id: string, updateNoticiaDto: UpdateNoticiaDto): Promise<Noticia> {
    const noticia = await this.findOne(id);

    Object.assign(noticia, updateNoticiaDto);
    const updatedNoticia = await this.noticiaRepository.save(noticia);

    // Invalida o cache após atualizar
    await this.invalidateListCache();

    return updatedNoticia;
  }

  async remove(id: string): Promise<void> {
    const noticia = await this.findOne(id);
    await this.noticiaRepository.remove(noticia);

    // Invalida o cache após deletar
    await this.invalidateListCache();
  }

  private async invalidateListCache(): Promise<void> {
    // Em uma implementação real com Redis, você usaria pattern matching
    // Por ora, resetamos todo o cache
    await this.cacheManager.reset();
    console.log('🗑️  Cache invalidado');
  }
}
