import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListNewsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro' })
  @Min(1, { message: 'A página deve ser maior ou igual a 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(1, { message: 'O limite deve ser maior ou igual a 1' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'O filtro de título deve ser uma string' })
  titulo?: string;

  @IsOptional()
  @IsString({ message: 'O filtro de descrição deve ser uma string' })
  descricao?: string;
}
