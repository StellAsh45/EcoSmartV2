import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  rol!: string;

  @IsEmail()
  @IsNotEmpty()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  contrasena!: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
