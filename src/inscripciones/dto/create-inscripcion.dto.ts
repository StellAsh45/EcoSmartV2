import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateInscripcionDto {
  @IsString()
  @IsNotEmpty()
  usuario_id!: string;

  @IsString()
  @IsNotEmpty()
  curso_id!: string;

  @IsNumber()
  @IsOptional()
  progreso_porcentaje?: number;

  @IsObject()
  @IsOptional()
  examen?: any;

  @IsString()
  @IsOptional()
  estado_curso?: string;
}
