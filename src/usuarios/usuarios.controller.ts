import { Controller, Get, Post, Body, Param, Delete, Patch, UsePipes, ValidationPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }



  // Las rutas específicas deben ir ANTES que las rutas con parámetros variables (:id)
  @Patch('perfil')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usuariosService.updateProfile(req.user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  async update(@Param('id') id: string, @Body() updateData: any) {
    const usuario = await this.usuariosService.findOne(id);
    if (usuario.rol === 'administrador') {
      throw new ForbiddenException('No puedes modificar cuentas administradoras desde este recurso.');
    }
    return this.usuariosService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  async remove(@Param('id') id: string) {
    const usuario = await this.usuariosService.findOne(id);
    if (usuario.rol === 'administrador') {
      throw new ForbiddenException('No puedes eliminar cuentas administradoras desde este recurso.');
    }
    return this.usuariosService.remove(id);
  }
}
