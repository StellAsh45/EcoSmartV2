import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) { }

  async validarUsuario(correo: string, pass: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(correo);
    if (!usuario) return null;

    // Validar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Por favor, activa tu cuenta en tu correo electrónico.');
    }

    // Si el usuario es de Google y trata de entrar por formulario local
    if (!usuario.contrasena || usuario.proveedor === 'google') {
      throw new UnauthorizedException('Esta cuenta está vinculada a Google. Por favor, inicia sesión con Google.');
    }

    if (await bcrypt.compare(pass, usuario.contrasena)) {
      const { contrasena, ...result } = (usuario as any).toObject();
      return result;
    }
    return null;
  }

  async login(usuario: any) {
    const payload = {
      sub: usuario._id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      rol: usuario.rol,
      proveedor: usuario.proveedor || 'local'
    };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: payload
    };
  }

  async registro(dto: CreateUsuarioDto) {
    const existe = await this.usuariosService.findByEmail(dto.correo);
    if (existe) {
      throw new ConflictException('El correo ya está registrado');
    }

    const token = uuidv4();

    // Creamos el usuario enviando el token (Mongoose lo aceptará)
    const usuario = await this.usuariosService.create({
      ...dto,
      tokenActivacion: token,
      activo: false,
      proveedor: 'local'
    } as any);

    // Enviamos el correo 
    await this.mailerService.sendMail({
      to: dto.correo,
      subject: '¡Activa tu cuenta en EcoSmart!',
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #020617; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #0f172a; padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; margin-bottom: 20px; }
        .content { padding: 40px; text-align: center; color: #ffffff; }
        .badge { display: inline-block; background-color: rgba(16, 249, 129, 0.1); color: #4ade80; padding: 8px 16px; border-radius: 50px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 24px; border: 1px solid rgba(16, 249, 129, 0.2); }
        h1 { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; color: #ffffff; margin: 0 0 16px 0; letter-spacing: -0.02em; }
        .highlight { color: #10f981; }
        p { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }
        .button { display: inline-block; background-color: #10f981; color: #000000; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer { padding: 30px; text-align: center; border-top: 1px solid #1e293b; background-color: #0f172a; }
        .footer p { font-size: 14px; color: #64748b; margin: 0; margin-bottom: 5px; }
        .accent-text { color: #4ade80; font-weight: bold; }
        @media only screen and (max-width: 600px) { .container { margin: 0; width: 100%; border-radius: 0; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://qdnivmcnsidcwlbfiuxj.supabase.co/storage/v1/object/public/cursos/logocorreos/EcoSmart-icon.png" alt="EcoSmart Logo" class="logo">
            <div style="font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900;">
                <span style="color: #135300;">Eco</span><span style="color: #7CBC02;">Smart</span>
            </div>
        </div>
        <!-- Contenido Principal -->
        <div class="content">
            <div class="badge">
                <span style="display:inline-block; width: 6px; height: 6px; background-color: #4ade80; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>
                Nueva Cuenta
            </div>
            <h1>¡Hola ${dto.nombre}! <br>Bienvenido a tu <br><span class="highlight">Futuro Verde</span></h1>
            <p>
                Estamos emocionados de que te unas a <strong>EcoSmart</strong>. <br>
                La educación ambiental es el primer paso para transformar el planeta. Activa tu cuenta ahora y comienza a aprender.
            </p>
            
            <a href="http://localhost:3000/auth/activar?token=${token}" class="button">Confirmar Registro</a>
            <p style="margin-top: 32px; font-size: 12px; color: #64748b;">
                Si no creaste esta cuenta, puedes ignorar este correo con seguridad.
            </p>
        </div>
        <!-- Pie de Página -->
        <div class="footer">
            <p>© 2026 <strong>EcoSmart</strong>. Todos los derechos reservados.</p>
            <p class="accent-text">Hecho con ❤️ para el planeta.</p>
        </div>
    </div>
</body>
</html>
      `,
    });

    return usuario;
  }

  async activarCuenta(token: string) {
    // Buscamos a todos los usuarios para encontrar el que tenga el token
    const usuarios = await this.usuariosService.findAll();
    const usuario = usuarios.find(u => u.tokenActivacion === token);

    if (!usuario) {
      throw new NotFoundException('Token de activación inválido');
    }

    await this.usuariosService.update((usuario as any)._id, {
      activo: true,
      tokenActivacion: null
    });

    return { message: 'Cuenta activada exitosamente' };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const { email, firstName, lastName } = req.user;
    let usuario: any = await this.usuariosService.findByEmail(email);

    if (!usuario) {
      // Registrar al nuevo usuario si no existe
      usuario = await this.usuariosService.create({
        correo: email,
        nombre: `${firstName} ${lastName}`.trim(),
        rol: 'estudiante',
        proveedor: 'google'
      } as any);

      // Lo activamos inmediatamente ya que Google ya verificó el correo
      usuario = await this.usuariosService.update((usuario as any)._id, {
        activo: true,
        tokenActivacion: null
      });
    } else if (!usuario.activo) {
      // Si existía pero no estaba activo, lo activamos
      usuario = await this.usuariosService.update((usuario as any)._id, {
        activo: true,
        tokenActivacion: null
      });
    }

    // Retornamos el login normal con JWT
    return this.login(usuario);
  }
}
