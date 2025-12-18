import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNoticiaDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
  titulo: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres' })
  descricao: string;
}
