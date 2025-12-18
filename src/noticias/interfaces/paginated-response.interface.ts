import { Noticia } from '../entities/noticia.entity';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PaginatedNoticias = PaginatedResponse<Noticia>;
