import { Body, Controller, Delete, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ResultadosExamenService } from './resultados-examen.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('resultados-examen')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('estudiante')
export class ResultadosExamenController {
  constructor(private readonly resultadosExamenService: ResultadosExamenService) {}

  @Post()
  createOrUpdate(@Request() req: any, @Body() createDto: any) {
    return this.resultadosExamenService.createOrUpdate({
      ...createDto,
      usuario_id: req.user.userId,
    });
  }

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    return this.resultadosExamenService.findAll({
      ...query,
      usuario_id: req.user.userId,
    });
  }

  @Delete()
  deleteOne(@Request() req: any, @Query() query: any) {
    return this.resultadosExamenService.deleteOne({
      ...query,
      usuario_id: req.user.userId,
    });
  }
}
