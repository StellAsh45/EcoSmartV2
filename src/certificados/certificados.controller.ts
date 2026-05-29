import { Controller, Get, Param, Query } from '@nestjs/common';
import { CertificadosService } from './certificados.service';

@Controller('certificados')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Get()
  async findAll(@Query('usuario_id') usuarioId: string) {
    if (!usuarioId) return [];
    return this.certificadosService.findAll(usuarioId);
  }

  @Get('por-curso')
  async findByCurso(
    @Query('usuario_id') usuarioId: string,
    @Query('curso_id') cursoId: string,
  ) {
    if (!usuarioId || !cursoId) return null;
    return this.certificadosService.findByCurso(usuarioId, cursoId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.certificadosService.findOne(id);
  }
}
