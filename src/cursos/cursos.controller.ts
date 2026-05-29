import { Controller, Get, Patch, Put, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Request() req: any) {
    if (req.user?.rol === 'administrador') {
      return this.cursosService.findAll();
    }
    return this.cursosService.findPublished();
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Request() req: any, @Param('id') id: string) {
    if (req.user?.rol === 'administrador') {
      return this.cursosService.findOne(id);
    }
    return this.cursosService.findOnePublished(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  async updatePatch(@Param('id') id: string, @Body() updateData: any) {
    console.log(`Actualizando curso (PATCH) ${id}:`, updateData);
    return this.cursosService.update(id, updateData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  async updatePut(@Param('id') id: string, @Body() updateData: any) {
    console.log(`Actualizando curso (PUT) ${id}:`, updateData);
    return this.cursosService.update(id, updateData);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  async create(@Body() createData: any) {
    console.log(`Creando nuevo curso:`, createData.titulo);
    return this.cursosService.create(createData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  async delete(@Param('id') id: string) {
    console.log(`Eliminando curso ${id}`);
    return this.cursosService.delete(id);
  }
}
