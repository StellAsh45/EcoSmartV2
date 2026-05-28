import { Controller, Get, Post, Query, Param, Body, Patch } from '@nestjs/common';
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.inscripcionesService.update(id, updateData);
  }
}
