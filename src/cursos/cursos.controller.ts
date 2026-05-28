import { Controller, Get, Patch, Put, Post, Delete, Param, Body } from '@nestjs/common';
import { CursosService } from './cursos.service';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get()
  async findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  async updatePatch(@Param('id') id: string, @Body() updateData: any) {
    console.log(`Actualizando curso (PATCH) ${id}:`, updateData);
    return this.cursosService.update(id, updateData);
  }

  @Put(':id')
  async updatePut(@Param('id') id: string, @Body() updateData: any) {
    console.log(`Actualizando curso (PUT) ${id}:`, updateData);
    return this.cursosService.update(id, updateData);
  }

  @Post()
  async create(@Body() createData: any) {
    console.log(`Creando nuevo curso:`, createData.titulo);
    return this.cursosService.create(createData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`Eliminando curso ${id}`);
    return this.cursosService.delete(id);
  }
}
