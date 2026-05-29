import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/, {
    message: 'La nueva contraseña debe tener mínimo 6 caracteres, una mayúscula, un número y un símbolo.',
  })
  nuevaContrasena: string;

  @IsString()
  confirmarNuevaContrasena: string;
}
