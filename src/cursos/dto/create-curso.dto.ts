import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  nivel!: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsArray()
  @IsOptional()
  modulos?: any[];
}
