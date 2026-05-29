import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCertificadoDto {
  @IsString()
  @IsNotEmpty()
  usuario_id!: string;

  @IsString()
  @IsNotEmpty()
  curso_id!: string;

  @IsString()
  @IsNotEmpty()
  inscripcion_id!: string;

  @IsString()
  @IsNotEmpty()
  usuario_nombre!: string;

  @IsString()
  @IsNotEmpty()
  usuario_correo!: string;

  @IsString()
  @IsNotEmpty()
  curso_titulo!: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsDateString()
  @IsOptional()
  fecha_emision?: string;
}
