import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secreto_super_seguro_123',
    });
  }

  async validate(payload: any) {
    let usuario;
    try {
      usuario = await this.usuariosService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException('Sesión inválida.');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Tu cuenta ha sido desactivada.');
    }

    return { 
      userId: payload.sub, 
      correo: usuario.correo,
      nombre: usuario.nombre,
      rol: usuario.rol,
      proveedor: usuario.proveedor || 'local',
    };
  }
}
