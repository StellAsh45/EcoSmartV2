import { Controller, Get, Post, Body, Param, Delete, Patch, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  // Las rutas específicas deben ir ANTES que las rutas con parámetros variables (:id)
  @Patch('perfil')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usuariosService.updateProfile(req.user.userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.usuariosService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
