import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './usuarios.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private readonly mailerService: MailerService,
  ) { }

  async findAll(): Promise<UsuarioDocument[]> {
    return this.usuarioModel.find().exec();
  }

  async findByEmail(correo: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findOne({ correo }).exec();
  }

  async findOne(id: string): Promise<UsuarioDocument> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const userData: any = { ...dto };

    if (dto.contrasena) {
      const salt = await bcrypt.genSalt(10);
      userData.contrasena = await bcrypt.hash(dto.contrasena, salt);
    }

    const newUsuario = new this.usuarioModel(userData);
    return newUsuario.save();
  }

  async remove(id: string): Promise<any> {
    const result = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return result;
  }

  async update(id: string, updateData: any): Promise<Usuario> {
    if (updateData.contrasena) {
      const salt = await bcrypt.genSalt(10);
      updateData.contrasena = await bcrypt.hash(updateData.contrasena, salt);
    }

    const updated = await this.usuarioModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return updated;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) throw new NotFoundException(`Usuario no encontrado`);

    if (!usuario.activo) {
      throw new BadRequestException('Tu cuenta ha sido desactivada. No puedes realizar cambios.');
    }

    // 1. Verificar contraseña actual (SOLO para usuarios locales o si intentan cambiar contraseña)
    if (usuario.proveedor === 'local') {
      if (!dto.contrasenaActual) {
        throw new BadRequestException('Debes ingresar tu contraseña actual para realizar cambios.');
      }
      const isPasswordValid = await bcrypt.compare(dto.contrasenaActual, usuario.contrasena);
      if (!isPasswordValid) {
        throw new UnauthorizedException('La contraseña actual no es correcta.');
      }
    }

    // 2. Preparar actualización
    const updateData: any = { nombre: dto.nombre };

    // 3. Manejar cambio de contraseña
    if (dto.nuevaContrasena) {
      if (usuario.proveedor === 'google') {
        throw new BadRequestException('No puedes cambiar la contraseña de una cuenta vinculada a Google.');
      }

      // Verificar si es igual a la actual
      const isSameAsCurrent = await bcrypt.compare(dto.nuevaContrasena, usuario.contrasena);
      if (isSameAsCurrent) {
        throw new BadRequestException('La nueva contraseña no puede ser igual a la actual.');
      }

      // Verificar Rate Limit (Max 2 por hora)
      const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
      const intentosRecientes = (usuario.intentosResetPassword || []).filter(
        (fecha) => fecha > unaHoraAtras,
      );

      if (intentosRecientes.length >= 2) {
        const masAntiguo = intentosRecientes[0];
        const minutosRestantes = Math.ceil(
          (60 * 60 * 1000 - (Date.now() - masAntiguo.getTime())) / (60 * 1000),
        );
        throw new BadRequestException(
          `Has excedido el máximo de 2 cambios por hora. Debes esperar ${minutosRestantes} minutos.`,
        );
      }

      // Hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      updateData.contrasena = await bcrypt.hash(dto.nuevaContrasena, salt);

      // Registrar intento
      usuario.intentosResetPassword = [...intentosRecientes, new Date()];
      await usuario.save();

      // Enviar correo
      try {
        await this.mailerService.sendMail({
          to: usuario.correo,
          subject: 'Tu contraseña ha sido actualizada - EcoSmart',
          html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #020617; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; }
        .header { background-color: #0f172a; padding: 40px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; margin-bottom: 20px; }
        .content { padding: 40px; text-align: center; color: #ffffff; }
        .badge { display: inline-block; background-color: rgba(16, 249, 129, 0.1); color: #4ade80; padding: 8px 16px; border-radius: 50px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 24px; border: 1px solid rgba(16, 249, 129, 0.2); }
        h1 { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; color: #ffffff; margin: 0 0 16px 0; letter-spacing: -0.02em; }
        .highlight { color: #10f981; }
        p { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }
        .footer { padding: 30px; text-align: center; border-top: 1px solid #1e293b; background-color: #0f172a; }
        .footer p { font-size: 14px; color: #64748b; margin: 0; }
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
        <div class="content">
            <div class="badge">
                <span style="display:inline-block; width: 6px; height: 6px; background-color: #4ade80; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>
                Actualización Exitosa
            </div>
            <h1>Tu Contraseña ha sido <br><span class="highlight">Actualizada</span></h1>
            <p>
                Hola, te informamos que la contraseña de tu cuenta en <strong>EcoSmart</strong> ha sido modificada correctamente.
            </p>
            <p style="margin-top: 32px; font-size: 12px; color: #64748b;">
                <strong>¿No fuiste tú?</strong> Si no realizaste este cambio, por favor ponte en contacto con nuestro equipo de soporte de inmediato para proteger tu cuenta.
            </p>
        </div>
        <div class="footer">
            <p>© 2026 <strong>EcoSmart</strong>. Todos los derechos reservados.</p>
            <p class="accent-text">Hecho con ❤️ para el planeta.</p>
        </div>
    </div>
</body>
</html>
`,
        });
      } catch (error) {
        console.error('Error enviando correo de actualización de contraseña:', error);
      }
    }

    // 4. Ejecutar actualización final
    const updated = await this.usuarioModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('No se pudo actualizar el perfil');

    return updated;
  }
}
