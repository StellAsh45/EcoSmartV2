import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
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

  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const { buffer, filename } = await this.certificadosService.generarPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }
}
