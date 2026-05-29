import { Controller, Get, Post, Query, Param, Body, Patch, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('inscripciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('estudiante')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  async create(@Request() req: any, @Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionesService.create({
      ...createInscripcionDto,
      usuario_id: req.user.userId,
    });
  }

  @Get()
  async findAll(@Request() req: any, @Query() query: any) {
    return this.inscripcionesService.findAll({
      ...query,
      usuario_id: req.user.userId,
    });
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const inscripcion = await this.inscripcionesService.findOne(id);
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    this.validarPropietario(req.user.userId, inscripcion.usuario_id);
    return inscripcion;
  }

  @Patch(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() updateData: any) {
    const inscripcion = await this.inscripcionesService.findOne(id);
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    this.validarPropietario(req.user.userId, inscripcion.usuario_id);
    return this.inscripcionesService.update(id, {
      ...updateData,
      usuario_id: req.user.userId,
    });
  }

  private validarPropietario(userId: string, ownerId: any) {
    if (String(ownerId) !== String(userId)) {
      throw new ForbiddenException('Solo puedes acceder a tus propias inscripciones.');
    }
  }
}
