import { Controller, Post, Get, Body, Query, UnauthorizedException, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() body: any) {
    const usuario = await this.authService.validarUsuario(body.correo, body.contrasena);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return this.authService.login(usuario);
  }

  @Post('register')
  async register(@Body() dto: CreateUsuarioDto) {
    return this.authService.registro(dto);
  }

  @Get('activar')
  async activar(@Query('token') token: string) {
    return this.authService.activarCuenta(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Inicia el flujo de OAuth de Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const session = await this.authService.googleLogin(req);

    // Convertir el usuario a string para pasarlo por URL
    const userStr = encodeURIComponent(JSON.stringify(session.usuario));

    // Redirigir al frontend con los datos de sesión en la URL
    // Asumiendo que el frontend está en localhost:5500 por Live Server
    // Puedes ajustarlo con process.env.FRONTEND_URL si deseas.
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5500';
    return res.redirect(`${frontendUrl}/ingreso.html?token=${session.access_token}&usuario=${userStr}`);
  }
}
