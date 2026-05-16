import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  async create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionesService.create(createInscripcionDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.inscripcionesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inscripcionesService.findOne(id);
  }
}
