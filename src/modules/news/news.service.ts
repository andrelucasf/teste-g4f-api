import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ListNewsDto } from './dto/list-news.dto';
import { PaginatedNews } from './interfaces/paginated-response.interface';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create(createNewsDto);
    const savedNews = await this.newsRepository.save(news);

    await this.invalidateListCache();

    return savedNews;
  }

  async findAll(listDto: ListNewsDto): Promise<PaginatedNews> {
    const { page, limit, titulo, descricao } = listDto;

    const cacheKey = `news:${page}:${limit}:${titulo || ''}:${descricao || ''}`;

    const cachedData = await this.cacheManager.get<PaginatedNews>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const where: any = {};
    if (titulo) {
      where.titulo = Like(`%${titulo}%`);
    }
    if (descricao) {
      where.descricao = Like(`%${descricao}%`);
    }

    const [data, total] = await this.newsRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    const result: PaginatedNews = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cacheManager.set(cacheKey, result);

    return result;
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });

    if (!news) {
      throw new NotFoundException(`Notícia com ID ${id} não encontrada`);
    }

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);

    Object.assign(news, updateNewsDto);
    const updatedNews = await this.newsRepository.save(news);

    await this.invalidateListCache();

    return updatedNews;
  }

  async remove(id: string): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);

    await this.invalidateListCache();
  }

  private async invalidateListCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
