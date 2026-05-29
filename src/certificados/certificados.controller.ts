import { Controller, ForbiddenException, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { CertificadosService } from './certificados.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('certificados')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('estudiante')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.certificadosService.findAll(req.user.userId);
  }

  @Get('por-curso')
  async findByCurso(
    @Request() req: any,
    @Query('curso_id') cursoId: string,
  ) {
    if (!cursoId) return null;
    return this.certificadosService.findByCurso(req.user.userId, cursoId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const certificado = await this.certificadosService.findOne(id);
    if (String(certificado.usuario_id) !== String(req.user.userId)) {
      throw new ForbiddenException('Solo puedes acceder a tus propios certificados.');
    }
    return certificado;
  }
}
