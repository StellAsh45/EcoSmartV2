import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './usuarios.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { PASSWORD_CHANGED_SUBJECT, passwordChangedEmailHtml } from '../auth/email-templates';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private readonly mailerService: MailerService,
  ) { }

  /** Limpia el nombre: elimina "undefined" sueltos y espacios extra */
  private limpiarNombre(nombre: string): string {
    return (nombre || '')
      .replace(/\bundefined\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private async corregirNombreEnDb(usuario: UsuarioDocument): Promise<UsuarioDocument> {
    const limpio = this.limpiarNombre(usuario.nombre) || usuario.correo.split('@')[0];
    if (limpio !== usuario.nombre) {
      usuario.nombre = limpio;
      await usuario.save();
    }
    return usuario;
  }

  async findAll(): Promise<UsuarioDocument[]> {
    const usuarios = await this.usuarioModel.find().exec();
    return Promise.all(usuarios.map((u) => this.corregirNombreEnDb(u)));
  }

  async findByEmail(correo: string): Promise<UsuarioDocument | null> {
    const usuario = await this.usuarioModel.findOne({ correo }).exec();
    if (!usuario) return null;
    return this.corregirNombreEnDb(usuario);
  }

  async findByResetToken(token: string): Promise<UsuarioDocument | null> {
    if (!token) return null;
    const usuario = await this.usuarioModel.findOne({ tokenResetPassword: token }).exec();
    if (!usuario) return null;
    return this.corregirNombreEnDb(usuario);
  }

  async findOne(id: string): Promise<UsuarioDocument> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return this.corregirNombreEnDb(usuario);
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const userData: any = {
      ...dto,
      nombre: this.limpiarNombre(dto.nombre) || dto.correo.split('@')[0],
    };

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

    if (updateData.nombre) {
      updateData.nombre = this.limpiarNombre(updateData.nombre) || updateData.nombre;
    }

    const updated = await this.usuarioModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return this.corregirNombreEnDb(updated);
  }

  async savePasswordResetRequest(
    id: string,
    token: string,
    tokenResetPasswordExpira: Date,
    intentosResetPassword: Date[],
  ): Promise<UsuarioDocument> {
    const updated = await this.usuarioModel
      .findByIdAndUpdate(
        id,
        { tokenResetPassword: token, tokenResetPasswordExpira, intentosResetPassword },
        { new: true },
      )
      .exec();

    if (!updated) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return this.corregirNombreEnDb(updated);
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
    const updateData: any = { nombre: this.limpiarNombre(dto.nombre) || dto.nombre };

    // 3. Manejar cambio de contraseña
    if (dto.nuevaContrasena) {
      if (usuario.proveedor === 'google') {
        throw new BadRequestException('No puedes cambiar la contraseña de una cuenta vinculada a Google.');
      }

      const isSameAsCurrent = await bcrypt.compare(dto.nuevaContrasena, usuario.contrasena);
      if (isSameAsCurrent) {
        throw new BadRequestException('La nueva contraseña no puede ser igual a la actual.');
      }

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

      const salt = await bcrypt.genSalt(10);
      updateData.contrasena = await bcrypt.hash(dto.nuevaContrasena, salt);

      usuario.intentosResetPassword = [...intentosRecientes, new Date()];
      await usuario.save();

      try {
        await this.mailerService.sendMail({
          to: usuario.correo,
          subject: PASSWORD_CHANGED_SUBJECT,
          html: passwordChangedEmailHtml(),
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
