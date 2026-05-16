import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
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
  async update(@Param('id') id: string, @Body() updateData: any) {
    console.log(`Actualizando curso ${id}:`, updateData);
    return this.cursosService.update(id, updateData);
  }
}
