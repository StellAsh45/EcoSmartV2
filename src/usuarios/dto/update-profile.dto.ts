import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsOptional()
  @IsString()
  contrasenaActual?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/, {
    message: 'La nueva contraseña debe tener mínimo 6 caracteres, una mayúscula, un número y un símbolo.',
  })
  nuevaContrasena?: string;

  @IsOptional()
  @IsString()
  confirmarNuevaContrasena?: string;
}
