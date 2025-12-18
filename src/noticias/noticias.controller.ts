import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { ListNoticiasDto } from './dto/list-noticias.dto';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNoticiaDto: CreateNoticiaDto) {
    return this.noticiasService.create(createNoticiaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() listDto: ListNoticiasDto) {
    return this.noticiasService.findAll(listDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.noticiasService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateNoticiaDto: UpdateNoticiaDto) {
    return this.noticiasService.update(id, updateNoticiaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.noticiasService.remove(id);
  }
}
